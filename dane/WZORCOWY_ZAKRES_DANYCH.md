# 📋 Wzorcowy Zakres Danych o Rzeczach Znalezionych

## Cel dokumentu

Niniejszy dokument określa ujednolicony standard danych o rzeczach znalezionych, przeznaczony do udostępniania przez samorządy w portalu dane.gov.pl w formacie **RDF/XML** (Linked Data).

---

## 1. Struktura danych

### 1.1 Pola wymagane (obowiązkowe)

| Pole | Typ | Opis | Przykład |
|------|-----|------|----------|
| `id_zgloszenia` | string | Unikalny identyfikator w formacie TERYT-ROK-NUMER | `1465011-2024-000142` |
| `kategoria` | enum | Kategoria przedmiotu (patrz: lista kategorii) | `portfele` |
| `nazwa_przedmiotu` | string (3-100 znaków) | Krótka nazwa przedmiotu | `Portfel skórzany brązowy` |
| `data_znalezienia` | date (YYYY-MM-DD) | Data znalezienia przedmiotu | `2024-03-15` |
| `miejsce_znalezienia` | string | Opis miejsca znalezienia | `Autobus linii 125, przystanek Centrum` |
| `jednostka_samorzadowa` | string | Nazwa powiatu/miasta | `Miasto Stołeczne Warszawa` |
| `kod_teryt` | string (7 cyfr) | Kod TERYT jednostki | `1465011` |
| `status` | enum | Status przedmiotu (patrz: lista statusów) | `oczekuje_na_odbior` |
| `kontakt_telefon` | string | Numer telefonu biura | `+48 22 443 14 00` |
| `kontakt_email` | email | Adres email biura | `rzeczy.znalezione@um.warszawa.pl` |

### 1.2 Pola opcjonalne (zalecane)

| Pole | Typ | Opis | Przykład |
|------|-----|------|----------|
| `opis` | string (max 1000 znaków) | Szczegółowy opis przedmiotu | `Portfel męski, skóra naturalna...` |
| `wojewodztwo` | string | Nazwa województwa | `mazowieckie` |
| `wspolrzedne_lat` | number (49.0-54.9) | Szerokość geograficzna | `52.2297` |
| `wspolrzedne_lon` | number (14.1-24.2) | Długość geograficzna | `21.0122` |
| `data_przyjecia` | date | Data przyjęcia do biura | `2024-03-15` |
| `data_waznosci` | date | Termin przechowywania (2 lata) | `2026-03-15` |
| `kontakt_adres` | string | Adres biura rzeczy znalezionych | `ul. Kredytowa 3, 00-056 Warszawa` |
| `godziny_otwarcia` | string | Godziny pracy biura | `pn-pt 8:00-16:00` |
| `zdjecie_url` | URL | Link do zdjęcia przedmiotu | `https://example.com/zdjecie.jpg` |
| `uwagi` | string (max 500 znaków) | Dodatkowe informacje | `Przedmiot wymaga odbioru osobistego` |
| `data_aktualizacji` | datetime (ISO 8601) | Data ostatniej aktualizacji | `2024-03-15T10:30:00Z` |

---

## 2. Słowniki (wartości enum)

### 2.1 Kategorie przedmiotów

| Wartość | Opis |
|---------|------|
| `dokumenty` | Dokumenty tożsamości, prawo jazdy, paszporty |
| `elektronika` | Urządzenia elektroniczne (oprócz telefonów) |
| `odziez` | Odzież, ubrania |
| `bizuteria` | Biżuteria, zegarki, pierścionki |
| `klucze` | Klucze, pęki kluczy |
| `portfele` | Portfele, portmonetki |
| `telefony` | Telefony komórkowe, smartfony |
| `rowery` | Rowery, hulajnogi |
| `torby_plecaki` | Torby, plecaki, walizki |
| `okulary` | Okulary, etui na okulary |
| `zegarki` | Zegarki (w tym smartwatche) |
| `zabawki` | Zabawki dziecięce |
| `sprzet_sportowy` | Sprzęt sportowy, akcesoria |
| `instrumenty_muzyczne` | Instrumenty muzyczne |
| `inne` | Inne przedmioty |

### 2.2 Statusy przedmiotów

| Wartość | Opis |
|---------|------|
| `oczekuje_na_odbior` | Przedmiot czeka na właściciela |
| `odebrane` | Przedmiot odebrany przez właściciela |
| `przekazane_skarbowi_panstwa` | Po 2 latach przekazane Skarbowi Państwa |
| `zlikwidowane` | Przedmiot zlikwidowany (zniszczony) |

---

## 3. Format identyfikatora (id_zgloszenia)

Format: `XXXXXXX-YYYY-NNNNNN`

- **XXXXXXX** - 7-cyfrowy kod TERYT jednostki samorządowej
- **YYYY** - rok zgłoszenia (4 cyfry)
- **NNNNNN** - numer kolejny zgłoszenia w roku (1-6 cyfr)

