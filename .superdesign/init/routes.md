# Routes — FH-2 Configuration Tool

Single-page local HTML app. No router, no SPA routes.

| URL path | File | Layout | Summary |
| --- | --- | --- | --- |
| `/` (open the HTML file) | `FH-2 Configuration Tool.html` | none (document body) | Expert Sleepers FH-2 firmware v2.0 Web MIDI configuration editor. One long page: MIDI I/O chrome, SysEx log, configuration name, show/hide checkboxes, then stacked tables for every subsystem. |

Original hosted URL (comment in source): `https://expert-sleepers.co.uk/webapps/fh2_config_tool.html`

No `router` config. Visibility of sections is toggled with `showHide(id, checked)` driven by checkboxes.
