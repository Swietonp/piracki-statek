"""
ZnalezionePL - Backend API
Portal do udostępniania danych o rzeczach znalezionych dla dane.gov.pl

HackNation 2024
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List, Literal, Set, Union
from dataclasses import dataclass
from datetime import datetime, date
from enum import Enum
from urllib.parse import urlparse
import json
import csv
import io
import httpx
import xml.etree.ElementTree as ET
from xml.dom import minidom
import logging

# Opcjonalny import rdflib do walidacji RDF
try:
    from rdflib import ConjunctiveGraph, Graph, URIRef
    RDFLIB_AVAILABLE = True
except ImportError:
    RDFLIB_AVAILABLE = False
    ConjunctiveGraph = None
    Graph = None
    URIRef = None

logger = logging.getLogger("znalezione")


# ============== WALIDACJA RDF (zgodna z dane.gov.pl) ==============

# Typy zgodne z https://5stardata.info
OpennessScoreValue = Literal[1, 2, 3, 4, 5]


@dataclass
class SourceData:
    """Dane źródłowe do walidacji - zgodne z mcod"""
    extension: str
    data: Optional[bytes] = None


# Mapowanie rozszerzeń RDF na formaty MIME
RDF_FORMAT_TO_MIMETYPE = {
    "rdf": "xml",
    "xml": "xml",
    "jsonld": "json-ld",
    "ttl": "turtle",
    "turtle": "turtle",
    "n3": "n3",
    "nt": "nt",
    "nt11": "nt",
    "ntriples": "nt",
    "nq": "nquads",
    "nquads": "nquads",
    "trix": "trix",
    "trig": "trig",
    "rdfa": "rdfa",
}


def graph_contains_linked_data(graph) -> bool:
    """
    Sprawdza czy graf RDF zawiera dane zlinkowane (Linked Data).
    Linked Data = URI z różnych domen (więcej niż 1 domena).
    
    Zgodne z: mcod/resources/score_computation/calculators/contains_linked_data.py
    """
    if not RDFLIB_AVAILABLE:
        return False
    
    def add_graph_uri(triple_elem, predicate, graph_uris: Set):
        if isinstance(triple_elem, URIRef) and not str(predicate).startswith("http://www.w3.org/1999/02/22-rdf-syntax-ns#"):
            graph_uris.add(urlparse(str(triple_elem)).netloc)
    
    graph_uris = set()
    for g in graph.store.contexts():
        for subject, predicate, object_ in g:
            add_graph_uri(subject, predicate, graph_uris)
            add_graph_uri(object_, predicate, graph_uris)
            if len(graph_uris) > 1:
                return True
    return False


def calculate_score_for_rdf(source_data: SourceData) -> OpennessScoreValue:
    """
    Oblicza wynik otwartości danych RDF zgodnie z 5stardata.info
    
    Score 4: Poprawny plik RDF (używa otwartych standardów W3C)
    Score 5: Zawiera Linked Data (URI z różnych domen)
    
    Zgodne z: mcod/resources/score_computation/calculators/calculator_xml.py
    """
    default_score: OpennessScoreValue = 4
    
    if not RDFLIB_AVAILABLE:
        logger.warning("rdflib not available, returning default score")
        return default_score
    
    if source_data.data is None:
        return default_score
    
    extension = source_data.extension.lower()
    graph = ConjunctiveGraph()
    
    try:
        # Pobierz format parsowania
        parse_format = RDF_FORMAT_TO_MIMETYPE.get(extension, "xml")
        
        # Parsuj dane RDF
        graph = graph.parse(data=source_data.data, format=parse_format)
        
        # Sprawdź czy są jakiekolwiek triple
        has_triples = any([len(g) for g in graph.store.contexts()])
        
        if not has_triples:
            logger.info("RDF file has no triples")
            return default_score
        
        # Sprawdź czy zawiera Linked Data
        if not graph_contains_linked_data(graph):
            logger.info("RDF file does not contain linked data")
            return default_score
        
    except Exception as e:
        logger.exception(f"Handled exception in calculate_score_for_rdf: {repr(e)}")
        return default_score
    
    # Plik zawiera Linked Data - score 5
    return 5


def validate_rdf_xml(data: bytes, extension: str = "rdf") -> dict:
    """
    Waliduje plik RDF/XML i zwraca szczegółowy raport.
    """
    result = {
        "valid": False,
        "openness_score": 0,
        "openness_score_description": "",
        "errors": [],
        "warnings": [],
        "stats": {
            "triples_count": 0,
            "subjects_count": 0,
            "predicates_count": 0,
            "objects_count": 0,
            "namespaces": [],
            "domains": []
        }
    }
    
    if not RDFLIB_AVAILABLE:
        result["errors"].append("Biblioteka rdflib nie jest dostępna. Zainstaluj: pip install rdflib")
        return result
    
    try:
        # Parsowanie RDF
        graph = ConjunctiveGraph()
        parse_format = RDF_FORMAT_TO_MIMETYPE.get(extension.lower(), "xml")
        graph.parse(data=data, format=parse_format)
        
        # Zbierz statystyki
        subjects = set()
        predicates = set()
        objects = set()
        domains = set()
        triples_count = 0
        
        for g in graph.store.contexts():
            for subject, predicate, obj in g:
                triples_count += 1
                subjects.add(str(subject))
                predicates.add(str(predicate))
                objects.add(str(obj))
                
                # Zbierz domeny z URI
                if isinstance(subject, URIRef):
                    domain = urlparse(str(subject)).netloc
                    if domain:
                        domains.add(domain)
                if isinstance(obj, URIRef):
                    domain = urlparse(str(obj)).netloc
                    if domain:
                        domains.add(domain)
        
        result["stats"]["triples_count"] = triples_count
        result["stats"]["subjects_count"] = len(subjects)
        result["stats"]["predicates_count"] = len(predicates)
        result["stats"]["objects_count"] = len(objects)
        result["stats"]["namespaces"] = [str(ns) for prefix, ns in graph.namespaces()]
        result["stats"]["domains"] = list(domains)
        
        # Walidacja
        if triples_count == 0:
            result["errors"].append("Plik RDF nie zawiera żadnych trójek (triples)")
            result["openness_score"] = 3
            result["openness_score_description"] = "Plik jest poprawnym XML, ale nie zawiera danych RDF"
            return result
        
        result["valid"] = True
        
        # Oblicz score
        source_data = SourceData(extension=extension, data=data)
        score = calculate_score_for_rdf(source_data)
        result["openness_score"] = score
        
        if score == 5:
            result["openness_score_description"] = "★★★★★ Linked Data - dane zawierają odniesienia do zasobów z różnych domen"
        elif score == 4:
            result["openness_score_description"] = "★★★★☆ Open Format - dane w otwartym formacie RDF (W3C)"
        else:
            result["openness_score_description"] = f"Score: {score}/5"
        
        # Ostrzeżenia
        if len(domains) <= 1:
            result["warnings"].append(
                "Plik nie zawiera Linked Data (brak URI z różnych domen). "
                "Aby uzyskać 5 gwiazdek, dodaj odniesienia do zewnętrznych zasobów."
            )
        
        # Sprawdź wymagane namespace'y dla naszej ontologii
        required_namespaces = [
            "http://purl.org/dc/elements/1.1/",
            "http://schema.org/",
            "https://dane.gov.pl/ontology/znalezione#"
        ]
        found_namespaces = result["stats"]["namespaces"]
        for ns in required_namespaces:
            if ns not in found_namespaces:
                result["warnings"].append(f"Brak zalecanego namespace: {ns}")
        
    except ET.ParseError as e:
        result["errors"].append(f"Błąd parsowania XML: {str(e)}")
        result["openness_score"] = 1
        result["openness_score_description"] = "★☆☆☆☆ Plik nie jest poprawnym XML"
    except Exception as e:
        result["errors"].append(f"Błąd walidacji RDF: {str(e)}")
        result["openness_score"] = 3
        result["openness_score_description"] = "★★★☆☆ Plik może być poprawnym XML, ale nie jest poprawnym RDF"
    
    return result


class RDFValidationRequest(BaseModel):
    """Request do walidacji RDF inline"""
    rdf_content: str
    extension: str = "rdf"


class RDFValidationResponse(BaseModel):
    """Response z wynikami walidacji RDF"""
    valid: bool
    openness_score: int
    openness_score_description: str
    errors: List[str]
    warnings: List[str]
    stats: dict


# ============== RDF/XML NAMESPACES ==============
RDF_NS = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
RDFS_NS = "http://www.w3.org/2000/01/rdf-schema#"
DC_NS = "http://purl.org/dc/elements/1.1/"
DCT_NS = "http://purl.org/dc/terms/"
SCHEMA_NS = "http://schema.org/"
GEO_NS = "http://www.w3.org/2003/01/geo/wgs84_pos#"
FOAF_NS = "http://xmlns.com/foaf/0.1/"
XSD_NS = "http://www.w3.org/2001/XMLSchema#"
ZNALEZIONE_NS = "https://dane.gov.pl/ontology/znalezione#"
TERYT_NS = "https://dane.gov.pl/resource/teryt/"

app = FastAPI(
    title="ZnalezionePL API",
    description="API do udostępniania danych o rzeczach znalezionych w portalu dane.gov.pl",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS dla frontendu
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============== MODELE DANYCH ==============

class Kategoria(str, Enum):
    dokumenty = "dokumenty"
    elektronika = "elektronika"
    odziez = "odziez"
    bizuteria = "bizuteria"
    klucze = "klucze"
    portfele = "portfele"
    telefony = "telefony"
    rowery = "rowery"
    torby_plecaki = "torby_plecaki"
    okulary = "okulary"
    zegarki = "zegarki"
    zabawki = "zabawki"
    sprzet_sportowy = "sprzet_sportowy"
    instrumenty_muzyczne = "instrumenty_muzyczne"
    inne = "inne"


class Status(str, Enum):
    oczekuje_na_odbior = "oczekuje_na_odbior"
    odebrane = "odebrane"
    przekazane_skarbowi_panstwa = "przekazane_skarbowi_panstwa"
    zlikwidowane = "zlikwidowane"


class JednostkaSamorzadowa(BaseModel):
    """Model jednostki samorządowej"""
    kod_teryt: str
    nazwa: str
    wojewodztwo: str
    
    @field_validator('kod_teryt')
    @classmethod
    def validate_teryt(cls, v):
        if not v.isdigit() or len(v) != 7:
            raise ValueError('Kod TERYT musi mieć 7 cyfr')
        return v


class RzeczZnaleziona(BaseModel):
    """Model rzeczy znalezionej - zgodny ze schematem dane.gov.pl"""
    id_zgloszenia: str
    kategoria: Kategoria
    nazwa_przedmiotu: str
    opis: Optional[str] = None
    data_znalezienia: date
    miejsce_znalezienia: str
    wspolrzedne_lat: Optional[float] = None
    wspolrzedne_lon: Optional[float] = None
    jednostka_samorzadowa: str
    kod_teryt: str
    wojewodztwo: Optional[str] = None
    status: Status = Status.oczekuje_na_odbior
    data_przyjecia: Optional[date] = None
    data_waznosci: Optional[date] = None
    kontakt_telefon: str
    kontakt_email: EmailStr
    kontakt_adres: Optional[str] = None
    godziny_otwarcia: Optional[str] = None
    zdjecie_url: Optional[str] = None
    uwagi: Optional[str] = None
    data_aktualizacji: Optional[datetime] = None
    
    @field_validator('id_zgloszenia')
    @classmethod
    def validate_id(cls, v):
        parts = v.split('-')
        if len(parts) != 3:
            raise ValueError('ID zgłoszenia musi być w formacie TERYT-ROK-NUMER')
        return v
    
    @field_validator('wspolrzedne_lat')
    @classmethod
    def validate_lat(cls, v):
        if v is not None and (v < 49.0 or v > 54.9):
            raise ValueError('Szerokość geograficzna musi być w zakresie 49.0-54.9 (Polska)')
        return v
    
    @field_validator('wspolrzedne_lon')
    @classmethod
    def validate_lon(cls, v):
        if v is not None and (v < 14.1 or v > 24.2):
            raise ValueError('Długość geograficzna musi być w zakresie 14.1-24.2 (Polska)')
        return v


class PublikacjaRequest(BaseModel):
    """Request do publikacji danych"""
    jednostka: JednostkaSamorzadowa
    items: List[RzeczZnaleziona]


class PublikacjaResponse(BaseModel):
    """Response po publikacji"""
    success: bool
    message: str
    dataset_id: Optional[str] = None
    resource_id: Optional[str] = None
    items_count: int
    published_at: datetime


# ============== ENDPOINTY ==============

@app.get("/")
async def root():
    """Strona główna API"""
    return {
        "name": "ZnalezionePL API",
        "version": "1.0.0",
        "description": "API do udostępniania danych o rzeczach znalezionych",
        "docs": "/api/docs",
        "endpoints": {
            "validate": "/api/validate",
            "validate/rdf": "/api/validate/rdf",
            "publish": "/api/publish",
            "export/rdf": "/api/export/rdf",
            "upload": "/api/upload"
        }
    }


@app.get("/api/jednostki")
async def get_jednostki():
    """Pobierz listę jednostek samorządowych (przykładowe dane)"""
    return [
        {"kod": "1465011", "nazwa": "Miasto Stołeczne Warszawa", "wojewodztwo": "mazowieckie"},
        {"kod": "1261011", "nazwa": "Miasto Kraków", "wojewodztwo": "małopolskie"},
        {"kod": "0264011", "nazwa": "Miasto Wrocław", "wojewodztwo": "dolnośląskie"},
        {"kod": "1061011", "nazwa": "Miasto Łódź", "wojewodztwo": "łódzkie"},
        {"kod": "1461011", "nazwa": "Miasto Poznań", "wojewodztwo": "wielkopolskie"},
        {"kod": "0861011", "nazwa": "Miasto Gdańsk", "wojewodztwo": "pomorskie"},
        {"kod": "2461011", "nazwa": "Miasto Szczecin", "wojewodztwo": "zachodniopomorskie"},
        {"kod": "0661011", "nazwa": "Miasto Bydgoszcz", "wojewodztwo": "kujawsko-pomorskie"},
    ]


@app.get("/api/kategorie")
async def get_kategorie():
    """Pobierz listę kategorii przedmiotów"""
    return [
        {"value": k.value, "label": k.value.replace("_", " ").title()} 
        for k in Kategoria
    ]


@app.post("/api/validate")
async def validate_data(items: List[RzeczZnaleziona]):
    """
    Walidacja danych przed publikacją
    Sprawdza zgodność ze schematem wzorcowym
    """
    errors = []
    warnings = []
    
    for i, item in enumerate(items):
        # Sprawdzenie wymaganych pól
        if not item.nazwa_przedmiotu:
            errors.append(f"Wpis {i+1}: brak nazwy przedmiotu")
        if not item.data_znalezienia:
            errors.append(f"Wpis {i+1}: brak daty znalezienia")
        if not item.miejsce_znalezienia:
            errors.append(f"Wpis {i+1}: brak miejsca znalezienia")
            
        # Ostrzeżenia
        if not item.opis:
            warnings.append(f"Wpis {i+1}: brak opisu (zalecane)")
        if not item.kontakt_adres:
            warnings.append(f"Wpis {i+1}: brak adresu biura")
    
    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "items_count": len(items)
    }


@app.post("/api/validate/rdf", response_model=RDFValidationResponse)
async def validate_rdf_endpoint(request: RDFValidationRequest):
    """
    Walidacja pliku RDF/XML zgodna z metodologią dane.gov.pl
    
    Oblicza wynik otwartości danych (Openness Score) zgodnie z 5stardata.info:
    - ★★★★★ (5) - Linked Data - dane zawierają odniesienia do zasobów z różnych domen
    - ★★★★☆ (4) - Open Format - dane w otwartym formacie RDF (W3C)
    - ★★★☆☆ (3) - Structured Data - dane strukturalne, ale nie RDF
    - ★★☆☆☆ (2) - Machine Readable - format binarny
    - ★☆☆☆☆ (1) - Available - dane dostępne, ale w formacie zamkniętym
    
    Implementacja zgodna z:
    mcod/resources/score_computation/calculators/calculator_xml.py
    """
    try:
        data = request.rdf_content.encode('utf-8')
        result = validate_rdf_xml(data, request.extension)
        return RDFValidationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Błąd walidacji: {str(e)}")


@app.post("/api/validate/rdf/file")
async def validate_rdf_file(file: UploadFile = File(...)):
    """
    Walidacja pliku RDF/XML przez upload pliku.
    
    Obsługiwane formaty: .rdf, .xml, .ttl, .n3, .nt, .jsonld, .trig, .nq
    """
    # Pobierz rozszerzenie z nazwy pliku
    filename = file.filename or "file.rdf"
    extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else "rdf"
    
    # Sprawdź czy format jest obsługiwany
    supported_extensions = list(RDF_FORMAT_TO_MIMETYPE.keys())
    if extension not in supported_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Nieobsługiwany format. Obsługiwane: {', '.join(supported_extensions)}"
        )
    
    # Wczytaj zawartość pliku
    content = await file.read()
    
    # Waliduj
    result = validate_rdf_xml(content, extension)
    
    return {
        "filename": filename,
        "extension": extension,
        **result
    }


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload pliku CSV lub JSON z danymi
    Parsuje i waliduje dane
    """
    if not file.filename.endswith(('.csv', '.json')):
        raise HTTPException(
            status_code=400, 
            detail="Obsługiwane formaty: CSV, JSON"
        )
    
    content = await file.read()
    content_str = content.decode('utf-8')
    
    try:
        if file.filename.endswith('.json'):
            data = json.loads(content_str)
        else:
            # Parse CSV
            reader = csv.DictReader(io.StringIO(content_str))
            data = list(reader)
        
        return {
            "success": True,
            "filename": file.filename,
            "items_count": len(data),
            "items": data
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Błąd parsowania pliku: {str(e)}"
        )


