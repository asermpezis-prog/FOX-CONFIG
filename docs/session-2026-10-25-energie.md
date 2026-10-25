# Übergabe: Energie-Session vom 25.10.2026

Diesen Text am Anfang einer neuen Claude-Session einfügen oder auf die Datei verweisen.
Ergänzt `docs/energie-analyse-prompt.md` (Statistik-Korrektur PV) und `docs/phasenplan.md`.

## Umgebung (unverändert)

- Home Assistant OS auf **fox** (192.168.178.102:8123), Config auf **hawk** unter `/mnt/fox` gemountet.
- Repo: GitHub `asermpezis-prog/FOX-CONFIG`, Branch `main`. Claude pusht direkt nach `main`.
- **Einspielen auf hawk:** `git pull` scheitert bei geänderten Dateien mit
  `unable to unlink … Eingabe-/Ausgabefehler` (Netzwerk-Mount). Umweg:
  ```bash
  cd /mnt/fox
  git fetch
  git reset --mixed origin/main
  git show origin/main:<pfad> > <pfad>     # je geänderter Datei
  git checkout -- <neue-datei>             # je neuer Datei
  git status                               # muss "unverändert" sein
  ```
  Danach HA: Entwicklerwerkzeuge → YAML → Konfiguration prüfen → Neu starten.
  Offen: Mount-Art klären (`mount | grep fox`) und Option suchen, damit `git pull` direkt geht.

## Stromzähler

- Logarex LK13BE Zweirichtungszähler, bitShake SmartMeterReader AIR (Tasmota 15.3.0, ESP32-C3),
  IP 192.168.178.191, Hostname `tasmota-107488-5256`, MQTT-Topic `tasmota_107488`, TelePeriod 10 s.
- **PIN ist eingegeben**, Zähler liefert Nachkommastellen und Momentanwerte.
- Tasmota-Konsole: OTA-Update **nicht** machen (sonst ist SML deaktiviert).
- Entitäten (Tasmota-Discovery, Gerät „bitShake SmartMeterReader“, Bereich Technikraum):
  - `sensor.bitshake_smartmeterreader_lk13be_importactive` (kWh, Bezug 1.8.0)
  - `sensor.bitshake_smartmeterreader_lk13be_exportactive` (kWh, Einspeisung 2.8.0, steht bei 237,154)
  - `sensor.bitshake_smartmeterreader_lk13be_power` (W, Summe aller Phasen, positiv = Bezug)
  - `..._power_l1/_l2/_l3`, `..._volt_l1_curr/_l2_curr/_l3_curr`, `..._curr_l1/_l2/_l3`, `..._hz`
    → liefern **keine Einheit**; Einheit/Geräteklasse per `homeassistant.customize` im Package gesetzt.
  - `E_inHT`/`E_inNT` sind immer 0 (kein Zweitarif), Phasenwinkel nicht genutzt.
- Zählerstand am 25.10.2026 ca. 7.509 kWh Bezug.
- bitShake-**App** meldet „Kein Smart Meter gefunden“. Für HA unnötig. Vermutete Ursache:
  iOS-Freigabe „Lokales Netzwerk“ für die App fehlt (nicht bestätigt).

## Balkonkraftwerk

- Meross MSS210P in der Garage (Meross LAN), Entitäten `sensor.smart_switch_23072012310265510d0a48e1e9d22d3a_*`
  (`_power` W, `_energy` Wh, `_consumption` Wh, `_voltage` V, `_current` A).
- Saison Mai–Sep. ca. 332–334 kWh (Monatswerte ca. 50/88/90/71/33 kWh), Datenlücke 17.09.–25.10.2026.
- Ende Oktober nur noch wenige Wh pro Tag.

## Energie-Dashboard (Einstellungen in `.storage/energy`, nicht im Git)

- Netz: Bezug = `..._importactive`, Einspeisung = `..._exportactive`.
- PV: „Balkon Kraftwerk Energy“ = `..._energy` (Leistung `..._power`).
- **Vom Nutzer noch zu erledigen bzw. zu prüfen:**
  - Netzanschluss → fester Preis **0,31 €/kWh**
  - Art der Leistungsmessung → Standard → `..._lk13be_power`
  - Einzelne Geräte → Entfeuchter Hobbyraum (Energy-Sensor)

