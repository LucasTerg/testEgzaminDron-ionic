# 🚁 Egzamin na Drona - Aplikacja Ionic React

To repozytorium zawiera aplikację mobilną/webową stworzoną w **Ionic React**, która służy do nauki i przygotowania do egzaminu na drona. Aplikacja bazuje na pytaniach z wcześniejszej wersji skryptowej.

## 🚀 Jak uruchomić aplikację?

Wymagane: `Node.js` (zainstalowany).

1.  Zainstaluj zależności:
    ```bash
    npm install
    ```

2.  Uruchom wersję deweloperską w przeglądarce:
    ```bash
    npm run dev
    # lub jeśli masz zainstalowane CLI Ionica:
    ionic serve
    ```

3.  Zbuduj wersję produkcyjną:
    ```bash
    npm run build
    ```

## 📱 Funkcje aplikacji

*   **Interaktywny Quiz:** Pytania wyświetlane jedno po drugim z natychmiastową weryfikacją.
*   **Wyjaśnienia:** Po udzieleniu odpowiedzi wyświetlane jest wyjaśnienie (oraz tabele z dodatkowymi informacjami, jeśli są dostępne).
*   **Podsumowanie:** Po zakończeniu testu otrzymasz wynik procentowy oraz listę błędnych odpowiedzi do przejrzenia.
*   **Tryb Ciemny:** Aplikacja wspiera systemowy tryb ciemny.

## 📂 Struktura projektu

*   `src/pages/Home.tsx`: Główna logika quizu i interfejs użytkownika.
*   `src/data/test.json`: Baza pytań (zaimportowana z oryginalnego projektu).
*   `stara_wersja_cli/`: Archiwum poprzedniej wersji skryptowej (Bash + jq).

## 🛠️ Technologie

*   Ionic Framework
*   React
*   TypeScript
*   Vite
*   Capacitor (do generowania aplikacji mobilnych na Android/iOS)

---
*Powodzenia na egzaminie! ✈️*
