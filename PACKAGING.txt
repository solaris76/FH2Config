FH-2 Configuration Tool — studio UI (firmware 2.0+)
=====================================================

This is a usability shell around the official Expert Sleepers FH-2 Web MIDI
configuration tool. All original control IDs and SysEx send/receive paths are
unchanged.

Open fh2_config_tool.html in Chrome or Opera (Web MIDI + SysEx required). If the browser
blocks SysEx from a hosted page, open the file locally.

What this adds
--------------
- Section navigation (one config area at a time)
- Output occupancy for the FH-2 and FHX-8CV expanders, plus inputs X/Y
- Field help drawn from the FH-2 user manual
- Horizontal scrolling for wide mapping tables
- Per-row Reset, and Reset all on each relevant section
- Euclidean Reset sets Output / Off output to None

Original (legacy) UI
--------------------
Theme menu → v1 or v2
  packaged copy: original/fh2_config_tool.html

Files
-----
fh2_config_tool.html               New studio UI (open this)
fh2-studio.css / fh2-studio.js     Studio chrome only
assets/expert-sleepers-logo.svg    Expert Sleepers wordmark
original/fh2_config_tool.html      Official tool, plus Theme v1/v2 switch

Manual
------
https://www.expert-sleepers.co.uk/downloads/manuals/fh2_user_manual_2.0.pdf
