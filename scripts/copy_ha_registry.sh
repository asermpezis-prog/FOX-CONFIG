#!/bin/sh

DEST="/config/www/"

mkdir -p "$DEST"

cp /config/.storage/core.entity_registry "$DEST/core.entity_registry.json"
cp /config/.storage/core.device_registry "$DEST/core.device_registry.json"
cp /config/.storage/core.config_entries "$DEST/core.config_entries.json"

date > "$DEST/last_update.txt"
