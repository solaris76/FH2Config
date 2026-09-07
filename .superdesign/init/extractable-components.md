# Extractable components — FH-2 Configuration Tool

No reusable layout or design-system components. The app is one saved HTML file that builds UI with `document.write` into nested tables. Skip Superdesign `create-component` extraction.

## Layout Components

None. No NavBar, Sidebar, Header, Footer, or App Shell.

## Basic Components (inline patterns only — do not extract)

These repeat as `document.write` helpers, not components:

- `writeChannelSelector` — CV output 1–8 plus expander `e/n` labels
- `writeGateChannelSelector` — same plus `GTe/n` FHX-8GT outputs
- `writeMIDIChannelSelector` — MIDI ch 1–16, optional `--`
- `writeMIDICCSelector` — CC 0–127 plus optional Relative checkbox
- `showHide(id, show)` — checkbox section visibility
- `button.big` — Send / Upload
- `div.upload` — dotted file load/save box
- zebra `tr.a` / `tr.b` table rows