Przykłady:
- `1465011-2024-000001` (Warszawa, 2024, zgłoszenie nr 1)
- `1261011-2024-000542` (Kraków, 2024, zgłoszenie nr 542)

---

## 4. Zasady wprowadzania danych

### 4.1 Ochrona danych osobowych

⚠️ **WAŻNE**: W opisach przedmiotów NIE NALEŻY umieszczać:
- Imion i nazwisk
- Adresów prywatnych
- Numerów PESEL, NIP, dowodów osobistych
- Numerów kart bankowych
- Innych danych pozwalających na identyfikację osoby

**Przykład prawidłowy**: "Dowód osobisty (dane właściciela do weryfikacji w biurze)"
**Przykład nieprawidłowy**: "Dowód osobisty Jana Kowalskiego, PESEL 12345678901"

### 4.2 Opis przedmiotu

- Opis powinien być zwięzły, ale szczegółowy
- Należy podać: kolor, markę (jeśli widoczna), charakterystyczne cechy
- Unikać subiektywnych ocen ("ładny", "drogi")

### 4.3 Lokalizacja

- Podać możliwie dokładne miejsce znalezienia
- Dla transportu publicznego: linia, kierunek, przystanek
- Dla budynków: nazwa obiektu, piętro/sala
- Współrzędne GPS są opcjonalne, ale zalecane

---

## 5. Format danych: RDF/XML (Linked Data)

Dane są udostępniane **wyłącznie w formacie RDF/XML** - zgodnym ze standardami Semantic Web i Linked Open Data.

| Format | MIME Type | Rozszerzenie |
|--------|-----------|--------------|
| **RDF/XML** | application/rdf+xml | .rdf |

### 5.1 Używane ontologie (namespaces)

| Prefix | URI | Zastosowanie |
|--------|-----|--------------|
| `rdf` | http://www.w3.org/1999/02/22-rdf-syntax-ns# | Podstawowa struktura RDF |
| `rdfs` | http://www.w3.org/2000/01/rdf-schema# | Komentarze, etykiety |
| `dc` | http://purl.org/dc/elements/1.1/ | Metadane (tytuł, opis, data) |
| `dct` | http://purl.org/dc/terms/ | Rozszerzone metadane Dublin Core |
| `schema` | http://schema.org/ | Organizacje, lokalizacje, kontakty |
| `geo` | http://www.w3.org/2003/01/geo/wgs84_pos# | Współrzędne geograficzne |
| `foaf` | http://xmlns.com/foaf/0.1/ | Organizacje |
| `xsd` | http://www.w3.org/2001/XMLSchema# | Typy danych |
| `znalezione` | https://dane.gov.pl/ontology/znalezione# | Własna ontologia |
| `teryt` | https://dane.gov.pl/resource/teryt/ | Identyfikatory TERYT |

### 5.2 Struktura dokumentu RDF/XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dct="http://purl.org/dc/terms/"
  xmlns:schema="http://schema.org/"
  xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
  xmlns:foaf="http://xmlns.com/foaf/0.1/"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
  xmlns:znalezione="https://dane.gov.pl/ontology/znalezione#"
  xmlns:teryt="https://dane.gov.pl/resource/teryt/">

  <!-- Metadata zbioru danych -->
  <schema:Dataset rdf:about="https://dane.gov.pl/dataset/rzeczy-znalezione-{KOD_TERYT}">
    <dc:title>Rzeczy znalezione - {NAZWA_JEDNOSTKI}</dc:title>
    <dc:description>Rejestr rzeczy znalezionych</dc:description>
    <dc:publisher>{NAZWA_JEDNOSTKI}</dc:publisher>
    <dct:issued>{DATA_PUBLIKACJI}</dct:issued>
    <dct:modified>{DATA_AKTUALIZACJI}</dct:modified>
    <dc:language>pl</dc:language>
  </schema:Dataset>

  <!-- Jednostka samorządowa -->
  <foaf:Organization rdf:about="https://dane.gov.pl/resource/teryt/{KOD_TERYT}">
    <foaf:name>{NAZWA_JEDNOSTKI}</foaf:name>
    <znalezione:kodTeryt>{KOD_TERYT}</znalezione:kodTeryt>
    <znalezione:wojewodztwo>{WOJEWODZTWO}</znalezione:wojewodztwo>
  </foaf:Organization>

  <!-- Rzeczy znalezione -->
  <znalezione:RzeczZnaleziona rdf:about="https://dane.gov.pl/resource/rzeczy-znalezione/{ID}">
    <!-- ... właściwości ... -->
  </znalezione:RzeczZnaleziona>