def generate_rdf_xml(request: PublikacjaRequest) -> str:
    """
    Generuje RDF/XML zgodny ze standardami Linked Data
    Używa ontologii: Dublin Core, Schema.org, GEO, oraz własnej ontologii znalezione
    """
    # Rejestracja namespace'ów
    ET.register_namespace('rdf', RDF_NS)
    ET.register_namespace('rdfs', RDFS_NS)
    ET.register_namespace('dc', DC_NS)
    ET.register_namespace('dct', DCT_NS)
    ET.register_namespace('schema', SCHEMA_NS)
    ET.register_namespace('geo', GEO_NS)
    ET.register_namespace('foaf', FOAF_NS)
    ET.register_namespace('xsd', XSD_NS)
    ET.register_namespace('znalezione', ZNALEZIONE_NS)
    ET.register_namespace('teryt', TERYT_NS)
    
    # Główny element RDF
    rdf = ET.Element(f'{{{RDF_NS}}}RDF')
    rdf.set(f'xmlns:rdf', RDF_NS)
    rdf.set(f'xmlns:rdfs', RDFS_NS)
    rdf.set(f'xmlns:dc', DC_NS)
    rdf.set(f'xmlns:dct', DCT_NS)
    rdf.set(f'xmlns:schema', SCHEMA_NS)
    rdf.set(f'xmlns:geo', GEO_NS)
    rdf.set(f'xmlns:foaf', FOAF_NS)
    rdf.set(f'xmlns:xsd', XSD_NS)
    rdf.set(f'xmlns:znalezione', ZNALEZIONE_NS)
    rdf.set(f'xmlns:teryt', TERYT_NS)
    
    # Opis zbioru danych (Dataset)
    dataset = ET.SubElement(rdf, f'{{{SCHEMA_NS}}}Dataset')
    dataset.set(f'{{{RDF_NS}}}about', f'https://dane.gov.pl/dataset/rzeczy-znalezione-{request.jednostka.kod_teryt}')
    
    ET.SubElement(dataset, f'{{{DC_NS}}}title').text = f'Rzeczy znalezione - {request.jednostka.nazwa}'
    ET.SubElement(dataset, f'{{{DC_NS}}}description').text = 'Rejestr rzeczy znalezionych prowadzony przez jednostkę samorządową'
    ET.SubElement(dataset, f'{{{DC_NS}}}publisher').text = request.jednostka.nazwa
    ET.SubElement(dataset, f'{{{DCT_NS}}}issued').text = datetime.now().isoformat()
    ET.SubElement(dataset, f'{{{DCT_NS}}}modified').text = datetime.now().isoformat()
    ET.SubElement(dataset, f'{{{DC_NS}}}language').text = 'pl'
    ET.SubElement(dataset, f'{{{DCT_NS}}}spatial').text = request.jednostka.wojewodztwo
    
    # Organizacja (jednostka samorządowa)
    org = ET.SubElement(rdf, f'{{{FOAF_NS}}}Organization')
    org.set(f'{{{RDF_NS}}}about', f'{TERYT_NS}{request.jednostka.kod_teryt}')
    ET.SubElement(org, f'{{{FOAF_NS}}}name').text = request.jednostka.nazwa
    ET.SubElement(org, f'{{{ZNALEZIONE_NS}}}kodTeryt').text = request.jednostka.kod_teryt
    ET.SubElement(org, f'{{{ZNALEZIONE_NS}}}wojewodztwo').text = request.jednostka.wojewodztwo
    
    # Każda rzecz znaleziona jako osobny zasób
    for item in request.items:
        # Główny element rzeczy znalezionej
        rzecz = ET.SubElement(rdf, f'{{{ZNALEZIONE_NS}}}RzeczZnaleziona')
        item_uri = f'https://dane.gov.pl/resource/rzeczy-znalezione/{item.id_zgloszenia}'
        rzecz.set(f'{{{RDF_NS}}}about', item_uri)
        
        # Identyfikator
        ET.SubElement(rzecz, f'{{{DC_NS}}}identifier').text = item.id_zgloszenia
        
        # Nazwa i opis (Dublin Core)
        ET.SubElement(rzecz, f'{{{DC_NS}}}title').text = item.nazwa_przedmiotu
        if item.opis:
            ET.SubElement(rzecz, f'{{{DC_NS}}}description').text = item.opis
        
        # Kategoria
        kategoria_el = ET.SubElement(rzecz, f'{{{ZNALEZIONE_NS}}}kategoria')
        kategoria_val = item.kategoria.value if hasattr(item.kategoria, 'value') else item.kategoria
        kategoria_el.text = kategoria_val
        kategoria_el.set(f'{{{RDF_NS}}}resource', f'{ZNALEZIONE_NS}Kategoria/{kategoria_val}')
        
        # Data znalezienia (Dublin Core)
        data_el = ET.SubElement(rzecz, f'{{{DC_NS}}}date')
        data_el.text = str(item.data_znalezienia)
        data_el.set(f'{{{RDF_NS}}}datatype', f'{XSD_NS}date')
        
        # Miejsce znalezienia (Schema.org + GEO)
        miejsce = ET.SubElement(rzecz, f'{{{SCHEMA_NS}}}location')
        miejsce_node = ET.SubElement(miejsce, f'{{{SCHEMA_NS}}}Place')
        ET.SubElement(miejsce_node, f'{{{SCHEMA_NS}}}name').text = item.miejsce_znalezienia
        
        # Współrzędne geograficzne (jeśli dostępne)
        if item.wspolrzedne_lat and item.wspolrzedne_lon:
            geo_el = ET.SubElement(miejsce_node, f'{{{SCHEMA_NS}}}geo')
            geo_coords = ET.SubElement(geo_el, f'{{{SCHEMA_NS}}}GeoCoordinates')
            lat_el = ET.SubElement(geo_coords, f'{{{GEO_NS}}}lat')
            lat_el.text = str(item.wspolrzedne_lat)
            lat_el.set(f'{{{RDF_NS}}}datatype', f'{XSD_NS}decimal')
            lon_el = ET.SubElement(geo_coords, f'{{{GEO_NS}}}long')
            lon_el.text = str(item.wspolrzedne_lon)
            lon_el.set(f'{{{RDF_NS}}}datatype', f'{XSD_NS}decimal')
        
        # Jednostka samorządowa (relacja)
        jednostka_ref = ET.SubElement(rzecz, f'{{{ZNALEZIONE_NS}}}jednostkaSamorzadowa')
        jednostka_ref.set(f'{{{RDF_NS}}}resource', f'{TERYT_NS}{request.jednostka.kod_teryt}')
        
        # Status
        status_el = ET.SubElement(rzecz, f'{{{ZNALEZIONE_NS}}}status')
        status_val = item.status.value if hasattr(item.status, 'value') else item.status
        status_el.text = status_val
        status_el.set(f'{{{RDF_NS}}}resource', f'{ZNALEZIONE_NS}Status/{status_val}')
        
        # Daty dodatkowe
        if item.data_przyjecia:
            data_przyj = ET.SubElement(rzecz, f'{{{ZNALEZIONE_NS}}}dataPrzyjecia')
            data_przyj.text = str(item.data_przyjecia)
            data_przyj.set(f'{{{RDF_NS}}}datatype', f'{XSD_NS}date')
        
        if item.data_waznosci:
            data_wazn = ET.SubElement(rzecz, f'{{{ZNALEZIONE_NS}}}dataWaznosci')
            data_wazn.text = str(item.data_waznosci)
            data_wazn.set(f'{{{RDF_NS}}}datatype', f'{XSD_NS}date')
        
        # Dane kontaktowe (Schema.org ContactPoint)
        kontakt = ET.SubElement(rzecz, f'{{{SCHEMA_NS}}}contactPoint')
        kontakt_node = ET.SubElement(kontakt, f'{{{SCHEMA_NS}}}ContactPoint')
        ET.SubElement(kontakt_node, f'{{{SCHEMA_NS}}}telephone').text = item.kontakt_telefon
        ET.SubElement(kontakt_node, f'{{{SCHEMA_NS}}}email').text = item.kontakt_email
        if item.kontakt_adres:
            ET.SubElement(kontakt_node, f'{{{SCHEMA_NS}}}address').text = item.kontakt_adres
        if item.godziny_otwarcia:
            ET.SubElement(kontakt_node, f'{{{SCHEMA_NS}}}hoursAvailable').text = item.godziny_otwarcia
        
        # Zdjęcie (jeśli dostępne)
        if item.zdjecie_url:
            img = ET.SubElement(rzecz, f'{{{SCHEMA_NS}}}image')
            img.set(f'{{{RDF_NS}}}resource', item.zdjecie_url)
        
        # Uwagi
        if item.uwagi:
            ET.SubElement(rzecz, f'{{{RDFS_NS}}}comment').text = item.uwagi
        
        # Data aktualizacji
        modified = ET.SubElement(rzecz, f'{{{DCT_NS}}}modified')
        modified.text = datetime.now().isoformat()
        modified.set(f'{{{RDF_NS}}}datatype', f'{XSD_NS}dateTime')
    
    # Formatowanie XML z wcięciami
    xml_str = ET.tostring(rdf, encoding='unicode', method='xml')
    dom = minidom.parseString(xml_str)
    return dom.toprettyxml(indent='  ', encoding=None)


