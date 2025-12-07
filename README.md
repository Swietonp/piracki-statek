# 🏴‍☠️ Piracki Statek - Gra Przeglądarowa

Nowoczesna gra przeglądarowa inspirowana mechaniką "znajdź ukryty obiekt" z progresywnym systemem poziomów.

## 📋 Opis Gry

Piracki Statek to ekscytująca gra, w której gracze muszą odnaleźć ukryte pirackie statki pod kafelkami na planszy. Gra składa się z 7 poziomów o rosnącym poziomie trudności.

### Mechanika Gry

**Start**: Gracz zaczyna z 2.00 pkt

- **Poziom 1**: Plansza 4x5, 10 statków (50% szans) → 4.00 pkt
- **Poziom 2**: Plansza 5x5, 10 statków (40% szans) → 10.00 pkt
- **Poziom 3**: Plansza 6x5, 9 statków (30% szans) → 33.33 pkt
- **Poziom 4**: Plansza 6x6, 9 statków (25% szans) → 133.33 pkt
- **Poziom 5**: Plansza 7x5, 7 statków (20% szans) → 666.67 pkt
- **Poziom 6**: Plansza 8x5, 6 statków (15% szans) → 4,444.44 pkt
- **Poziom 7**: Plansza 8x5, 4 statki (10% szans) → 44,444.44 pkt
- **Poziom 8**: Plansza 10x6, 3 statki (5% szans) → 888,888.89 pkt 🏆

### Kluczowe Funkcje

✅ **Statek Ratunkowy z Lead Generation** 🛟: 
- Statek ratunkowy pojawia się ZAWSZE na każdym poziomie (wyszarzony)
- Gdy gracz kliknie w statek ratunkowy, pojawia się formularz zgody marketingowej
- Po wypełnieniu formularza (imię, email, zgoda RODO), statek ratunkowy staje się aktywny
- Aktywny statek ratunkowy daje dodatkową próbę na tym samym poziomie
- **Inteligentny lead generation** - użytkownik podaje dane tylko gdy CHCE użyć premii!

✅ **Near-Win Experience**: Po każdym strzale pokazywane są pozycje wszystkich statków, co zwiększa emocje i pokazuje jak blisko było do wygranej

✅ **System Punktów Progresywnych**:
- Start: 2.00 pkt
- Poziom 1: 4.00 pkt (50% - 4x5, 20 kafelków)
- Poziom 2: 10.00 pkt (40% - 5x5, 25 kafelków)
- Poziom 3: 33.33 pkt (30% - 6x5, 30 kafelków)
- Poziom 4: 133.33 pkt (25% - 6x6, 36 kafelków)
- Poziom 5: 666.67 pkt (20% - 7x5, 35 kafelków)
- Poziom 6: 4,444.44 pkt (15% - 8x5, 40 kafelków)
- Poziom 7: 44,444.44 pkt (10% - 8x5, 40 kafelków)
- Poziom 8: 888,888.89 pkt (5% - 10x6, 60 kafelków) - Główna Nagroda! 🏆



✅ **Live Leaderboard**: Tabela najlepszych graczy pokazująca poziom osiągnięcia i zdobyte punkty

✅ **Transparentność**: Gra zgodna z polskimi regulacjami hazardowymi, transparentna monetyzacja

## 🎨 Design

Gra wykorzystuje nowoczesny, minimalistyczny design z:
- Gradientami kolorów
- Płynnymi animacjami
- Efektami świetlnymi
- Responsywnym layoutem
- Komiksową estetyką (emotikony)

## 🚀 Technologie

- **HTML5** - struktura
- **CSS3** - stylizacja z animacjami
- **JavaScript (Vanilla)** - logika gry
- **Google Fonts (Poppins)** - typografia

## 📦 Instalacja i Uruchomienie

### Opcja 1: Bezpośrednie Otwarcie

Wystarczy otworzyć plik `index.html` w przeglądarce.

### Opcja 2: Lokalny Serwer (Zalecane)

```bash
# Użyj Python
python -m http.server 8000

# Lub użyj Node.js (jeśli zainstalowany)
npx http-server

# Lub użyj VS Code Live Server
# Kliknij prawym przyciskiem na index.html -> Open with Live Server
```

Następnie otwórz przeglądarkę i przejdź do `http://localhost:8000`

## 🎮 Jak Grać

1. **Start**: Gra rozpoczyna się od razu - nie potrzebujesz rejestracji!
2. **Wybierz Kafelek**: Kliknij na kafelek, aby sprawdzić czy jest tam statek piracki
3. **Statek Ratunkowy** 🛟: 
   - Jeśli znajdziesz wyszarzony statek ratunkowy, możesz go aktywować
   - Kliknij w niego i podaj dane (imię, email, zgoda RODO)
   - Po aktywacji masz dodatkową próbę!
4. **Obserwuj Wynik**: Wszystkie statki zostaną ujawnione (near-win experience)
5. **Trafienie**: Zdecyduj czy kontynuować grę czy zabrać punkty
6. **Pudło**: Gra kończy się, zachowujesz punkty z poprzedniego poziomu
7. **Cel**: Dojdź do poziomu 8 i wygraj 888,888.89 pkt! 🏆

## 📊 System Punktacji

Punkty są przyznawane progresywnie - każdy kolejny poziom daje więcej punktów:

| Poziom | Punkty | Plansza | Kafelki | Statki | Szansa |
|--------|--------------|---------|---------|---------|---------|
| Start  | 2.00         | -       | -       | -       | -       |
| 1      | 4.00         | 4x5     | 20      | 10      | 50%     |
| 2      | 10.00        | 5x5     | 25      | 10      | 40%     |
| 3      | 33.33        | 6x5     | 30      | 9       | 30%     |
| 4      | 133.33       | 6x6     | 36      | 9       | 25%     |
| 5      | 666.67       | 7x5     | 35      | 7       | 20%     |
| 6      | 4,444.44     | 8x5     | 40      | 6       | 15%     |
| 7      | 44,444.44    | 8x5     | 40      | 4       | 10%     |
| 8      | 888,888.89   | 10x6    | 60      | 3       | 5%      |


## 📱 Responsywność

Gra jest w pełni responsywna i działa na:
- Komputerach stacjonarnych
- Tabletach
- Smartfonach (Android, iOS)

## 🔒 Zgodność z RODO i Regulacjami

- ✅ Wymagana zgoda na przetwarzanie danych
- ✅ Przejrzysta informacja o przetwarzaniu danych
- ✅ Zgodność z polskimi regulacjami hazardowymi
- ✅ Transparentna monetyzacja

## 📈 Lead Generation

Dane użytkowników są zapisywane w localStorage przeglądarki:
- Imię
- Email
- Timestamp rejestracji

Dane można eksportować do zewnętrznych systemów CRM/marketingowych.

## 🎯 Plany Rozwoju

- [ ] Integracja z systemami płatności
- [ ] Backend API dla leaderboardu
- [ ] System power-upów
- [ ] Tryb multiplayer
- [ ] Więcej rodzajów statków
- [ ] Dźwięki i muzyka

## 📄 Licencja

Projekt stworzony na potrzeby HackNation 2025.

## 🤝 Wsparcie

W przypadku pytań lub problemów, skontaktuj się z zespołem deweloperskim.

---

**Graj odpowiedzialnie! 🎮**
