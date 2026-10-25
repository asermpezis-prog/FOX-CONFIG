# Prompt: Tesla in Home Assistant einbinden

Stand: 25.10.2026. Diesen Text in eine neue Claude-Session im Projekt FOX kopieren.

## Kontext (bitte zuerst lesen, nicht neu untersuchen)
- Repo GitHub `asermpezis-prog/FOX-CONFIG`, Branch `main`. Zuerst lesen:
  `docs/session-2026-10-25-energie.md` (Energie-Setup, Entitäten, Arbeitsregeln) und `docs/phasenplan.md`.
- Home Assistant OS 18.1, Core 2026.10.3 auf fox (192.168.178.102). Änderungen einspielen per
  SSH-Add-on: `cd /config && git pull`, dann Konfiguration prüfen und neu starten.
- Dashboard „Energie & PV“: `dashboards/energie/ui-lovelace.yaml`, Sensoren im Package
  `dashboards/enterpriseV3/packages/energie.yaml` (Strompreis `input_number.strompreis_cent` = 31 ct/kWh).
- Tesla lädt zu Hause **einphasig mit 8 A (~1,9 kW) über Stromkreis 2.4 Garage auf Phase L3**.
  Auf L3 liegt auch der Backofen. Hausanschluss 35 A je Phase.
- Balkonkraftwerk (Meross, max. einige hundert Watt) reicht nicht für Solarladen (Tesla min. ~5 A).
- HACS ist installiert. Garage hat schwaches WLAN.

## Ziel
1. Passende Integration auswählen und mit mir einrichten. Optionen gegenüberstellen
   (Tesla Fleet = offiziell/kostenlos, aber aufwendig; Teslemetry/Tessie = Abo, einfach),
   aktuelle Kosten und Voraussetzungen recherchieren, Empfehlung geben, Entscheidung mir überlassen.
2. Nach der Einrichtung: echte Entitäts-IDs aus der Registry holen
   (`grep -o '"entity_id":"[^"]*' /config/.storage/core.entity_registry | grep -i <name>`).
3. Dashboard „Energie & PV“ um einen Reiter **Tesla** erweitern: Ladestand, Ladeleistung, Ladestrom,
   geladene kWh, Kosten der Ladung (× Strompreis), Ladelimit, Start/Stopp.
4. Tesla als Gerät im Energie-Dashboard („Einzelne Geräte“) mit kWh-Sensor.
5. Optional, nur nach Rückfrage: Automation „Ladestrom reduzieren/pausieren, wenn L3 > 13 A“
   (Backofen + Tesla) mit `sensor.bitshake_smartmeterreader_lk13be_curr_l3`.

## Arbeitsregeln
- Deutsch. Keine erfundenen Entitätsnamen – unsichere IDs kennzeichnen.
- Hilfsskripte als Java-Klasse oder bash, kein PowerShell.
- Zugangsdaten/Tokens nie ins Git (secrets.yaml ist in .gitignore).
- YAML vor dem Push validieren, direkt nach `main` pushen, Übergabedatei am Ende aktualisieren.