@app.post("/api/export/rdf")
async def export_rdf(request: PublikacjaRequest):
    """
    Eksport danych do formatu RDF/XML
    Format zgodny ze standardami Linked Data i dane.gov.pl
    
    Używane ontologie:
    - Dublin Core (dc, dct) - metadane
    - Schema.org - organizacje, lokalizacje, kontakty
    - GEO (W3C) - współrzędne geograficzne
    - FOAF - organizacje
    - Własna ontologia znalezione - specyficzne właściwości
    """
    rdf_xml = generate_rdf_xml(request)
    
    return StreamingResponse(
        io.BytesIO(rdf_xml.encode('utf-8')),
        media_type="application/rdf+xml",
        headers={
            "Content-Disposition": f"attachment; filename=rzeczy_znalezione_{request.jednostka.kod_teryt}_{date.today()}.rdf"
        }
    )


@app.post("/api/publish", response_model=PublikacjaResponse)
async def publish_to_dane_gov(request: PublikacjaRequest):
    """
    Publikacja danych do portalu dane.gov.pl
    
    W wersji produkcyjnej:
    - Integracja z API CKAN dane.gov.pl
    - Automatyczne tworzenie/aktualizacja zasobu
    - Autoryzacja przez klucz API organizacji
    """
    
    # Walidacja danych
    if not request.items:
        raise HTTPException(status_code=400, detail="Brak danych do publikacji")
    
    # W wersji produkcyjnej tutaj byłoby wywołanie API dane.gov.pl
    # Przykład integracji z CKAN API:
    """
    async with httpx.AsyncClient() as client:
        # 1. Sprawdzenie/utworzenie datasetu
        dataset_response = await client.post(
            "https://api.dane.gov.pl/api/3/action/package_create",
            headers={"Authorization": API_KEY},
            json={
                "name": f"rzeczy-znalezione-{request.jednostka.kod_teryt}",
                "title": f"Rzeczy znalezione - {request.jednostka.nazwa}",
                "notes": "Rejestr rzeczy znalezionych prowadzony przez jednostkę samorządową",
                "owner_org": request.jednostka.kod_teryt,
                "tags": [
                    {"name": "rzeczy-znalezione"},
                    {"name": "samorzad"},
                    {"name": request.jednostka.wojewodztwo}
                ]
            }
        )
        
        # 2. Upload zasobu
        resource_response = await client.post(
            "https://api.dane.gov.pl/api/3/action/resource_create",
            headers={"Authorization": API_KEY},
            files={"upload": ("data.json", json.dumps(export_data), "application/json")},
            data={
                "package_id": dataset_id,
                "name": f"Rzeczy znalezione - aktualizacja {date.today()}",
                "format": "JSON",
                "description": "Dane w formacie JSON zgodne ze schematem wzorcowym"
            }
        )
    """
    
    # Symulacja odpowiedzi sukcesu (demo)
    return PublikacjaResponse(
        success=True,
        message=f"Dane zostały pomyślnie opublikowane w portalu dane.gov.pl",
        dataset_id=f"rzeczy-znalezione-{request.jednostka.kod_teryt}",
        resource_id=f"res-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        items_count=len(request.items),
        published_at=datetime.now()
    )


