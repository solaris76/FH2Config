# FH-2 Configuration Tool — Design System

## Product context

Expert Sleepers **FH-2** Eurorack MIDI-to-CV configuration tool (firmware v2.0+). Browser Web MIDI SysEx editor for *configurations* (routing + MIDI mappings), not live *presets*. Official manual: https://www.expert-sleepers.co.uk/downloads/manuals/fh2_user_manual_2.0.pdf

### Job to be done

Map MIDI onto FH-2 outputs 1–8 (and expanders) without guessing. Every control needs a short manual-backed explanation. When more than one source feeds a jack, that collision must be obvious.

### Key concepts (from the manual)

- **Configuration** = what outputs do and how MIDI CCs map. **Preset** = live levels/LFO rates (this tool does not edit presets).
- Signal flow: generators (MIDI/CV, clocks, triggers, Euclidean, Direct) → LFOs/envelopes added → smoothing.
- 16 MIDI/CV converters. 384 mappings max.
- Outputs 1–8 = FH-2; expander CV shown as `1/1`–`7/8`; gates as `GT0/1`–`GT3/16`.
- Stacking multiple functions on one output is allowed and currently invisible — occupancy is a first-class UI object.

## Visual language (overhaul)

Dark hardware-studio editor. Dense, not a marketing landing page. No serif display fonts, no gradients, no glassmorphism, no purple neon.

### Color

| Role | Value |
| --- | --- |
| page | `#101418` |
| surface | `#181e23` |
| surface-2 | `#21282e` |
| border | `#2c353c` |
| text | `#e7ecef` |
| text-muted | `#8b969d` |
| accent (MIDI / focus) | `#d4a017` |
| CV | `#3db8c4` |
| gate | `#62b86b` |
| occupancy warning | `#e07a3d` |
| danger / stacked ≥3 | `#d4524a` |
| button primary fill | `#d4a017` |
| button primary text | `#101418` |
| button secondary | transparent, border `#2c353c`, text `#e7ecef` |

### Typography

- UI: **IBM Plex Sans**, 13px body, 11px labels, 12px controls
- Mono: **IBM Plex Mono**, 11px SysEx / CC numbers
- Section titles: 15px semibold
- No other font families

### Spacing / radius / shadow

- 4 / 8 / 12 / 16 / 24
- Radius 6px on cards and inputs, 4px on chips
- One shadow only: `0 8px 24px rgba(0,0,0,0.35)` on the help drawer / popover
- 1px borders, no heavy outlines

### Components

- **App chrome**: sticky top bar — product name, config name field, MIDI in/out, Send / Upload, Manual link (opens PDF), MIDI status pill
- **Section nav**: vertical list (Outputs, MIDI/CV, Clocks, Triggers, Euclidean, Sequencers, Globals, HID…) with a count of enabled items
- **Help**: `?` next to every field group; hover tooltip (1 sentence) + selected-field description panel quoting the manual
- **Output occupancy**: each jack is a card. Empty = muted. One source = colored chip (CV / Gate / Clock / Direct / LFO). Two+ sources = stacked chips + numeric badge + orange/red border. Click jack to see full assignment list
- **Mapping cell**: Channel + CC + Relative as one labeled control, not two cryptic `--` selects
- **Primary actions**: Send to FH-2 (gold), Upload (ghost)

## Must keep

All real configuration controls exist in the product. Redesign hierarchy and guidance; do not invent a marketing homepage; do not drop MIDI ports, SysEx log (collapsible is OK), or output range / mapping fields.