## Neu im Repo (Commits 5ed56ce … heute)

- `dashboards/enterpriseV3/packages/energie.yaml`
  - `input_number.strompreis_cent` = 31
  - Utility-Meter `netz_bezug_tag/_monat`, `netz_einspeisung_tag/_monat`
  - Templates: PV Erzeugung heute/Woche/Monat (kWh, aus Wh umgerechnet), Hausverbrauch (W/kWh),
    Eigenverbrauchsquote, Autarkiegrad, Stromkosten heute/Monat, PV-Ersparnis heute/Monat
  - `homeassistant.customize` für die Phasen-Sensoren
- `dashboards/energie/ui-lovelace.yaml` → Dashboard **„Energie & PV“** (in `configuration.yaml` eingetragen):
  - Balkonkraftwerk: Live, Ertrag/Ersparnis, 48 h, Tage/Monate
  - Stromzähler: Live-Kacheln je Phase mit Belegung, Phasenbelegungs-Tabelle, Phasentest (15 min),
    Verlauf Phasen/Spannung/Tagesbezug
  - Steckdosen: Entfeuchter Hobbyraum
- `docs/phasenplan.md` – Messmethode und Zuordnung Stromkreis → Phase

## Erkenntnisse 25.10.2026

- **Grundlast** ca. 200–400 W, liegt hauptsächlich auf L2.
- **Tagesbezug** 24.10. ca. 17 kWh.
- **Phasenbelegung** (gemessen mit Wasserkocher, Herdplatten einzeln, laufenden Geräten):
  | Phase | Geräte |
  |---|---|
  | L1 | 2.3 Spülmaschine (Heizphase ~2,1 kW), Herdplatten rechts (vorne ~2,6 kW, hinten ~0,9 kW) |
  | L2 | 1.5 Küche/Esszimmer-Steckdosen, Herdplatten links (vorne ~1,0 kW, hinten ~1,15 kW), Grundlast |
  | L3 | 2.4 Garage – Tesla einphasig 8 A ≈ 1,9 kW, Backofen ~2,1 kW |
- Abends ist **L3** am höchsten belastet (Tesla + Backofen ≈ 17 A). Unkritisch: getrennte Stromkreise,
  Hausanschluss 35 A je Phase, Tesla deutlich unter der 4,6-kVA-Schieflastgrenze.
- Hausanschluss: Moeller-SH-Schalter 35 A (E.ON Bayern), Stromkreise Moeller B16, FI 1.0 und 2.0.
- Frühere Fehldeutung korrigiert: Die „unbekannten 2 kW“ auf L3 waren der Tesla, nicht die Spülmaschine.

## Offen (nächste Session)

1. Restliche Stromkreise mit dem Wasserkocher testen: 1.1–1.4, 1.6–1.10, 2.5 Heizung, 2.6 Waschmaschine,
   2.7 Trockner → `docs/phasenplan.md` und Markdown-Karte „Phasenbelegung“ im Dashboard ergänzen.
2. **Entfeuchter Hobbyraum:** Meross-Steckdose zeigte alle Sensoren „Nicht verfügbar“ (offline?).
   Sensor-IDs `sensor.merros_entfeuchter_power/_energy/_voltage/_current` sind **angenommen**, im Dashboard
   (Reiter Steckdosen) prüfen und ggf. korrigieren.
3. Mount `/mnt/fox` so einbinden, dass `git pull` funktioniert (oder Git-Pull-Add-on in HA nutzen).
4. Optional: Tesla-Integration (Ladeleistung, Ladestand, kWh je Ladevorgang, Solar-Laden im Sommer).
5. Optional: Statistik-Prüfungen aus `docs/energie-analyse-prompt.md` (Aufgaben 2–5).

## Arbeitsregeln (vom Nutzer)

- Antworten auf Deutsch. Keine erfundenen Entitätsnamen – unsichere IDs kennzeichnen.
- Hilfsskripte als Java-Klasse oder bash, **kein PowerShell**.
- Vor Änderungen an funktionierenden Einstellungen prüfen; YAML vor dem Push validieren; direkt nach `main` pushen.
