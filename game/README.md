# ⛏️ Kopalnie Prawdopodobieństwa

> Wydobywaj kryształy i buduj swoją mozaikę szczęścia!

## 🎮 O Grze

**Kopalnie Prawdopodobieństwa** to wciągająca gra losowa, w której schodzisz do magicznej kopalni pełnej cennych kryształów. Każde uderzenie kilofa to losowanie – co odkryjesz?

### Główne mechaniki:

- ⛏️ **Wydobywanie** - Każde kopnięcie odkrywa losowy kryształ
- 💎 **Kryształy** - Od pospolitego kwarcu po legendarny diament
- 🧩 **Mozaika Szczęścia** - Zbieraj kryształy i kompletuj mozaiki
- 📊 **Transparentność** - Wszystkie prawdopodobieństwa są jawne
- 🔥 **Near-win** - Emocjonujące "prawie trafienia"
- 📈 **Progresja** - Poziomy kopalni i rozwój postaci

## 🎯 Zgodność z wymaganiami

| Wymaganie | Implementacja |
|-----------|---------------|
| ✅ Losowość jako kluczowy element | RNG dla każdego kopnięcia, transparentne szanse |
| ✅ Monetyzacja | Sklep z premium walutą (diamenty), energy packs |
| ✅ Atrakcyjność wizualna | Klimatyczny design kopalni, animacje kryształów |
| ✅ Responsywność | Pełna obsługa mobile i desktop |
| ✅ Uczciwe lootboxy | Jawne prawdopodobieństwa, regulowana mechanika |
| ✅ Prostota | Jedna akcja = jedno kopnięcie |
| ✅ Free-to-play | Darmowa gra z opcjonalnymi zakupami |
| ✅ Engagement mechanics | Near-win, daily bonus, streak system |
| ✅ Lead generation | Zbieranie emaili z bonusami |
| ✅ Progresja | Mozaika, poziomy kopalni, rozwój górnika |

## 🎲 Prawdopodobieństwa

| Kryształ | Szansa | Punkty |
|----------|--------|--------|
| 💎 Diament | 0.5% | 1000 |
| ❤️ Rubin | 2% | 500 |
| 💚 Szmaragd | 5% | 300 |
| 💙 Szafir | 8% | 200 |
| ⭐ Złoto | 10% | 100 |
| 💜 Ametyst | 15% | 50 |
| 🤍 Kwarc | 25% | 20 |
| 🪨 Skała | 29.5% | 5 |
| 🕳️ Pusta komora | 5% | 0 |

*Szanse rosną wraz z głębokością kopalni i bonusami szczęścia*

## 🚀 Uruchomienie

```bash
# Instalacja zależności
npm install

# Tryb deweloperski
npm run dev

# Budowanie produkcyjne
npm run build
```

## 🛠️ Technologie

- **Vanilla JavaScript** - Szybka, lekka implementacja
- **CSS3** - Animacje, gradienty, efekty świetlne
- **Vite** - Szybki bundler
- **LocalStorage** - Persystencja stanu gry

## 📁 Struktura projektu

```
game/
├── index.html          # Główny plik HTML gry
├── src/
│   ├── main.js        # Główna logika gry (RNG, state, UI)
│   ├── styles.css     # Wszystkie style CSS
│   └── tests.js       # Unit testy
├── tests/
│   └── rng.test.html  # Interaktywne testy RNG
├── package.json       # Konfiguracja projektu
├── README.md         # Ten plik
└── CHANGELOG.md      # Historia zmian i naprawionych błędów
```

## 🧪 Testowanie

### Unit testy (w konsoli):
1. Otwórz konsolę przeglądarki podczas gry
2. Wywołaj: `runAllTests()`
3. Zobacz wyniki testów RNG, logiki gry i utility functions

### Wizualne testy RNG:
1. Otwórz `http://localhost:5173/tests/rng.test.html`
2. Wybierz Quick/Medium/Full test (1K/10K/100K iteracji)
3. Zobacz interaktywne wykresy rozkładu prawdopodobieństw
4. Test z luck bonus weryfikuje poprawność modyfikatorów

Wszystkie testy zawierają Chi-squared analysis dla weryfikacji jakości RNG.

## 📱 Wsparcie platform

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Android Chrome)
- ✅ Tablet
- ✅ PWA-ready

## ⚖️ Odpowiedzialna gra

Gra zawiera:
- Jawne prawdopodobieństwa
- Ograniczenia energii (cool-down)
- Ostrzeżenia dla graczy 18+
- Tracking czasu sesji

---

*Stworzone na HackNation 2025*
