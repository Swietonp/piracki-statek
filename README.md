# 🏴‍☠️ Piracki Statek

Lekka gra przeglądarkowa typu "znajdź ukryty statek" z progresją poziomów, near-win revealem i opcjonalnym statkiem ratunkowym uruchamianym po podaniu danych (lead gen).

## 🚀 Szybki start
- Otwórz `index.html` w przeglądarce **lub** uruchom lokalny serwer:
   - `python -m http.server 8000` → `http://localhost:8000`
   - `npx http-server -p 8000 -o` (jeśli masz `node`/`npm`)
- Gra startuje automatycznie na poziomie 1.

## 🎮 Jak się gra
- Kliknij kafelek, by odkryć, czy skrywa piracki statek.
- Po każdym strzale odkrywane są wszystkie statki (near-win experience).
- Trafienie:
   - Dostajesz punkty poziomu (zastępują poprzednie).
   - Wybierasz: zakończyć grę i zachować punkty, albo przejść na kolejny poziom.
- Pudło:
   - Gra kończy się; punkty wracają do wartości poprzedniego poziomu (0, jeśli przegrasz na poziomie 1).
- Statek ratunkowy (🛟):
   - Aktywuje się po podaniu imienia, emaila i zgody RODO (formularz lead gen).
   - Daje jedną dodatkową próbę na poziomie, w którym został znaleziony.

## 📊 Poziomy i punktacja
| Poziom | Plansza | Statki | Szansa | Punkty |
|---|---|---|---|---|
| Start | – | – | – | 2.00 |
| 1 | 4x5 | 10 | 50% | 4.00 |
| 2 | 5x5 | 10 | 40% | 10.00 |
| 3 | 6x5 | 9 | 30% | 33.33 |
| 4 | 6x6 | 9 | 25% | 133.33 |
| 5 | 7x5 | 7 | 20% | 666.67 |
| 6 | 8x5 | 6 | 15% | 4,444.44 |
| 7 | 8x5 | 4 | 10% | 44,444.44 |
| 8 | 10x6 | 3 | 5% | 888,888.89 |

## 🧭 Najważniejsze elementy UI
- `#leadModal` — formularz aktywacji statku ratunkowego (lead capture, zapis w `localStorage` pod kluczem `pirackiStatekLeads`).
- `#decisionModal` — wybór: wypłata punktów vs. kolejny poziom.
- `#gameOverModal` — ekran końca gry z finalnymi punktami i restartem.
- `#leaderboardBody` — leaderboard (dane przykładowe + bieżący gracz po zakończeniu).

## 🛠️ Struktura
- `index.html` — markup i kontenery na modale/board/leaderboard.
- `style.css` — layout, animacje; modale centrowane `display: grid; place-items: center;`.
- `game.js` — logika poziomów, statków, leadów, komunikatów i leaderboardu.

## 🔒 Dane i prywatność
- Dane z formularza (imię, email, timestamp) są zapisywane lokalnie w `localStorage`.
- Zgoda marketingowa jest wymagana do aktywacji statku ratunkowego (akcja "statek ratunkowy"pozwala rozegrać rundę jeszcze raz).

## 💡 Dalszy rozwój (propozycje)
- Backendowy leaderboard i eksport leadów, baza danych, admin panel.
- Dźwięki, muzyka, power-upy, nowe układy plansz.
- Analityka zdarzeń (trafienia/pudła/aktywacje).

**Graj odpowiedzialnie. Powodzenia!** 🏴‍☠️