</rdf:RDF>
```

### 5.3 Przykład kompletny

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dct="http://purl.org/dc/terms/"
  xmlns:schema="http://schema.org/"
  xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
  xmlns:znalezione="https://dane.gov.pl/ontology/znalezione#">

  <znalezione:RzeczZnaleziona rdf:about="https://dane.gov.pl/resource/rzeczy-znalezione/1465011-2024-000001">
    <dc:identifier>1465011-2024-000001</dc:identifier>
    <dc:title>Portfel męski skórzany brązowy</dc:title>
    <dc:description>Portfel męski, skóra naturalna, kolor brązowy</dc:description>
    
    <znalezione:kategoria rdf:resource="https://dane.gov.pl/ontology/znalezione#Kategoria/portfele">portfele</znalezione:kategoria>
    
    <dc:date rdf:datatype="http://www.w3.org/2001/XMLSchema#date">2024-03-15</dc:date>
    
    <schema:location>
      <schema:Place>
        <schema:name>Autobus linii 175, przystanek Dworzec Centralny</schema:name>
        <schema:geo>
          <schema:GeoCoordinates>
            <geo:lat rdf:datatype="http://www.w3.org/2001/XMLSchema#decimal">52.2289</geo:lat>
            <geo:long rdf:datatype="http://www.w3.org/2001/XMLSchema#decimal">21.0032</geo:long>
          </schema:GeoCoordinates>
        </schema:geo>
      </schema:Place>
    </schema:location>
    
    <znalezione:jednostkaSamorzadowa rdf:resource="https://dane.gov.pl/resource/teryt/1465011"/>
    <znalezione:status rdf:resource="https://dane.gov.pl/ontology/znalezione#Status/oczekuje_na_odbior">oczekuje_na_odbior</znalezione:status>
    
    <schema:contactPoint>
      <schema:ContactPoint>
        <schema:telephone>+48 22 443 14 00</schema:telephone>
        <schema:email>rzeczy.znalezione@um.warszawa.pl</schema:email>
        <schema:address>ul. Kredytowa 3, 00-056 Warszawa</schema:address>
        <schema:hoursAvailable>pn-pt 8:00-16:00</schema:hoursAvailable>
      </schema:ContactPoint>
    </schema:contactPoint>
    
    <dct:modified rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime">2024-03-15T10:30:00Z</dct:modified>
  </znalezione:RzeczZnaleziona>

</rdf:RDF>
```

### 5.4 Mapowanie pól na właściwości RDF

| Pole | Właściwość RDF | Typ danych |
|------|----------------|------------|
| `id_zgloszenia` | `dc:identifier` | string |
| `nazwa_przedmiotu` | `dc:title` | string |
| `opis` | `dc:description` | string |
| `kategoria` | `znalezione:kategoria` | URI |
| `data_znalezienia` | `dc:date` | xsd:date |
| `miejsce_znalezienia` | `schema:location/schema:Place/schema:name` | string |
| `wspolrzedne_lat` | `geo:lat` | xsd:decimal |
| `wspolrzedne_lon` | `geo:long` | xsd:decimal |
| `jednostka_samorzadowa` | `znalezione:jednostkaSamorzadowa` | URI (TERYT) |
| `status` | `znalezione:status` | URI |
| `kontakt_telefon` | `schema:telephone` | string |
| `kontakt_email` | `schema:email` | string |
| `kontakt_adres` | `schema:address` | string |
| `godziny_otwarcia` | `schema:hoursAvailable` | string |
| `zdjecie_url` | `schema:image` | URI |
| `uwagi` | `rdfs:comment` | string |
| `data_aktualizacji` | `dct:modified` | xsd:dateTime |

---

## 6. Zgodność ze standardami

### 6.1 Semantic Web / Linked Data

- Format RDF/XML zgodny ze specyfikacją W3C
- Wykorzystanie standardowych ontologii (Dublin Core, Schema.org, GEO)
- URI zasobów zgodne z zasadami Linked Data
- Możliwość integracji z innymi zbiorami danych

### 6.2 Portal dane.gov.pl

Dane są zgodne z:
- Wytycznymi publikacji danych w portalu dane.gov.pl
- Formatem CKAN API
- Standardami otwartych danych

### 6.3 WCAG 2.1

Interfejs użytkownika spełnia wymogi dostępności:
- Nawigacja klawiaturą
- Etykiety ARIA
- Odpowiedni kontrast kolorów
- Skip links

---

## 7. Aktualizacja danych

### Częstotliwość aktualizacji

Zalecana częstotliwość aktualizacji danych w portalu dane.gov.pl:
- **Minimalna**: raz na miesiąc
- **Zalecana**: raz na tydzień
- **Optymalna**: na bieżąco (po każdym nowym zgłoszeniu)

### Wersjonowanie

Każda aktualizacja powinna zawierać właściwość `dct:modified` z datą i godziną w formacie ISO 8601.

---

## 8. Kontakt i wsparcie

W przypadku pytań dotyczących formatu danych:
- Portal dane.gov.pl: https://dane.gov.pl/pl/knowledgebase
- Baza wiedzy: https://dane.gov.pl/pl/knowledgebase/usefulmaterials

---

*Dokument opracowany w ramach hackathonu HackNation 2024*
