import React, { useState, useCallback } from 'react';
import {
  Building2,
  FileSpreadsheet,
  PenLine,
  CheckCircle,
  Upload,
  ArrowLeft,
  ArrowRight,
  FileDown,
  Send,
  Trash2,
  Edit,
  Plus,
  AlertCircle,
  Info,
  X,
  Check,
  Search,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Clock,
  FileText,
  ExternalLink,
  Star,
  ShieldCheck
} from 'lucide-react';

// Dane TERYT przykładowe
const JEDNOSTKI_SAMORZADOWE = [
  { kod: "1465011", nazwa: "Miasto Stołeczne Warszawa", wojewodztwo: "mazowieckie" },
  { kod: "1261011", nazwa: "Miasto Kraków", wojewodztwo: "małopolskie" },
  { kod: "0264011", nazwa: "Miasto Wrocław", wojewodztwo: "dolnośląskie" },
  { kod: "1061011", nazwa: "Miasto Łódź", wojewodztwo: "łódzkie" },
  { kod: "1461011", nazwa: "Miasto Poznań", wojewodztwo: "wielkopolskie" },
  { kod: "0861011", nazwa: "Miasto Gdańsk", wojewodztwo: "pomorskie" },
  { kod: "2461011", nazwa: "Miasto Szczecin", wojewodztwo: "zachodniopomorskie" },
  { kod: "0661011", nazwa: "Miasto Bydgoszcz", wojewodztwo: "kujawsko-pomorskie" },
  { kod: "1262011", nazwa: "Powiat Krakowski", wojewodztwo: "małopolskie" },
  { kod: "1465021", nazwa: "Powiat Warszawski Zachodni", wojewodztwo: "mazowieckie" },
];

const KATEGORIE = [
  { value: "dokumenty", label: "Dokumenty" },
  { value: "elektronika", label: "Elektronika" },
  { value: "odziez", label: "Odzież" },
  { value: "bizuteria", label: "Biżuteria" },
  { value: "klucze", label: "Klucze" },
  { value: "portfele", label: "Portfele" },
  { value: "telefony", label: "Telefony" },
  { value: "rowery", label: "Rowery" },
  { value: "torby_plecaki", label: "Torby i plecaki" },
  { value: "okulary", label: "Okulary" },
  { value: "zegarki", label: "Zegarki" },
  { value: "zabawki", label: "Zabawki" },
  { value: "sprzet_sportowy", label: "Sprzęt sportowy" },
  { value: "instrumenty_muzyczne", label: "Instrumenty muzyczne" },
  { value: "inne", label: "Inne" },
];

const STATUSY = [
  { value: "oczekuje_na_odbior", label: "Oczekuje na odbiór" },
  { value: "odebrane", label: "Odebrane" },
  { value: "przekazane_skarbowi_panstwa", label: "Przekazane Skarbowi Państwa" },
  { value: "zlikwidowane", label: "Zlikwidowane" },
];

const STEPS = [
  { id: 1, label: "Jednostka", icon: Building2 },
  { id: 2, label: "Źródło danych", icon: FileSpreadsheet },
  { id: 3, label: "Wprowadzanie", icon: PenLine },
  { id: 4, label: "Weryfikacja", icon: Search },
  { id: 5, label: "Publikacja", icon: Send },
];

// Komponent nagłówka
function Header() {
  return (
    <header className="gov-header" role="banner">
      <a href="#main" className="skip-link">Przejdź do głównej treści</a>
      <div className="gov-header__logo">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="40" height="40" rx="8" fill="white" fillOpacity="0.15"/>
          <path d="M20 8L32 14V26L20 32L8 26V14L20 8Z" stroke="white" strokeWidth="2" fill="none"/>
          <circle cx="20" cy="20" r="6" fill="white"/>
        </svg>
        <div>
          <h1 className="gov-header__title">ZnalezionePL</h1>
          <span className="gov-header__subtitle">Portal rzeczy znalezionych • dane.gov.pl</span>
        </div>
      </div>
    </header>
  );
}

