# Übergabe Home Assistant "fox" (Stand 27.10.2026, ca. 02:10)

Ausführliche Fassung: Claude-Projekt "FOX", Dokument `claude/ha-konfiguration.md`. Kurzfassung:

## Stand
- Dashboard V24 (`dashboards/enterpriseV24`): Übersicht mit zwei Karten oben (Steckdosen, Entfeuchter), Haus-Status, Klappkarten (Expander Card) für Energie & PV, Kameras, Keller, Erdgeschoss, Außen, 1. Etage. Neue Räume: Flur, Windfang, Gäste-WC (leer), Wohnzimmer/Küche getrennt, Garage/Carport getrennt, Garten mit Reolink.
- Dashboard Energie & PV (`dashboards/energie`): Stromzähler in drei Spalten, Diagramme per Schalter (`input_boolean.zeige_phasentest`, `zeige_verlauf`, Package `ansicht.yaml`), weil apexcharts in der Expander Card einen Konfigurationsfehler zeigt.
- Kamera: Tapo (Technikraum) und Reolink (Garten) mit eigenen Zählern/Zeiten (`packages/kamera.yaml`, zwei neue Automationen).
- Benennung: Meross "Merros 1–6", Zigbee "Selly 1–3" (Entitäts-IDs unverändert lassen).
- Entfeuchter: zwei Automationen mit gleichen Regeln (Merros 4 Hobbyraum, Merros 5 Technikraum), im Bad keiner mehr.
- Sicherheit: `www/core.config_entries.json` entfernt, Skript kopiert nur noch Geräte- und Entitätenregister.

## Offen (morgen)
1. Git prüfen und alles einchecken (`git status -sb` auf fox).
2. Geräte in HA umbenennen (Entitäts-IDs nicht mit umbenennen).
3. Merros 1 (Desktop) und 3 (Waschmaschine) wieder erreichbar machen, Merros 4 ohne Messwerte.
4. Zweck von Merros 2 klären (Technikraum).
5. Entfeuchter-Automationen zusammenführen?
6. Tab "Steckdosen" im Energie-Dashboard ausbauen.
7. WLAN Garage (Repeater 1200 AX per LAN), Balkonkraftwerk-Steckdose nur 10 % Signal.
8. Statistik-Prüfungen (`docs/energie-analyse-prompt.md`), Netzpreis, Tesla, frisches HA-Backup, Passwörter ändern falls HA von außen erreichbar.

## Hinweise für Claude-Sessions
- Auf hawk (`/mnt/fox`) kein `git pull`/`rebase`/`restore`, das auf fox (`/config`) tun, pushen von hawk.
- Nach dem Bearbeiten einer View: `touch dashboards/enterpriseV24/ui-lovelace.yaml`, Strg+F5.
- Beim Bearbeiten von YAML per Skript Abschnittszahl und Dateigröße vor dem Schreiben prüfen (kein breites Löschmuster).
- Datenbankzeiten sind UTC.
