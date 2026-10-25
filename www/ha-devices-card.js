class HaDevicesCard extends HTMLElement {
  setConfig(config) {}

  set hass(hass) {
    if (this.loaded) return;
    this.loaded = true;

    this.filters = {};

    this.innerHTML = `
      <ha-card>
        <style>
          .wrap { padding: 16px; }
          h2 { margin-top: 0; }
          #status { margin-bottom: 12px; color: var(--secondary-text-color); }

          input {
            width: 100%;
            box-sizing: border-box;
            padding: 7px;
            border-radius: 4px;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color);
            color: var(--primary-text-color);
          }

          #globalSearch {
            padding: 12px;
            margin: 12px 0;
            font-size: 16px;
          }

          .table-wrap { width: 100%; overflow: auto; }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }

          th {
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-align: left;
            position: sticky;
            top: 0;
            z-index: 2;
            min-width: 140px;
          }

          th input {
            margin-top: 6px;
            font-size: 12px;
          }

          td {
            border: 1px solid var(--divider-color);
            padding: 8px;
            vertical-align: top;
          }

          tr:nth-child(even) { background: var(--secondary-background-color); }
          tr:hover { background: var(--divider-color); }

          code {
            font-size: 12px;
            white-space: nowrap;
          }
        table, th, td, code {
         user-select: text;
         -webkit-user-select: text;
        }

ha-card {
  user-select: text;
  -webkit-user-select: text;
}



        </style>

        <div class="wrap">
          <h2>Geräte & Entitäten</h2>
          <div id="status">Lade Registry-Dateien...</div>

          <input id="globalSearch" placeholder="Alles durchsuchen wie Excel...">

          <div class="table-wrap">
            <table>
              <thead id="thead"></thead>
              <tbody id="tbody"></tbody>
            </table>
          </div>
        </div>
      </ha-card>
    `;

    this.stopHaShortcuts(this);
    this.loadFiles();
  }

  stopHaShortcuts(root) {
    root.addEventListener("keydown", e => {
      if (e.target.tagName === "INPUT") {
        e.stopPropagation();
      }
    }, true);

    root.addEventListener("keyup", e => {
      if (e.target.tagName === "INPUT") {
        e.stopPropagation();
      }
    }, true);

    root.addEventListener("keypress", e => {
      if (e.target.tagName === "INPUT") {
        e.stopPropagation();
      }
    }, true);
  }

  async loadJson(url) {
    const response = await fetch(url + "?t=" + Date.now());
    if (!response.ok) throw new Error(url + " nicht gefunden");
    return response.json();
  }

  async loadFiles() {
    try {
      const deviceFile = await this.loadJson("/local/core.device_registry.json");
      const entityFile = await this.loadJson("/local/core.entity_registry.json");
      const entryFile = await this.loadJson("/local/core.config_entries.json").catch(() => ({ data: { entries: [] } }));

      const devices = deviceFile.data.devices || [];
      const entities = entityFile.data.entities || [];
      const entries = entryFile.data.entries || [];

      const deviceMap = {};
      devices.forEach(d => deviceMap[d.id] = d);

      const entryMap = {};
      entries.forEach(e => entryMap[e.entry_id] = e);

      this.rows = entities.map(entity => {
        const device = entity.device_id ? deviceMap[entity.device_id] : null;

        let entry = null;
        if (entity.config_entry_id) {
          entry = entryMap[entity.config_entry_id];
        } else if (device?.config_entries?.length > 0) {
          entry = entryMap[device.config_entries[0]];
        }

        return {
          entity_id: entity.entity_id || "—",
          name: entity.name || entity.original_name || "—",
          device: device ? (device.name_by_user || device.name || "—") : "—",
          device_id: device ? device.id : "—",
          manufacturer: device ? (device.manufacturer || "—") : "—",
          model: device ? (device.model || "—") : "—",
          identifiers: device ? JSON.stringify(device.identifiers || []) : "—",
          connections: device ? JSON.stringify(device.connections || []) : "—",
          integration: entry ? (entry.title || entry.domain || "—") : "—",
          platform: entity.platform || (entry ? entry.domain : "—"),
          disabled: entity.disabled_by || "nein",
          hidden: entity.hidden_by || "nein"
        };
      }).sort((a, b) => a.entity_id.localeCompare(b.entity_id));

      this.renderHeader();
      this.renderBody();

    } catch (err) {
      this.querySelector("#status").innerHTML =
        `<b style="color:red;">Fehler:</b> ${err.message || err}`;
    }
  }

getColumns() {
  return [
    ["manufacturer", "Hersteller"],
    ["device", "Gerätname"],
    ["device_id", "Device-ID"],
    ["entity_id", "Entität-ID"],
    ["name", "Entitätname"],
    ["model", "Modell"],
    ["integration", "Integration"],
    ["platform", "Plattform"],
    ["disabled", "Deaktiviert"],
    ["hidden", "Versteckt"]
  ];
}

  renderHeader() {
    const columns = this.getColumns();

    this.querySelector("#thead").innerHTML = `
      <tr>
        ${columns.map(([key, label]) => `
          <th>
            ${label}
            <input data-filter="${key}" placeholder="Filter">
          </th>
        `).join("")}
      </tr>
    `;

    this.querySelector("#globalSearch").addEventListener("input", e => {
      e.stopPropagation();
      this.filters.global = e.target.value.toLowerCase();
      this.renderBody();
    });

    this.querySelectorAll("th input").forEach(input => {
      input.addEventListener("input", e => {
        e.stopPropagation();
        this.filters[e.target.dataset.filter] = e.target.value.toLowerCase();
        this.renderBody();
      });

      input.addEventListener("click", e => e.stopPropagation());
      input.addEventListener("focus", e => e.stopPropagation());
    });
  }

  match(value, filter) {
    return String(value || "").toLowerCase().includes(filter || "");
  }

  renderBody() {
    const columns = this.getColumns();
    const global = this.filters.global || "";

    const rows = this.rows.filter(row => {
      const allText = Object.values(row).join(" ").toLowerCase();
      if (!allText.includes(global)) return false;

      return columns.every(([key]) =>
        this.match(row[key], this.filters[key])
      );
    });

    this.querySelector("#status").innerText =
      `${rows.length} von ${this.rows.length} Entitäten angezeigt`;

    this.querySelector("#tbody").innerHTML = rows.map(row => `
      <tr>
        ${columns.map(([key]) => `
          <td>
            ${key.includes("id") || key === "identifiers" || key === "connections"
              ? `<code>${row[key]}</code>`
              : row[key]}
          </td>
        `).join("")}
      </tr>
    `).join("");
  }

  getCardSize() {
    return 10;
  }
}

customElements.define("ha-devices-card", HaDevicesCard);