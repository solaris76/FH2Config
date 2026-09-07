# Pages — FH-2 Configuration Tool

## / (Configuration Tool)

Entry: `FH-2 Configuration Tool.html`

Single file. No local component imports. Google Font CSS in `FH-2 Configuration Tool_files/css` and `FH-2 Configuration Tool_files/css(1)`.

Dependencies:

- `FH-2 Configuration Tool.html` (inline CSS, inline JS, document.write tables)
  - `FH-2 Configuration Tool_files/css` (PT Sans)
  - `FH-2 Configuration Tool_files/css(1)` (PT Mono)

### Rendered sections (top to bottom)

1. **Chrome / warning** — Chrome/Opera + SysEx note; Web MIDI status; firmware v2.0; Light/Dark theme select
2. **MIDI actions** — Send to FH-2, MIDI output port, Send Msg; Upload from FH-2, MIDI input port, Request FH-2 Version
3. **File I/O** — dotted boxes: Choose config to load / Load; Generate config to save / Click to Save Config
4. **Debug** — three textareas: log, transmitted SysEx, received SysEx
5. **Config name**
6. **Section toggles** (checkboxes): Globals, MIDI/CV Converters (on), Portamento/Transpose/Envelopes, Arpeggiators, Clocks, Triggers, Euclidean Patterns, Sequencers, FH-2 Output Configurator (on), FHX-8CV expanders 1–7, Gamepad, HID Keyboard, CV/MIDI, SR Random
7. **Tables** (ids): `glb_table`, `glb_table2`, `mcv_table`, `env_table`, `arp_table`, `clk_table`, `trg_table`, `euc_table`, `srr_table`, `seq_table`, `seqm_table`, `outs0_table`…`outs7_table`, `hid_table`, `kbd_table`, `cvm_table`

Default visible: MIDI/CV converters + FH-2 output configurator. Everything else `display:none` until checked.
