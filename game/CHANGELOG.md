# Changelog - Kopalnie Prawdopodobieństwa

## [1.1.0] - Code Review Fixes

### 🔴 Krytyczne poprawki

#### 1. **Naprawiono normalizację prawdopodobieństw w RNG**
- **Problem**: Po zastosowaniu bonusów szczęścia suma prawdopodobieństw nie wynosiła 100%
- **Rozwiązanie**: 
  - Dodano funkcję `normalizeChances()` która normalizuje prawdopodobieństwa do sumy 1.0
  - Rozdzielono logikę na `calculateModifiedChances()` i `normalizeChances()`
  - Dodano fallback w `selectCrystalByChance()` na wypadek błędów zaokrągleń

#### 2. **Naprawiono wyświetlanie prawdopodobieństw**
- **Problem**: Panel prawdopodobieństw pokazywał nieznormalizowane wartości
- **Rozwiązanie**: `updateProbabilityDisplay()` teraz używa znormalizowanych wartości

#### 3. **Naprawiono race condition w energy regen**
- **Problem**: Wiele wywołań `startEnergyRegen()` tworzyło multiple intervals (memory leak)
- **Rozwiązanie**:
  - Dodano cleanup poprzedniego interval przed utworzeniem nowego
  - Dodano cleanup w `window.beforeunload` event
  - Używamy jednej globalnej zmiennej `energyRegenInterval`

### 🟠 Średnie poprawki

#### 4. **Wymieniono `alert()` na toast system**
- **Problem**: `alert()` blokuje UI i nie jest user-friendly
- **Rozwiązanie**:
  - Stworzono system toast notifications z różnymi typami (success, error, warning, info)
  - Toast'y mają accessibility (role="alert", aria-live)
  - Auto-dismiss po 3 sekundach

#### 5. **Poprawiono near-win logic**
- **Problem**: Near-win był wykrywany nawet dla dobrych wyników
- **Rozwiązanie**: Teraz sprawdzamy near-win tylko dla 'rock' i 'empty'

#### 6. **Usunięto magic numbers**
- Dodano konstanty: `GRID_SIZE`, `GRID_TOTAL`, `MOSAIC_SLOTS`, `ENERGY_REGEN_INTERVAL`, etc.

#### 7. **Lepszy error handling dla Web Share API**
- Teraz ignorujemy `AbortError` (user cancel) i pokazujemy informacyjne toasty

### 🟢 Optymalizacje wydajności

#### 8. **Dodano debouncing dla saveGameState()**
- **Problem**: Częste zapisy do localStorage mogą spowalniać grę
- **Rozwiązanie**:
  - Funkcja `saveGameStateDebounced()` z 1-sekundowym debounce
  - Force immediate save w `beforeunload`
  - Flaga `pendingSave` zapobiega utracie danych

#### 9. **Event delegation dla mine tiles**
- **Problem**: 25 event listenerów dla każdego tile
- **Rozwiązanie**: Jeden listener na grid container używający `event.target.closest()`

#### 10. **Optymalizacja mosaic render**
- Incremental update pojedynczych slotów zamiast full re-render
- Memory leak fix: usuwanie starych event listenerów przy re-render grid

### ✨ Poprawa jakości kodu

#### 11. **Wydzielono CSS do osobnego pliku**
- Utworzono `/src/styles.css` z całym stylowaniem
- HTML teraz znacznie czystszy i łatwiejszy w utrzymaniu

#### 12. **Dodano utility functions**
- `formatNumber()`, `formatPercent()`
- `escapeHtml()`, `sanitizeString()`
- `isValidEmail()` z pełną walidacją RFC 5322

#### 13. **Dodano walidację input**
- Maksymalna długość: `MAX_PLAYER_NAME_LENGTH = 20`, `MAX_EMAIL_LENGTH = 254`
- Email validation w JS (nie tylko HTML5)
- Sanityzacja przed zapisem do localStorage

#### 14. **Dodano constants i configuration**
- Wszystkie magic numbers zamienione na nazwane konstanty
- Centralna konfiguracja w górnej części pliku
- i18n messages w obiekcie `MESSAGES`

### ♿ Accessibility

#### 15. **Pełne wsparcie ARIA**
- Dodano `aria-label` dla wszystkich interaktywnych elementów
- `aria-live="polite"` dla dynamicznych treści (toasty, wyniki)
- `role="dialog"` dla modali z `aria-modal="true"`
- `role="grid"` dla mine grid i mosaic

#### 16. **Keyboard navigation**
- Skip link dla użytkowników keyboard-only
- Focus trap w modalach
- Tab navigation między focusable elements
- Space bar jako shortcut do drill
- Escape zamyka modale i panele

#### 17. **Focus management**
- Zapisywanie `lastFocusedElement` przed otwarciem modalu
- Przywracanie focus po zamknięciu
- Visible focus indicators (outline)

#### 18. **Reduced motion support**
- Media query `prefers-reduced-motion: reduce`
- Wyłączenie/skrócenie animacji dla użytkowników z motion sensitivity

### 🧪 Testing

#### 19. **Dodano unit testy**
- Plik `/src/tests.js` z frameworkiem testowym
- Testy RNG distribution (Chi-squared test)
- Testy normalizacji prawdopodobieństw
- Testy utility functions
- Testy edge cases (localStorage errors, malformed data)

#### 20. **Wizualne RNG testy**
- Plik `/tests/rng.test.html` z interaktywnym UI
- Wykresy rozkładu prawdopodobieństw
- Quick/Medium/Full test modes (1K/10K/100K iteracji)
- Test z luck bonus

### 🔒 Bezpieczeństwo

#### 21. **Walidacja zapisów gry**
- Funkcja `isValidGameState()` sprawdza format przed załadowaniem
- Graceful degradation przy uszkodzonych danych
- Confirm dialog przed resetem gry

#### 22. **XSS protection**
- `escapeHtml()` dla wszystkich user-generated content
- Użycie `textContent` zamiast `innerHTML` gdzie możliwe

### 🌐 Offline support

#### 23. **Detekcja statusu połączenia**
- Event listeners dla `online`/`offline`
- Toast notifications informujące o statusie
- LocalStorage jako fallback (już zaimplementowane)

### 📝 Dokumentacja

#### 24. **JSDoc comments dla głównych funkcji**
- Dodano komentarze opisujące parametry i return values
- Sekcje w kodzie dla lepszej organizacji

#### 25. **README & CHANGELOG**
- Zaktualizowano README z nową strukturą
- Ten CHANGELOG dokumentuje wszystkie zmiany

---

## Statystyki zmian

- **Pliki zmodyfikowane**: 3
- **Pliki utworzone**: 3
- **Linie kodu dodane**: ~800
- **Linie kodu usuniętych**: ~100 (inline CSS)
- **Błędy naprawione**: 21
- **Testy dodane**: 20+
- **Accessibility improvements**: 10+

## Co dalej?

### Potencjalne przyszłe ulepszenia:
- [ ] Migracja na TypeScript dla type safety
- [ ] Service Worker dla pełnego offline support
- [ ] WebSocket dla real-time leaderboard
- [ ] Achievement system z badges
- [ ] Sound effects (z opcją wyłączenia)
- [ ] Animacje transition między depth levels
- [ ] Tutorial/onboarding dla nowych graczy
- [ ] Export/import save game
- [ ] Analytics (privacy-respecting)

---

**Wszystkie krytyczne i średnie błędy zostały naprawione! ✅**