@app.get("/api/schema")
async def get_schema():
    """
    Pobierz schemat danych (JSON Schema)
    Wzorcowy zakres danych dla rzeczy znalezionych
    """
    return {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Rzeczy Znalezione - Wzorcowy Schemat Danych",
        "description": "Ujednolicony format danych o rzeczach znalezionych dla portalu dane.gov.pl",
        "version": "1.0.0",
        "type": "array",
        "items": {
            "type": "object",
            "required": [
                "id_zgloszenia", "kategoria", "nazwa_przedmiotu",
                "data_znalezienia", "miejsce_znalezienia",
                "jednostka_samorzadowa", "kod_teryt", "status",
                "kontakt_telefon", "kontakt_email"
            ],
            "properties": {
                "id_zgloszenia": {
                    "type": "string",
                    "description": "Unikalny identyfikator w formacie TERYT-ROK-NUMER",
                    "pattern": "^[0-9]{7}-[0-9]{4}-[0-9]{1,6}$"
                },
                "kategoria": {
                    "type": "string",
                    "enum": [k.value for k in Kategoria],
                    "description": "Kategoria przedmiotu"
                },
                "nazwa_przedmiotu": {
                    "type": "string",
                    "minLength": 3,
                    "maxLength": 100
                },
                "opis": {
                    "type": "string",
                    "maxLength": 1000
                },
                "data_znalezienia": {
                    "type": "string",
                    "format": "date"
                },
                "miejsce_znalezienia": {
                    "type": "string"
                },
                "wspolrzedne_lat": {
                    "type": "number",
                    "minimum": 49.0,
                    "maximum": 54.9
                },
                "wspolrzedne_lon": {
                    "type": "number",
                    "minimum": 14.1,
                    "maximum": 24.2
                },
                "jednostka_samorzadowa": {
                    "type": "string"
                },
                "kod_teryt": {
                    "type": "string",
                    "pattern": "^[0-9]{7}$"
                },
                "wojewodztwo": {
                    "type": "string"
                },
                "status": {
                    "type": "string",
                    "enum": [s.value for s in Status]
                },
                "kontakt_telefon": {
                    "type": "string",
                    "pattern": "^[+]?[0-9\\s-]{9,15}$"
                },
                "kontakt_email": {
                    "type": "string",
                    "format": "email"
                },
                "kontakt_adres": {
                    "type": "string"
                },
                "godziny_otwarcia": {
                    "type": "string"
                },
                "zdjecie_url": {
                    "type": "string",
                    "format": "uri"
                },
                "data_aktualizacji": {
                    "type": "string",
                    "format": "date-time"
                }
            }
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

