#!/bin/sh
# Kopiert Registry-Daten für die Karte ha-devices-card nach /config/www.
# Alles in /config/www ist unter /local/ OHNE Anmeldung abrufbar.
# core.config_entries wird bewusst NICHT mehr kopiert: Die Datei enthält
# Passwörter, Tokens und Schlüssel der Integrationen.

DEST="/config/www"

mkdir -p "$DEST"

cp /config/.storage/core.entity_registry "$DEST/core.entity_registry.json"
cp /config/.storage/core.device_registry "$DEST/core.device_registry.json"

date > "$DEST/last_update.txt"
