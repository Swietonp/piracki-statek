# 🔍 ZnalezionePL - Portal Rzeczy Znalezionych

> **Hackathon HackNation 2024** - Projekt dla portalu dane.gov.pl

## 📋 Opis projektu

**ZnalezionePL** to mechanizm umożliwiający samorządom szybkie (w max. 5 krokach) udostępnianie danych o rzeczach znalezionych do portalu dane.gov.pl w formacie **RDF/XML** (Linked Data).

### Problem
Samorządy prowadzą rejestry rzeczy znalezionych, ale dane te są rozproszone po wielu stronach w Biuletynach Informacji Publicznej poszczególnych powiatów. Utrudnia to szybkie odnalezienie zagubionej rzeczy.

### Rozwiązanie
- Prosty kreator 5-krokowy dla urzędników
- Ujednolicony schemat danych w formacie **RDF/XML**
- Walidacja zgodna z metodologią **dane.gov.pl** (5stardata.info)
- Automatyczny eksport do formatu Linked Data

## 🚀 5 kroków do publikacji danych

| Krok | Nazwa | Opis |
|------|-------|------|
| 1️⃣ | **Identyfikacja** | Wybór jednostki samorządowej (TERYT) |
| 2️⃣ | **Źródło danych** | Import CSV/Excel lub formularz ręczny |
| 3️⃣ | **Wprowadzanie** | Dodawanie/edycja wpisów z walidacją |
| 4️⃣ | **Weryfikacja** | Podgląd, walidacja RDF i 5-gwiazdkowy score |
| 5️⃣ | **Publikacja** | Eksport RDF/XML + wysyłka do dane.gov.pl |

## 🛠️ Technologie

### Frontend
- **React 18** + Vite
- **Lucide React** - ikony
- Czyste CSS (zgodne z Design System Gov.pl)

### Backend
- **Python 3.10+** + FastAPI
- **Pydantic** - walidacja danych
- **rdflib** - walidacja RDF/XML
- **HTTPX** - komunikacja z API dane.gov.pl

## 📦 Instalacja i uruchomienie

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikacja dostępna pod: http://localhost:3000

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

API dostępne pod: http://localhost:8000
Dokumentacja API: http://localhost:8000/api/docs

## 📁 Struktura projektu

```
HackNation/
├── frontend/                    # Aplikacja React/Vite
│   ├── src/
│   │   ├── App.jsx             # Kreator 5-krokowy
│   │   ├── main.jsx            # Entry point
│   │   └── styles/global.css   # Style Gov.pl + WCAG 2.1
│   ├── index.html
│   └── package.json
│
├── backend/                     # API FastAPI
│   ├── main.py                 # Endpointy REST API + walidacja RDF
│   └── requirements.txt
│
├── dane/                        # Wzorcowe dane
│   ├── przykladowe_dane.rdf    # Przykładowe dane RDF/XML
│   ├── schemat_danych.json     # JSON Schema (walidacja wewnętrzna)
│   └── WZORCOWY_ZAKRES_DANYCH.md # Dokumentacja formatu RDF
│
├── .gitignore
└── README.md
```

## 🔗 Format danych: RDF/XML (Linked Data)

Dane są eksportowane **wyłącznie w formacie RDF/XML** zgodnym ze standardami Semantic Web.

### Używane ontologie

| Ontologia | Prefix | Zastosowanie |
|-----------|--------|--------------|
| Dublin Core | `dc:`, `dct:` | Metadane (tytuł, opis, data) |
| Schema.org | `schema:` | Lokalizacje, kontakty, organizacje |
| GEO W3C | `geo:` | Współrzędne GPS |
| FOAF | `foaf:` | Organizacje |
| Własna | `znalezione:` | Kategorie, statusy, specyficzne pola |

## ⭐ Walidacja RDF (5 Star Open Data)

Walidacja zgodna z metodologią **dane.gov.pl** (`calculate_score_for_rdf`):

| Score | Opis | Warunek |
|-------|------|---------|
| ★★★★★ (5) | **Linked Data** | URI z różnych domen |
| ★★★★☆ (4) | **Open Format** | Poprawny RDF/XML (W3C) |
| ★★★☆☆ (3) | **Structured** | XML strukturalny |
| ★★☆☆☆ (2) | **Machine Readable** | Format binarny |
| ★☆☆☆☆ (1) | **Available** | Dane dostępne |

### API Walidacji

```bash
# Walidacja RDF przez upload pliku
curl -X POST http://localhost:8000/api/validate/rdf/file \
  -F "file=@dane/przykladowe_dane.rdf"

# Walidacja RDF inline
curl -X POST http://localhost:8000/api/validate/rdf \
  -H "Content-Type: application/json" \
  -d '{"rdf_content": "<rdf:RDF>...</rdf:RDF>", "extension": "rdf"}'
```

## ✅ Zgodność z wymaganiami

### UX/UI
- ✅ Max 5 kroków do publikacji danych
- ✅ Interfejs przyjazny dla urzędnika (nie-informatyka)
- ✅ Responsywność (komputer + urządzenia mobilne)
- ✅ Zgodność z WCAG 2.1 (skip links, ARIA, focus states)

### Techniczne
- ✅ Format czytelny maszynowo: **RDF/XML** (Linked Data)
- ✅ Zgodność ze standardami Semantic Web (W3C)
- ✅ Walidacja danych zgodna z dane.gov.pl
- ✅ Integracja z API CKAN dane.gov.pl

### Funkcjonalne
- ✅ Import danych z plików CSV/JSON
- ✅ Ręczne wprowadzanie danych
- ✅ Eksport do RDF/XML
- ✅ Walidacja 5-gwiazdkowa (5stardata.info)

## 🎯 Kryteria oceny

| Kryterium | Waga | Realizacja |
|-----------|------|------------|
| Zgodność z zasadami dane.gov.pl | 35% | ✅ Pełna zgodność |
| Kreatywność i innowacyjność | 25% | ✅ Linked Data, auto-walidacja |
| UX & UI | 20% | ✅ Design System Gov.pl, WCAG 2.1 |
| Wzorcowy zakres danych | 15% | ✅ RDF/XML + dokumentacja |
| Prezentacja rozwiązania | 5% | ✅ Demo + dokumentacja |

## 📚 Zasoby

- [Portal dane.gov.pl](https://dane.gov.pl)
- [Kod źródłowy dane.gov.pl](https://dane.gov.pl/source-code/)
- [5 Star Open Data](https://5stardata.info)
- [RDF/XML Specification (W3C)](https://www.w3.org/TR/rdf-syntax-grammar/)
- [Dublin Core Metadata](https://dublincore.org/)
- [Schema.org](https://schema.org/)

## 👥 Autorzy

Projekt stworzony podczas hackathonu **HackNation 2024**.

---

© 2024 ZnalezionePL | Projekt dla dane.gov.pl