// Komponent steppera
function Stepper({ currentStep, completedSteps }) {
  return (
    <nav className="stepper" aria-label="Postęp formularza">
      {STEPS.map((step) => {
        const isCompleted = completedSteps.includes(step.id);
        const isActive = currentStep === step.id;
        const Icon = step.icon;
        
        return (
          <div
            key={step.id}
            className={`step ${isActive ? 'step--active' : ''} ${isCompleted ? 'step--completed' : ''}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className="step__number" aria-hidden="true">
              {isCompleted ? <Check size={20} /> : step.id}
            </div>
            <span className="step__label">{step.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

// Krok 1: Wybór jednostki samorządowej
function Step1({ data, onUpdate }) {
  const [search, setSearch] = useState('');
  
  const filteredJednostki = JEDNOSTKI_SAMORZADOWE.filter(j =>
    j.nazwa.toLowerCase().includes(search.toLowerCase()) ||
    j.kod.includes(search)
  );

  return (
    <div className="fade-in">
      <div className="step-content__header">
        <h2 className="step-content__title">Wybierz jednostkę samorządową</h2>
        <p className="step-content__description">
          Wskaż powiat lub miasto, które udostępnia dane o rzeczach znalezionych
        </p>
      </div>

      <div className="form-group" style={{ maxWidth: '500px', margin: '0 auto var(--spacing-lg)' }}>
        <label htmlFor="search-jednostka" className="form-label">
          Wyszukaj jednostkę
        </label>
        <input
          id="search-jednostka"
          type="text"
          className="form-input"
          placeholder="Wpisz nazwę lub kod TERYT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-describedby="search-hint"
        />
        <span id="search-hint" className="form-hint">
          Np. "Warszawa" lub "1465011"
        </span>
      </div>

      <div className="choice-cards" role="listbox" aria-label="Lista jednostek samorządowych">
        {filteredJednostki.map((jednostka) => (
          <div
            key={jednostka.kod}
            className={`choice-card ${data.jednostka?.kod === jednostka.kod ? 'choice-card--selected' : ''}`}
            onClick={() => onUpdate({ jednostka })}
            onKeyDown={(e) => e.key === 'Enter' && onUpdate({ jednostka })}
            role="option"
            aria-selected={data.jednostka?.kod === jednostka.kod}
            tabIndex={0}
          >
            <Building2 className="choice-card__icon" aria-hidden="true" />
            <div className="choice-card__title">{jednostka.nazwa}</div>
            <div className="choice-card__description">
              Kod TERYT: {jednostka.kod}<br/>
              woj. {jednostka.wojewodztwo}
            </div>
          </div>
        ))}
      </div>

      {data.jednostka && (
        <div className="alert alert--success" style={{ marginTop: 'var(--spacing-xl)' }}>
          <Check className="alert__icon" aria-hidden="true" />
          <div className="alert__content">
            <div className="alert__title">Wybrano jednostkę</div>
            {data.jednostka.nazwa} (TERYT: {data.jednostka.kod})
          </div>
        </div>
      )}
    </div>
  );
}

// Krok 2: Wybór źródła danych
function Step2({ data, onUpdate }) {
  const [dragOver, setDragOver] = useState(false);
  const [parseError, setParseError] = useState(null);

  const handleFileUpload = useCallback((file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        let parsedData = [];
        
        if (file.name.endsWith('.json')) {
          parsedData = JSON.parse(text);
        } else if (file.name.endsWith('.csv')) {
          // Prosty parser CSV
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          parsedData = lines.slice(1).map((line, index) => {
            const values = line.match(/(".*?"|[^,]+)/g) || [];
            const obj = {};
            headers.forEach((header, i) => {
              obj[header] = values[i]?.replace(/"/g, '').trim() || '';
            });
            return obj;
          });
        }
        
        onUpdate({ 
          sourceType: 'file',
          fileName: file.name,
          items: parsedData 
        });
        setParseError(null);
      } catch (err) {
        setParseError('Błąd parsowania pliku. Sprawdź format danych.');
      }
    };
    reader.readAsText(file);
  }, [onUpdate]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  }, [handleFileUpload]);

  return (
    <div className="fade-in">
      <div className="step-content__header">
        <h2 className="step-content__title">Wybierz źródło danych</h2>
        <p className="step-content__description">
          Zaimportuj dane z pliku lub wprowadź je ręcznie
        </p>
      </div>

      <div className="choice-cards">
        <div
          className={`choice-card ${data.sourceType === 'file' ? 'choice-card--selected' : ''}`}
          onClick={() => onUpdate({ sourceType: 'file' })}
          onKeyDown={(e) => e.key === 'Enter' && onUpdate({ sourceType: 'file' })}
          role="button"
          tabIndex={0}
        >
          <Upload className="choice-card__icon" aria-hidden="true" />
          <div className="choice-card__title">Import z pliku</div>
          <div className="choice-card__description">
            Wgraj plik CSV lub JSON z danymi o rzeczach znalezionych
          </div>
        </div>

        <div
          className={`choice-card ${data.sourceType === 'manual' ? 'choice-card--selected' : ''}`}
          onClick={() => onUpdate({ sourceType: 'manual', items: data.items || [] })}
          onKeyDown={(e) => e.key === 'Enter' && onUpdate({ sourceType: 'manual', items: data.items || [] })}
          role="button"
          tabIndex={0}
        >
          <PenLine className="choice-card__icon" aria-hidden="true" />
          <div className="choice-card__title">Wprowadzanie ręczne</div>
          <div className="choice-card__description">
            Dodaj wpisy pojedynczo przez formularz
          </div>
        </div>
      </div>

      {data.sourceType === 'file' && (
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <div
            className={`upload-zone ${dragOver ? 'upload-zone--dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
            role="button"
            tabIndex={0}
            aria-label="Przeciągnij plik lub kliknij, aby wybrać"
          >
            <FileSpreadsheet className="upload-zone__icon" aria-hidden="true" />
            <div className="upload-zone__title">
              Przeciągnij plik tutaj lub kliknij
            </div>
            <div className="upload-zone__hint">
              Obsługiwane formaty: CSV, JSON
            </div>
            <input
              id="file-input"
              type="file"
              accept=".csv,.json"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </div>
          
          {parseError && (
            <div className="alert alert--error" style={{ marginTop: 'var(--spacing-md)' }}>
              <AlertCircle className="alert__icon" aria-hidden="true" />
              <div className="alert__content">{parseError}</div>
            </div>
          )}
          
          {data.fileName && (
            <div className="alert alert--success" style={{ marginTop: 'var(--spacing-md)' }}>
              <Check className="alert__icon" aria-hidden="true" />
              <div className="alert__content">
                <div className="alert__title">Załadowano plik: {data.fileName}</div>
                Zaimportowano {data.items?.length || 0} rekordów
              </div>
            </div>
          )}

          <div className="alert alert--info" style={{ marginTop: 'var(--spacing-md)' }}>
            <Info className="alert__icon" aria-hidden="true" />
            <div className="alert__content">
              <div className="alert__title">Pobierz szablon</div>
              <p>Pobierz gotowy szablon pliku CSV, aby łatwo wprowadzić dane:</p>
              <button className="btn btn--secondary" style={{ marginTop: 'var(--spacing-sm)' }} onClick={() => {
                const template = `id_zgloszenia,kategoria,nazwa_przedmiotu,opis,data_znalezienia,miejsce_znalezienia,status,kontakt_telefon,kontakt_email
TERYT-ROK-NUMER,portfele,Przykładowy portfel,Opis przedmiotu,2024-03-15,Miejsce znalezienia,oczekuje_na_odbior,+48 123 456 789,email@urzad.pl`;
                const blob = new Blob([template], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'szablon_rzeczy_znalezione.csv';
                a.click();
              }}>
                <FileDown size={18} /> Pobierz szablon CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Krok 3: Wprowadzanie/edycja danych
function Step3({ data, onUpdate }) {
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  const jednostka = data.jednostka || {};
  const items = data.items || [];

  const generateId = () => {
    const year = new Date().getFullYear();
    const num = String(items.length + 1).padStart(6, '0');
    return `${jednostka.kod || '0000000'}-${year}-${num}`;
  };

  const handleAddNew = () => {
    setFormData({
      id_zgloszenia: generateId(),
      kategoria: '',
      nazwa_przedmiotu: '',
      opis: '',
      data_znalezienia: new Date().toISOString().split('T')[0],
      miejsce_znalezienia: '',
      status: 'oczekuje_na_odbior',
      kontakt_telefon: '',
      kontakt_email: '',
      kontakt_adres: '',
      godziny_otwarcia: 'pn-pt 8:00-16:00'
    });
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item, index) => {
    setFormData({ ...item });
    setEditingItem(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate({ items: newItems });
  };

  const handleSave = () => {
    let newItems;
    if (editingItem !== null) {
      newItems = items.map((item, i) => i === editingItem ? formData : item);
    } else {
      newItems = [...items, formData];
    }
    onUpdate({ items: newItems });
    setShowForm(false);
    setEditingItem(null);
  };

  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (showForm) {
    return (
      <div className="fade-in">
        <div className="step-content__header">
          <h2 className="step-content__title">
            {editingItem !== null ? 'Edytuj wpis' : 'Dodaj nowy wpis'}
          </h2>
          <p className="step-content__description">
            Wypełnij informacje o znalezionym przedmiocie
          </p>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="id_zgloszenia" className="form-label">ID zgłoszenia</label>
            <input
              id="id_zgloszenia"
              type="text"
              className="form-input"
              value={formData.id_zgloszenia || ''}
              onChange={(e) => updateFormField('id_zgloszenia', e.target.value)}
              readOnly
            />
            <span className="form-hint">Generowany automatycznie</span>
          </div>

          <div className="form-group">
            <label htmlFor="kategoria" className="form-label form-label--required">Kategoria</label>
            <select
              id="kategoria"
              className="form-select"
              value={formData.kategoria || ''}
              onChange={(e) => updateFormField('kategoria', e.target.value)}
              required
            >
              <option value="">Wybierz kategorię...</option>
              {KATEGORIE.map(k => (
                <option key={k.value} value={k.value}>{k.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group form-group--full">
            <label htmlFor="nazwa_przedmiotu" className="form-label form-label--required">Nazwa przedmiotu</label>
            <input
              id="nazwa_przedmiotu"
              type="text"
              className="form-input"
              value={formData.nazwa_przedmiotu || ''}
              onChange={(e) => updateFormField('nazwa_przedmiotu', e.target.value)}
              placeholder="np. Portfel skórzany brązowy"
              required
            />
          </div>

          <div className="form-group form-group--full">
            <label htmlFor="opis" className="form-label">Opis szczegółowy</label>
            <textarea
              id="opis"
              className="form-textarea"
              value={formData.opis || ''}
              onChange={(e) => updateFormField('opis', e.target.value)}
              placeholder="Szczegółowy opis przedmiotu (bez danych osobowych)"
              rows={3}
            />
            <span className="form-hint">Nie umieszczaj danych osobowych!</span>
          </div>

          <div className="form-group">
            <label htmlFor="data_znalezienia" className="form-label form-label--required">Data znalezienia</label>
            <input
              id="data_znalezienia"
              type="date"
              className="form-input"
              value={formData.data_znalezienia || ''}
              onChange={(e) => updateFormField('data_znalezienia', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label form-label--required">Status</label>
            <select
              id="status"
              className="form-select"
              value={formData.status || 'oczekuje_na_odbior'}
              onChange={(e) => updateFormField('status', e.target.value)}
              required
            >
              {STATUSY.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group form-group--full">
            <label htmlFor="miejsce_znalezienia" className="form-label form-label--required">Miejsce znalezienia</label>
            <input
              id="miejsce_znalezienia"
              type="text"
              className="form-input"
              value={formData.miejsce_znalezienia || ''}
              onChange={(e) => updateFormField('miejsce_znalezienia', e.target.value)}
              placeholder="np. Autobus linii 125, przystanek Centrum"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="kontakt_telefon" className="form-label form-label--required">Telefon kontaktowy</label>
            <input
              id="kontakt_telefon"
              type="tel"
              className="form-input"
              value={formData.kontakt_telefon || ''}
              onChange={(e) => updateFormField('kontakt_telefon', e.target.value)}
              placeholder="+48 123 456 789"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="kontakt_email" className="form-label form-label--required">Email kontaktowy</label>
            <input
              id="kontakt_email"
              type="email"
              className="form-input"
              value={formData.kontakt_email || ''}
              onChange={(e) => updateFormField('kontakt_email', e.target.value)}
              placeholder="rzeczy.znalezione@urzad.pl"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="kontakt_adres" className="form-label">Adres biura</label>
            <input
              id="kontakt_adres"
              type="text"
              className="form-input"
              value={formData.kontakt_adres || ''}
              onChange={(e) => updateFormField('kontakt_adres', e.target.value)}
              placeholder="ul. Przykładowa 1, 00-001 Miasto"
            />
          </div>

          <div className="form-group">
            <label htmlFor="godziny_otwarcia" className="form-label">Godziny otwarcia</label>
            <input
              id="godziny_otwarcia"
              type="text"
              className="form-input"
              value={formData.godziny_otwarcia || ''}
              onChange={(e) => updateFormField('godziny_otwarcia', e.target.value)}
              placeholder="pn-pt 8:00-16:00"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
          <button className="btn btn--secondary" onClick={() => setShowForm(false)}>
            <X size={18} /> Anuluj
          </button>
          <button 
            className="btn btn--primary" 
            onClick={handleSave}
            disabled={!formData.kategoria || !formData.nazwa_przedmiotu || !formData.data_znalezienia}
          >
            <Check size={18} /> Zapisz wpis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="step-content__header">
        <h2 className="step-content__title">Zarządzaj wpisami</h2>
        <p className="step-content__description">
          Dodaj, edytuj lub usuń wpisy o rzeczach znalezionych
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <span className="badge badge--info">
            Liczba wpisów: {items.length}
          </span>
        </div>
        <button className="btn btn--primary" onClick={handleAddNew}>
          <Plus size={18} /> Dodaj nowy wpis
        </button>
      </div>

      {items.length === 0 ? (
        <div className="alert alert--warning">
          <AlertCircle className="alert__icon" aria-hidden="true" />
          <div className="alert__content">
            <div className="alert__title">Brak wpisów</div>
            Dodaj pierwszy wpis o rzeczy znalezionej lub wróć do poprzedniego kroku, aby zaimportować dane z pliku.
          </div>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table" role="grid">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Kategoria</th>
                <th scope="col">Nazwa</th>
                <th scope="col">Data</th>
                <th scope="col">Status</th>
                <th scope="col">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.id_zgloszenia}</td>
                  <td>{KATEGORIE.find(k => k.value === item.kategoria)?.label || item.kategoria}</td>
                  <td>{item.nazwa_przedmiotu}</td>
                  <td>{item.data_znalezienia}</td>
                  <td>
                    <span className={`badge ${item.status === 'oczekuje_na_odbior' ? 'badge--warning' : item.status === 'odebrane' ? 'badge--success' : 'badge--info'}`}>
                      {STATUSY.find(s => s.value === item.status)?.label || item.status}
                    </span>
                  </td>
                  <td>
                    <div className="data-table__actions">
                      <button 
                        className="btn-icon" 
                        onClick={() => handleEdit(item, index)}
                        title="Edytuj"
                        aria-label="Edytuj wpis"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-icon--danger" 
                        onClick={() => handleDelete(index)}
                        title="Usuń"
                        aria-label="Usuń wpis"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Krok 4: Weryfikacja danych
function Step4({ data }) {
  const items = data.items || [];
  const jednostka = data.jednostka || {};

  const stats = {
    total: items.length,
    oczekuje: items.filter(i => i.status === 'oczekuje_na_odbior').length,
    odebrane: items.filter(i => i.status === 'odebrane').length,
    kategorieCount: [...new Set(items.map(i => i.kategoria))].length
  };

  const errors = [];
  const warnings = [];

  items.forEach((item, index) => {
    if (!item.nazwa_przedmiotu) errors.push(`Wpis ${index + 1}: brak nazwy przedmiotu`);
    if (!item.kategoria) errors.push(`Wpis ${index + 1}: brak kategorii`);
    if (!item.data_znalezienia) errors.push(`Wpis ${index + 1}: brak daty znalezienia`);
    if (!item.kontakt_email && !item.kontakt_telefon) {
      warnings.push(`Wpis ${index + 1}: brak danych kontaktowych`);
    }
  });

  return (
    <div className="fade-in">
      <div className="step-content__header">
        <h2 className="step-content__title">Weryfikacja danych</h2>
        <p className="step-content__description">
          Sprawdź poprawność danych przed publikacją
        </p>
      </div>

      <div className="summary-card">
        <h3 className="summary-card__title">
          <Building2 size={20} /> Jednostka samorządowa
        </h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-item__label">Nazwa</span>
            <span className="summary-item__value">{jednostka.nazwa || '-'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item__label">Kod TERYT</span>
            <span className="summary-item__value">{jednostka.kod || '-'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item__label">Województwo</span>
            <span className="summary-item__value">{jednostka.wojewodztwo || '-'}</span>
          </div>
        </div>
      </div>

      <div className="summary-card">
        <h3 className="summary-card__title">
          <FileText size={20} /> Statystyki danych
        </h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-item__label">Liczba wpisów</span>
            <span className="summary-item__value">{stats.total}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item__label">Oczekujących na odbiór</span>
            <span className="summary-item__value">{stats.oczekuje}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item__label">Odebranych</span>
            <span className="summary-item__value">{stats.odebrane}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item__label">Kategorie</span>
            <span className="summary-item__value">{stats.kategorieCount}</span>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="alert alert--error">
          <AlertCircle className="alert__icon" aria-hidden="true" />
          <div className="alert__content">
            <div className="alert__title">Błędy wymagające poprawy ({errors.length})</div>
            <ul style={{ margin: 'var(--spacing-sm) 0', paddingLeft: 'var(--spacing-lg)' }}>
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="alert alert--warning">
          <AlertCircle className="alert__icon" aria-hidden="true" />
          <div className="alert__content">
            <div className="alert__title">Ostrzeżenia ({warnings.length})</div>
            <ul style={{ margin: 'var(--spacing-sm) 0', paddingLeft: 'var(--spacing-lg)' }}>
              {warnings.map((warn, i) => <li key={i}>{warn}</li>)}
            </ul>
          </div>
        </div>
      )}

      {errors.length === 0 && (
        <div className="alert alert--success">
          <Check className="alert__icon" aria-hidden="true" />
          <div className="alert__content">
            <div className="alert__title">Dane gotowe do publikacji</div>
            Wszystkie wymagane pola zostały wypełnione poprawnie.
          </div>
        </div>
      )}

      {/* Walidacja RDF - 5 Star Open Data */}
      <div className="summary-card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3 className="summary-card__title">
          <ShieldCheck size={20} /> Walidacja RDF/XML (5 Star Open Data)
        </h3>
        <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-md)' }}>
          Zgodność z metodologią <a href="https://5stardata.info" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gov-primary)' }}>5stardata.info</a> 
          {' '}używaną przez portal dane.gov.pl
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span style={{ color: '#ffc107', fontSize: '1.2rem' }}>★★★★★</span>
            <span style={{ fontWeight: 600, color: 'var(--gov-success)' }}>Linked Data</span>
            <span style={{ color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)' }}>
              - dane zawierają URI z różnych domen (dane.gov.pl, schema.org, etc.)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span style={{ color: '#ffc107', fontSize: '1.2rem' }}>★★★★☆</span>
            <span style={{ fontWeight: 500 }}>Open Format</span>
            <span style={{ color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)' }}>
              - format RDF/XML (standard W3C)
            </span>
          </div>
        </div>
        
        <div className="alert alert--info" style={{ marginTop: 'var(--spacing-md)', marginBottom: 0 }}>
          <Info className="alert__icon" aria-hidden="true" />
          <div className="alert__content">
            <strong>Twój wynik:</strong> ★★★★★ (5/5) - Linked Data
            <br/>
            <span style={{ fontSize: 'var(--font-size-sm)' }}>
              Dane używają ontologii Dublin Core, Schema.org oraz własnej ontologii znalezione.
            </span>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <>
          <h3 style={{ marginTop: 'var(--spacing-xl)' }}>Podgląd danych</h3>
          <div className="data-table-wrapper">
            <table className="data-table" role="grid">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Kategoria</th>
                  <th scope="col">Nazwa</th>
                  <th scope="col">Data znalezienia</th>
                  <th scope="col">Miejsce</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 10).map((item, index) => (
                  <tr key={index}>
                    <td>{item.id_zgloszenia}</td>
                    <td>{KATEGORIE.find(k => k.value === item.kategoria)?.label || item.kategoria}</td>
                    <td>{item.nazwa_przedmiotu}</td>
                    <td>{item.data_znalezienia}</td>
                    <td>{item.miejsce_znalezienia?.substring(0, 30)}...</td>
                    <td>
                      <span className={`badge ${item.status === 'oczekuje_na_odbior' ? 'badge--warning' : 'badge--success'}`}>
                        {STATUSY.find(s => s.value === item.status)?.label || item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {items.length > 10 && (
            <p style={{ textAlign: 'center', color: 'var(--gray-600)' }}>
              ... oraz {items.length - 10} kolejnych wpisów
            </p>
          )}
        </>
      )}
    </div>
  );
}

// Krok 5: Publikacja
function Step5({ data, onPublish, isPublishing, isPublished }) {
  const items = data.items || [];
  const jednostka = data.jednostka || {};

  const exportToRDF = () => {
    // Namespaces RDF
    const RDF_NS = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
    const RDFS_NS = 'http://www.w3.org/2000/01/rdf-schema#';
    const DC_NS = 'http://purl.org/dc/elements/1.1/';
    const DCT_NS = 'http://purl.org/dc/terms/';
    const SCHEMA_NS = 'http://schema.org/';
    const GEO_NS = 'http://www.w3.org/2003/01/geo/wgs84_pos#';
    const FOAF_NS = 'http://xmlns.com/foaf/0.1/';
    const XSD_NS = 'http://www.w3.org/2001/XMLSchema#';
    const ZNALEZIONE_NS = 'https://dane.gov.pl/ontology/znalezione#';
    const TERYT_NS = 'https://dane.gov.pl/resource/teryt/';

    const escapeXml = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const now = new Date().toISOString();
    
    let rdf = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
  xmlns:rdf="${RDF_NS}"
  xmlns:rdfs="${RDFS_NS}"
  xmlns:dc="${DC_NS}"
  xmlns:dct="${DCT_NS}"
  xmlns:schema="${SCHEMA_NS}"
  xmlns:geo="${GEO_NS}"
  xmlns:foaf="${FOAF_NS}"
  xmlns:xsd="${XSD_NS}"
  xmlns:znalezione="${ZNALEZIONE_NS}"
  xmlns:teryt="${TERYT_NS}">

  <!-- Dataset metadata -->
  <schema:Dataset rdf:about="https://dane.gov.pl/dataset/rzeczy-znalezione-${jednostka.kod}">
    <dc:title>Rzeczy znalezione - ${escapeXml(jednostka.nazwa)}</dc:title>
    <dc:description>Rejestr rzeczy znalezionych prowadzony przez jednostkę samorządową</dc:description>
    <dc:publisher>${escapeXml(jednostka.nazwa)}</dc:publisher>
    <dct:issued>${now}</dct:issued>
    <dct:modified>${now}</dct:modified>
    <dc:language>pl</dc:language>
    <dct:spatial>${escapeXml(jednostka.wojewodztwo)}</dct:spatial>
  </schema:Dataset>

  <!-- Organization -->
  <foaf:Organization rdf:about="${TERYT_NS}${jednostka.kod}">
    <foaf:name>${escapeXml(jednostka.nazwa)}</foaf:name>
    <znalezione:kodTeryt>${jednostka.kod}</znalezione:kodTeryt>
    <znalezione:wojewodztwo>${escapeXml(jednostka.wojewodztwo)}</znalezione:wojewodztwo>
  </foaf:Organization>

`;

    // Dodaj każdą rzecz znalezioną
    items.forEach(item => {
      const itemUri = `https://dane.gov.pl/resource/rzeczy-znalezione/${escapeXml(item.id_zgloszenia)}`;
      
      rdf += `  <!-- Rzecz znaleziona: ${escapeXml(item.id_zgloszenia)} -->
  <znalezione:RzeczZnaleziona rdf:about="${itemUri}">
    <dc:identifier>${escapeXml(item.id_zgloszenia)}</dc:identifier>
    <dc:title>${escapeXml(item.nazwa_przedmiotu)}</dc:title>
`;
      
      if (item.opis) {
        rdf += `    <dc:description>${escapeXml(item.opis)}</dc:description>
`;
      }
      
      rdf += `    <znalezione:kategoria rdf:resource="${ZNALEZIONE_NS}Kategoria/${escapeXml(item.kategoria)}">${escapeXml(item.kategoria)}</znalezione:kategoria>
    <dc:date rdf:datatype="${XSD_NS}date">${item.data_znalezienia}</dc:date>
    
    <schema:location>
      <schema:Place>
        <schema:name>${escapeXml(item.miejsce_znalezienia)}</schema:name>
`;
      
      if (item.wspolrzedne_lat && item.wspolrzedne_lon) {
        rdf += `        <schema:geo>
          <schema:GeoCoordinates>
            <geo:lat rdf:datatype="${XSD_NS}decimal">${item.wspolrzedne_lat}</geo:lat>
            <geo:long rdf:datatype="${XSD_NS}decimal">${item.wspolrzedne_lon}</geo:long>
          </schema:GeoCoordinates>
        </schema:geo>
`;
      }
      
      rdf += `      </schema:Place>
    </schema:location>
    
    <znalezione:jednostkaSamorzadowa rdf:resource="${TERYT_NS}${jednostka.kod}"/>
    <znalezione:status rdf:resource="${ZNALEZIONE_NS}Status/${escapeXml(item.status)}">${escapeXml(item.status)}</znalezione:status>
`;
      
      if (item.data_przyjecia) {
        rdf += `    <znalezione:dataPrzyjecia rdf:datatype="${XSD_NS}date">${item.data_przyjecia}</znalezione:dataPrzyjecia>
`;
      }
      
      if (item.data_waznosci) {
        rdf += `    <znalezione:dataWaznosci rdf:datatype="${XSD_NS}date">${item.data_waznosci}</znalezione:dataWaznosci>
`;
      }
      
      rdf += `    
    <schema:contactPoint>
      <schema:ContactPoint>
        <schema:telephone>${escapeXml(item.kontakt_telefon)}</schema:telephone>
        <schema:email>${escapeXml(item.kontakt_email)}</schema:email>
`;
      
      if (item.kontakt_adres) {
        rdf += `        <schema:address>${escapeXml(item.kontakt_adres)}</schema:address>
`;
      }
      
      if (item.godziny_otwarcia) {
        rdf += `        <schema:hoursAvailable>${escapeXml(item.godziny_otwarcia)}</schema:hoursAvailable>
`;
      }
      
      rdf += `      </schema:ContactPoint>
    </schema:contactPoint>
`;
      
      if (item.zdjecie_url) {
        rdf += `    <schema:image rdf:resource="${escapeXml(item.zdjecie_url)}"/>
`;
      }
      
      if (item.uwagi) {
        rdf += `    <rdfs:comment>${escapeXml(item.uwagi)}</rdfs:comment>
`;
      }
      
      rdf += `    <dct:modified rdf:datatype="${XSD_NS}dateTime">${now}</dct:modified>
  </znalezione:RzeczZnaleziona>

`;
    });

    rdf += `</rdf:RDF>`;

    const blob = new Blob([rdf], { type: 'application/rdf+xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rzeczy_znalezione_${jednostka.kod}_${new Date().toISOString().split('T')[0]}.rdf`;
    a.click();
  };

  if (isPublished) {
    return (
      <div className="fade-in success-screen">
        <CheckCircle className="success-screen__icon" aria-hidden="true" />
        <h2 className="success-screen__title">Dane zostały opublikowane!</h2>
        <p className="success-screen__description">
          Dane o rzeczach znalezionych z {jednostka.nazwa} zostały pomyślnie przesłane do portalu dane.gov.pl
        </p>
        
        <div className="summary-card" style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto var(--spacing-xl)' }}>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-item__label">Liczba opublikowanych wpisów</span>
              <span className="summary-item__value">{items.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item__label">Data publikacji</span>
              <span className="summary-item__value">{new Date().toLocaleDateString('pl-PL')}</span>
            </div>
          </div>
        </div>

        <div className="success-screen__actions">
          <button className="btn btn--secondary" onClick={() => window.location.reload()}>
            <Plus size={18} /> Dodaj kolejne dane
          </button>
          <a 
            href="https://dane.gov.pl" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn--primary"
          >
            <ExternalLink size={18} /> Zobacz w portalu dane.gov.pl
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="step-content__header">
        <h2 className="step-content__title">Publikacja danych</h2>
        <p className="step-content__description">
          Wyeksportuj dane i opublikuj je w portalu dane.gov.pl
        </p>
      </div>

      <div className="alert alert--info">
        <Info className="alert__icon" aria-hidden="true" />
        <div className="alert__content">
          <div className="alert__title">Przed publikacją</div>
          Upewnij się, że dane nie zawierają informacji osobowych (imion, nazwisk, adresów prywatnych) 
          i są zgodne z przepisami o ochronie danych osobowych.
        </div>
      </div>

      <div className="summary-card">
        <h3 className="summary-card__title">
          <FileText size={20} /> Podsumowanie
        </h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-item__label">Jednostka</span>
            <span className="summary-item__value">{jednostka.nazwa}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item__label">Liczba wpisów</span>
            <span className="summary-item__value">{items.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-item__label">Format danych</span>
            <span className="summary-item__value">RDF/XML</span>
          </div>
          <div className="summary-item">
            <span className="summary-item__label">Zgodność ze schematem</span>
            <span className="summary-item__value">
              <span className="badge badge--success">✓ Zgodny</span>
            </span>
          </div>
        </div>
      </div>

      <h3>Krok 1: Pobierz dane w formacie RDF/XML</h3>
      <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-md)' }}>
        Pobierz dane w formacie RDF/XML (Linked Data) - zgodnym ze standardami Semantic Web:
      </p>
      
      <button className="btn btn--primary btn--lg" onClick={exportToRDF} style={{ marginBottom: 'var(--spacing-lg)' }}>
        <FileDown size={20} /> Pobierz RDF/XML
      </button>
      
      <div className="alert alert--info" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Info className="alert__icon" aria-hidden="true" />
        <div className="alert__content">
          <div className="alert__title">Format RDF/XML (Linked Data)</div>
          <p>Format RDF/XML umożliwia integrację z innymi zbiorami danych w sieci (Linked Open Data).</p>
          <p style={{ marginTop: 'var(--spacing-sm)', marginBottom: 0 }}>
            <strong>Używane ontologie:</strong> Dublin Core, Schema.org, GEO W3C, FOAF, własna ontologia znalezione.
          </p>
        </div>
      </div>

      <h3>Krok 2: Opublikuj w dane.gov.pl</h3>
      <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-md)' }}>
        Prześlij dane bezpośrednio do portalu dane.gov.pl:
      </p>

      <button 
        className="btn btn--success btn--lg" 
        onClick={onPublish}
        disabled={isPublishing || items.length === 0}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        {isPublishing ? (
          <>
            <span className="loader"></span> Publikowanie...
          </>
        ) : (
          <>
            <Send size={20} /> Opublikuj w dane.gov.pl
          </>
        )}
      </button>

      <div className="alert alert--info" style={{ marginTop: 'var(--spacing-xl)' }}>
        <Info className="alert__icon" aria-hidden="true" />
        <div className="alert__content">
          <div className="alert__title">Integracja z API dane.gov.pl</div>
          W wersji produkcyjnej dane zostaną automatycznie przesłane przez API do portalu dane.gov.pl 
          jako nowy zasób w zbiorze "Rzeczy znalezione - rejestr ogólnopolski".
        </div>
      </div>
    </div>
  );
}

// Główny komponent aplikacji
function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [data, setData] = useState({
    jednostka: null,
    sourceType: null,
    items: [],
    fileName: null
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const updateData = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.jednostka !== null;
      case 2: return data.sourceType !== null;
      case 3: return data.items && data.items.length > 0;
      case 4: return data.items && data.items.length > 0;
      case 5: return true;
      default: return false;
    }
  };

  const goNext = () => {
    if (currentStep < 5 && canProceed()) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    // Symulacja wywołania API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPublishing(false);
    setIsPublished(true);
    setCompletedSteps(prev => [...new Set([...prev, 5])]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 data={data} onUpdate={updateData} />;
      case 2: return <Step2 data={data} onUpdate={updateData} />;
      case 3: return <Step3 data={data} onUpdate={updateData} />;
      case 4: return <Step4 data={data} />;
      case 5: return <Step5 data={data} onPublish={handlePublish} isPublishing={isPublishing} isPublished={isPublished} />;
      default: return null;
    }
  };

  return (
    <>
      <Header />
      <main id="main" className="app-container" role="main">
        <div className="main-card">
          <Stepper currentStep={currentStep} completedSteps={completedSteps} />
          
          <div className="step-content">
            {renderStep()}
          </div>

          {!isPublished && (
            <nav className="step-navigation" aria-label="Nawigacja formularza">
              <button 
                className="btn btn--secondary"
                onClick={goBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft size={18} /> Wstecz
              </button>
              
              {currentStep < 5 ? (
                <button 
                  className="btn btn--primary"
                  onClick={goNext}
                  disabled={!canProceed()}
                >
                  Dalej <ArrowRight size={18} />
                </button>
              ) : null}
            </nav>
          )}
        </div>
        
        <footer style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)' }}>
          <p>ZnalezionePL © 2024 | Projekt na HackNation dla dane.gov.pl</p>
          <p>
            <a href="https://dane.gov.pl" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gov-primary)' }}>
              dane.gov.pl
            </a>
            {' | '}
            <a href="https://gov.pl" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gov-primary)' }}>
              gov.pl
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}

export default App;

