# Prompt: Energieübersicht in Home Assistant prüfen (nur Energie, kein WLAN-Thema)

Stand: 25.10.2026. Diesen Text in eine neue Claude-Session kopieren.

## Kontext (bereits geklärt, bitte nicht neu untersuchen)
- Home Assistant OS auf "fox" (192.168.178.102:8123). Das Config-Verzeichnis ist auf dem Server "hawk" unter /mnt/fox gemountet und als Git-Repo versioniert (GitHub: asermpezis-prog/FOX-CONFIG, privat, Branch main).
- Balkonkraftwerk wird über eine Meross MSS210P (Meross-LAN-Integration, Gerät "Balkonkraftwerk", Garage) gemessen. Sie liefert Power (W), Current (A), Voltage (V), Energy (Wh, total_increasing), Consumption (Wh, total_increasing). Das reicht für die PV-Erzeugung. Von Mai bis September wurden 334 kWh korrekt erfasst.
- Entitäten (exakt so):
  - sensor.smart_switch_23072012310265510d0a48e1e9d22d3a_energy
  - sensor.smart_switch_23072012310265510d0a48e1e9d22d3a_consumption
  - sensor.smart_switch_23072012310265510d0a48e1e9d22d3a_power
  - Netz: sensor.bitshake_smartmeterreader_lk13be_importactive und ..._exportactive (Logarex-Zweirichtungszähler per bitShake/Tasmota)
- Energie-Konfiguration (.storage/energy): Solar = ..._energy mit stat_rate ..._power, Netz = importactive/exportactive. Diese Konfiguration ist korrekt.
- utility_meter in configuration.yaml (balkonkraftwerk_tag/_woche/_monat) nutzen ..._energy als Quelle.

## Ursache des früheren Fehlers (−334,18 kWh PV)
Nach dem Neu-Einrichten der Steckdose gab es eine Datenlücke vom 17.09.2026 07:00 UTC bis 25.10.2026 13:00 UTC, und die Summe (statistics.sum) startete bei 9 statt bei 334.208 neu. Das Dashboard rechnete 20 − 334.199 = −334,18 kWh.

## Bereits behoben
- Per Browser-Konsole (recorder/adjust_sum_statistics, start_time 2026-10-25T13:00:00Z) wurde die Summe für ..._energy korrigiert. In der Datenbank verifiziert: 13:00Z = 334.208, 14:00Z = 334.217, ab 15:00Z = 334.219.
- Zeiten in der DB sind UTC. Der Dialog "Summe anpassen" hatte den Wert zuvor doppelt angewandt, daher nur die Konsole nutzen und das Ergebnis in der DB prüfen.
- Aufräumen: alte Backups, ZIPs und Dashboards sind archiviert (~/BACKUP/fox-config-archiv_20261025.tar.gz). configuration.yaml enthält nur noch das Dashboard V24.

## Offene Aufgaben (der Reihe nach)
1. Energieübersicht (heute, Woche, Monat, Mai–Okt.) auf plausible Werte für PV, Netzbezug, Einspeisung und Hausverbrauch prüfen. Hausverbrauch = Bezug − Einspeisung + PV. Nachts darf PV nicht steigen.
2. Dieselbe Sprung-Prüfung für sensor.smart_switch_..._consumption (Summe 339.823, danach 6 am 25.10. 13:00Z) und für die utility_meter-Sensoren (balkonkraftwerk_tag/_woche/_monat; die Summen wirken auffällig, max. 199.600 bzw. 319.773). Nur melden und einen Vorschlag machen, nichts automatisch ändern.
3. Die 38-Tage-Lücke und weitere Meross-Geräte mit Statistik-Ende um den 15./17.09. (Schlafzimmer, Bad, smart_switch_23080457178050510d0448e1e9d4dbcd) einordnen: Ursache klären (HA aus? Gerät offline?). Prüfen, ob dort auch Summen-Sprünge vorliegen.
4. Pro Meross-Entität kontrollieren, dass Einheit (Wh) und state_class/device_class für das Energie-Dashboard zulässig sind. Falls kWh gewünscht ist: Vorschlag für eine Umrechnung per Template-Sensor mit vollständigem YAML.
5. Prüfen, ob die Netz-Sensoren (importactive/exportactive) lückenlos laufen und keine Sprünge in der Summe haben.
6. Optional: ein Dashboard-Kärtchen (V24) für PV heute/Woche/Monat und aktuelle Leistung, mit exakten Entitätsnamen.

## Arbeitsregeln
- Erst analysieren und Fakten aus echten Daten holen (HA-Datenbank lesend, Registry, Statistiken). Keine erfundenen Entitätsnamen oder Messwerte.
- Keine Änderungen an funktionierenden Einstellungen ohne vorherige Prüfung und ohne meine Freigabe. Vor jeder Änderung: HA-Backup und git commit (oder zumindest git diff zeigen).
- Zählerstände nicht willkürlich ändern. Statistik-Korrekturen nur mit nachvollziehbarer Rechnung (erwartete Summe) und anschließender Verifikation in der DB. Datenbankdatei nicht direkt beschreiben, nur über HA-Funktionen (WebSocket-API recorder/adjust_sum_statistics, recorder/import_statistics oder Entwicklerwerkzeuge).
- Vollständige, direkt ausführbare Anweisungen geben. YAML/Templates vor dem Vorschlag auf Syntax prüfen. Hilfsskripte als Java-Klasse oder bash, nicht PowerShell.
- Alle Antworten auf Deutsch.

## Erste Aktion
Die aktuellen Statistiken (statistics und statistics_short_term) für die oben genannten Entitäten lesend aus einer Datenbankkopie auslesen und Aufgabe 1 und 2 prüfen. Danach nur die Fragen stellen, die für den nächsten Schritt nötig sind.
