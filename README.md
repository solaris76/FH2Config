# FH-2 Configuration Tool

A usability shell around the official [Expert Sleepers FH-2](https://www.expert-sleepers.co.uk/) Web MIDI configuration editor (firmware 2.0+). Original control IDs and SysEx send/receive paths are unchanged.

Official source: [fh2_config_tool.html](https://expert-sleepers.co.uk/webapps/fh2_config_tool.html)

## Open it

Open **`fh2_config_tool.html`** in Chrome or Opera. Web MIDI and SysEx are required.

That file is self-contained (studio CSS, JS, and logo are inlined). If the browser blocks SysEx from a hosted page, open it locally.

Edit the split source files (`fh2-studio.css`, `fh2-studio.js`, `assets/`) then rebuild:

```
python3 build_studio.py
```

## What this adds

- Section navigation (one config area at a time)
- Output occupancy for the FH-2 and FHX-8CV expanders, plus inputs X/Y
- Field help drawn from the [FH-2 user manual](https://www.expert-sleepers.co.uk/downloads/manuals/fh2_user_manual_2.0.pdf)
- Horizontal scrolling for wide mapping tables
- Per-row Reset, and Reset all on each relevant section (except Globals)
- Euclidean Reset sets Output / Off output to None

## Theme

Use the Theme menu for Light, Dark, **v1**, or **v2**.

- **v2** is this studio UI (`fh2_config_tool.html`)
- **v1** is the official layout (`original/fh2_config_tool.html`)

## Files

| File | Role |
| --- | --- |
| `fh2_config_tool.html` | Studio UI (self-contained; open this) |
| `fh2-studio.css` / `fh2-studio.js` | Studio chrome source (inlined by the build) |
| `assets/expert-sleepers-logo.svg` | Wordmark source (inlined by the build) |
| `original/fh2_config_tool.html` | Official tool, plus Theme v1/v2 switch |
| `vendor/fh2_config_tool_official.html` | Unmodified official HTML |
| `build_studio.py` | Wraps the official HTML and inlines studio assets |
| `dist/fh2-configuration-tool-studio/` | Packaged drop: studio HTML + original v1 |
| `fh2-configuration-tool-studio.zip` | Same package as a zip |

## Manual

[FH-2 user manual (PDF)](https://www.expert-sleepers.co.uk/downloads/manuals/fh2_user_manual_2.0.pdf)
