# Phasenplan – welcher Stromkreis hängt an L1, L2, L3

Stand: 25.10.2026 · Hauptschalter: 35 A SH-Schalter (E.ON Bayern) · Stromkreise: B16

## Messmethode

Live-Anzeige: Dashboard **Energie & PV → Stromzähler**, Karte **„Phasentest – letzte 15 Minuten“**.
Der Lesekopf meldet alle 10 Sekunden, also nach jedem Schritt ca. 20–30 s warten.

**Für Steckdosen-Stromkreise (1.x, 2.4): Testverbraucher statt Abschalten**
1. Wasserkocher (ca. 2 kW) mit Wasser füllen.
2. In eine Steckdose des Raums stecken, einschalten.
3. Ablesen, welche Phase um ca. 2.000 W springt → eintragen.
4. Ausschalten, nächster Raum.

So bleibt alles in Betrieb, auch Home Assistant und der Router.

**Für fest angeschlossene Geräte (Herd, Spülmaschine, Trockner, Heizung)**
- Gerät kurz einschalten (Spülmaschine/Waschmaschine in der Heizphase, Trockner normal).
- Herd: **jede Kochplatte einzeln** kurz auf volle Stufe → je Platte die Phase notieren.
- Alternativ: Gerät läuft, Sicherung kurz aus → welche Phase fällt?

**Nicht abschalten:** 1.1 Technikraum (Home Assistant, Netzwerk), 2.4 Garage während des Ladens.

## Zuordnung

| Nr. | Stromkreis | Phase | Gemessen | Bemerkung |
|---|---|---|---|---|
| 1.1 | Technikraum | | | nicht abschalten, nur mit Testverbraucher |
| 1.2 | Büro, Gang | | | |
| 1.3 | Hobbyraum | | | Entfeuchter (Meross) |
| 1.4 | Windfang, WC | | | |
| 1.5 | Küche, Esszimmer | | | |
| 1.6 | Wohnzimmer | | | |
| 1.7 | Badezimmer | | | |
| 1.8 | Schlafzimmer | | | |
| 1.9 | Kinderzimmer Nord | | | |
| 1.10 | Kinderzimmer Süd | | | |
| 1.11 | Sprechanlage | | | Last zu klein zum Messen |
| 2.1 | Herd (3 Sicherungen) | L1 + L2 + L3 | | Drehstrom; Platten einzeln testen |
| 2.2 | Herd (3 Sicherungen) | L1 + L2 + L3 | | Drehstrom; Platten einzeln testen |
| 2.2 | Kochplatte (25.10. 20 Uhr) | L3 | 25.10.2026 | ca. 4,5 kW auf L3 |
| 2.3 | Spülmaschine | L3 ? | 25.10.2026 | ca. 2 kW auf L3, bestätigen nach Programmende |
| 2.4 | Garage | L1 ? | 25.10.2026 | Tesla lädt einphasig 8 A ≈ 1,9 kW auf L1 |
| 2.5 | Heizung, Heizkreisverteiler | | | |
| 2.6 | Waschmaschine | | | in der Heizphase messen |
| 2.7 | Trockner | | | |
| – | Balkonkraftwerk (Garage) | | | Einspeisung mittags: Phase mit sinkendem Wert |

`?` = Hinweis aus dem Verlauf, noch nicht gezielt getestet.

## Auswertung

Ziel: große Dauerlasten (Tesla, Spülmaschine, Trockner, Waschmaschine, Herd-Platten) möglichst
auf verschiedene Phasen verteilen. Eine Phase sollte dauerhaft deutlich unter 16 A bleiben.
