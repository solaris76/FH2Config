#!/usr/bin/env python3
import base64
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = Path("/tmp/fh2_official.html")
VENDOR = ROOT / "vendor" / "fh2_config_tool_official.html"
OUT = ROOT / "fh2_config_tool.html"

CHROME = r'''<body>
<div class="app">
  <header class="studio-header">
    <div class="brand">
      <a href="https://www.expert-sleepers.co.uk/" title="Expert Sleepers">
        <img src="assets/expert-sleepers-logo.svg" alt="Expert Sleepers">
      </a>
      <div class="brand-copy">
        <strong>FH-2 Configuration</strong>
        <span>Firmware 2.0+</span>
      </div>
    </div>
    <div class="header-fields">
      <div>
        <div class="field-label"><label for="config_name">Configuration name</label></div>
        <input id="config_name" accesskey="n" type="text">
      </div>
      <div>
        <div class="field-label"><label for="midiinput">MIDI input</label></div>
        <select id="midiinput" onchange="changeInput()" accesskey="i"></select>
      </div>
      <div>
        <div class="field-label"><label for="midioutput">MIDI output</label></div>
        <select id="midioutput" onchange="changeOutput()" accesskey="o"></select>
      </div>
    </div>
    <div class="header-meta">
      <details class="header-menu">
        <summary class="btn btn-ghost">Help</summary>
        <div class="menu">
          <a href="https://www.expert-sleepers.co.uk/downloads/manuals/fh2_user_manual_2.0.pdf" target="_blank" rel="noopener">FH-2 user manual (PDF)</a>
          <a href="https://www.expert-sleepers.co.uk/fh2firmware.html" target="_blank" rel="noopener">Firmware &amp; other manuals</a>
        </div>
      </details>
    </div>
    <div class="header-row-actions">
      <span class="midi-pill" id="midi-pill"><span class="dot"></span><span id="status">starting…</span></span>
      <button type="button" class="btn btn-ghost" accesskey="u" onclick="request()" title="Load the current configuration from the FH-2 hardware.">Get FH-2 settings</button>
      <button type="button" class="btn btn-primary" accesskey="s" onclick="send()">Send to FH-2</button>
      <button type="button" class="btn btn-ghost" id="btn-load-config" title="Load a configuration from a .syx file.">Load File</button>
      <button type="button" class="btn btn-ghost" id="btn-save-config" title="Download this configuration as a .syx file.">Save to File</button>
      <label class="field-label" for="theme">Theme</label>
      <select id="theme" onchange="changeTheme()">
        <option value="0">Light</option>
        <option value="1">Dark</option>
            <option value="v1">v1</option>
            <option value="v2">v2</option>
      </select>
      <input type="file" id="chooseConfig" name="files[]" accept=".syx,application/octet-stream" hidden>
      <a id="saveConfig" download="config.syx" hidden></a>
    </div>
  </header>

  <div class="studio-layout">
    <nav class="studio-nav" aria-label="Configuration sections">
      <div class="nav-label">Sections</div>
      <div class="nav-btns">
        <button type="button" data-section="outputs" class="is-on">Outputs <span class="count">0</span></button>
        <button type="button" data-section="mcv">MIDI/CV <span class="count">0</span></button>
        <button type="button" data-section="env">Envelopes <span class="count"></span></button>
        <button type="button" data-section="arp">Arpeggiators <span class="count"></span></button>
        <button type="button" data-section="clocks">Clocks <span class="count">0</span></button>
        <button type="button" data-section="triggers">Triggers <span class="count">0</span></button>
        <button type="button" data-section="euc">Euclidean <span class="count">0</span></button>
        <button type="button" data-section="seq">Sequencers <span class="count"></span></button>
        <button type="button" data-section="srr">SR Random <span class="count">0</span></button>
        <button type="button" data-section="inputs">Inputs X/Y <span class="count">0</span></button>
        <button type="button" data-section="hid">HID <span class="count">0</span></button>
        <button type="button" data-section="globals">Globals <span class="count"></span></button>
      </div>
    </nav>

    <div class="studio-main">
      <section class="occupancy" aria-labelledby="occupancy-title">
        <div class="occupancy-head">
          <h2 id="occupancy-title">Output occupancy</h2>
          <div class="occupancy-bank">
            <label for="output-bank">Device / expander</label>
            <select id="output-bank" title="Choose the FH-2 main module or an FHX-8CV expander.">
              <optgroup label="Main module">
                <option value="0">FH-2 (main module)</option>
              </optgroup>
              <optgroup label="FHX-8CV expanders">
                <option value="1">FHX-8CV 1 (expander)</option>
                <option value="2">FHX-8CV 2 (expander)</option>
                <option value="3">FHX-8CV 3 (expander)</option>
                <option value="4">FHX-8CV 4 (expander)</option>
                <option value="5">FHX-8CV 5 (expander)</option>
                <option value="6">FHX-8CV 6 (expander)</option>
                <option value="7">FHX-8CV 7 (expander)</option>
              </optgroup>
            </select>
          </div>
          <span id="occupancy-caption">Main module · jacks 1–8</span>
        </div>
        <div class="occupancy-scroll">
          <div class="occupancy-grid">
            <button type="button" class="jack" id="jack-0"></button>
            <button type="button" class="jack" id="jack-1"></button>
            <button type="button" class="jack" id="jack-2"></button>
            <button type="button" class="jack" id="jack-3"></button>
            <button type="button" class="jack" id="jack-4"></button>
            <button type="button" class="jack" id="jack-5"></button>
            <button type="button" class="jack" id="jack-6"></button>
            <button type="button" class="jack" id="jack-7"></button>
            <button type="button" class="jack is-input" id="jack-X"></button>
            <button type="button" class="jack is-input" id="jack-Y"></button>
          </div>
        </div>
      </section>
      <div id="section-intro" class="section-intro"></div>
      <div id="bank-row" class="bank-row" hidden>Scroll sideways in the table for LFO, reset, and gate-level columns.</div>
      <div class="legacy-toggles">
'''

TOGGLES_TAIL = r'''
      </div>
      <div id="config-main">
'''

AFTER_TABLES = r'''
      </div>
      <details class="sysex-log">
        <summary>SysEx log</summary>
        <div class="log-grid">
          <div><label for="log">Event log</label><textarea rows=5 id="log" class="log" readOnly title="Log" accesskey="l"></textarea></div>
          <div><label for="txSysex">Transmitted SysEx</label><textarea rows=5 name="text" id="txSysex" title="Transmitted SysEx"></textarea></div>
          <div><label for="rxSysex">Received SysEx</label><textarea rows=5 name="text" id="rxSysex" title="Received SysEx"></textarea></div>
        </div>
        <div class="sysex-extras">
          <button type="button" onclick="sendMsg()">Send Msg</button>
          <button type="button" onclick="reqVersion()" accesskey="v">Request FH-2 Version</button>
        </div>
      </details>
    </div>

    <aside class="studio-help" aria-labelledby="help-title">
      <div class="sticky">
        <h2 id="help-title">Field help</h2>
        <div class="help-card" id="help-card">
          <div class="help-kicker">Selected field</div>
          <h3>Output occupancy</h3>
          <p>Each jack lists every generator assigned to it. Two or more sources are highlighted because their voltages are summed.</p>
        </div>
        <div class="warn-card" id="help-warn" hidden></div>
        <p class="help-hint">Select a control to see its description from the FH-2 manual. Use Device / expander above to inspect the FH-2 main module (jacks 1–8) or an FHX-8CV expander.</p>
        <div class="manuals">
          <img src="assets/expert-sleepers-logo.svg" alt="Expert Sleepers">
          <div class="kicker">Manuals</div>
          <a href="https://www.expert-sleepers.co.uk/downloads/manuals/fh2_user_manual_2.0.pdf" target="_blank" rel="noopener">FH-2 user manual (PDF)</a>
          <a href="https://www.expert-sleepers.co.uk/fh2firmware.html" target="_blank" rel="noopener">Firmware &amp; other manuals</a>
        </div>
        <p class="note-chrome">Web MIDI requires <a href="http://www.google.com/chrome/">Chrome</a> or <a href="https://www.opera.com">Opera</a>. If SysEx is blocked from a website, open this file locally.</p>
      </div>
    </aside>
  </div>
</div>
'''

CHANGE_THEME = '''function changeTheme() {
	var sel = document.getElementById( "theme" );
	if ( !sel ) return;
	var v = sel.value;
	if ( v === "v1" ) {
		window.location.href = "original/fh2_config_tool.html";
		return;
	}
	if ( v === "v2" ) {
		try {
			sel.value = ( localStorage.getItem( themeKey ) == 0 || localStorage.getItem( themeKey ) == "0" ) ? "0" : "1";
		} catch ( e ) {
			sel.value = "1";
		}
		return;
	}
	document.documentElement.setAttribute( "data-theme", v == 1 ? "dark" : "light" );
	try { localStorage.setItem( themeKey, v ); } catch ( e ) {}
}
'''

ORIGINAL_THEME_SELECT = (
    '<select id="theme" onchange="changeTheme()">'
    '<option value=0>Light</option>'
    '<option value=1>Dark</option>'
    '<option value="v1">v1</option>'
    '<option value="v2">v2</option>'
    '</select>'
)

ORIGINAL_UI_SWITCH = '''
<script>
(function () {
	var apply = window.changeTheme;
	window.changeTheme = function () {
		var sel = document.getElementById( "theme" );
		if ( !sel ) return;
		var v = sel.value;
		if ( v === "v2" ) {
			window.location.href = "../fh2_config_tool.html";
			return;
		}
		if ( v === "v1" ) {
			try {
				sel.value = ( localStorage.getItem( "fh2Theme" ) == 1 || localStorage.getItem( "fh2Theme" ) == "1" ) ? "1" : "0";
			} catch ( e ) {
				sel.value = "0";
			}
			return;
		}
		apply();
	};
})();
</script>
'''

STATUS_FN = '''function status( t ) {
	var node = document.getElementById( "status" );
	if ( node ) node.textContent = t;
	var pill = document.getElementById( "midi-pill" );
	if ( pill ) {
		var ok = String( t ).toUpperCase() === "OK";
		pill.classList.toggle( "is-ok", ok );
		pill.classList.toggle( "is-bad", !ok );
	}
}
'''


def replace_between(src: str, start: str, end: str, new: str) -> str:
    i = src.find(start)
    j = src.find(end, i)
    if i < 0 or j < 0:
        raise SystemExit(f"Could not find block starting {start!r}")
    return src[:i] + new + src[j:]


def logo_data_uri() -> str:
    raw = (ROOT / "assets" / "expert-sleepers-logo.svg").read_bytes()
    return "data:image/svg+xml;base64," + base64.b64encode(raw).decode("ascii")


def inline_studio(html: str) -> str:
    css = (ROOT / "fh2-studio.css").read_text(encoding="utf-8")
    js = (ROOT / "fh2-studio.js").read_text(encoding="utf-8").replace("</script>", "<\\/script>")
    html = html.replace(
        '<link rel="stylesheet" href="fh2-studio.css">',
        "<style>\n" + css + "\n</style>",
        1,
    )
    html = html.replace(
        '<script src="fh2-studio.js"></script>',
        "<script>\n" + js + "\n</script>",
        1,
    )
    html = html.replace("assets/expert-sleepers-logo.svg", logo_data_uri())
    return html


def write_dist(out: Path, orig_path: Path) -> None:
    dist = ROOT / "dist" / "fh2-configuration-tool-studio"
    if dist.exists():
        shutil.rmtree(dist)
    dist.mkdir(parents=True)
    shutil.copy2(out, dist / "fh2_config_tool.html")
    (dist / "original").mkdir()
    shutil.copy2(orig_path, dist / "original" / "fh2_config_tool.html")
    shutil.copy2(ROOT / "PACKAGING.txt", dist / "README.txt")

    zip_path = ROOT / "fh2-configuration-tool-studio.zip"
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in dist.rglob("*"):
            if path.name == ".DS_Store" or not path.is_file():
                continue
            zf.write(path, path.relative_to(dist.parent))
    print(f"Wrote {dist}")
    print(f"Wrote {zip_path}")


def main() -> None:
    if not SRC.exists() and not VENDOR.exists():
        raise SystemExit("Official HTML not found")
    raw = SRC.read_text(encoding="utf-8", errors="replace") if SRC.exists() else VENDOR.read_text(encoding="utf-8")
    VENDOR.parent.mkdir(exist_ok=True)
    VENDOR.write_text(raw, encoding="utf-8")
    html = raw

    html = html.replace(
        "<head>",
        """<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
""",
        1,
    )
    html = html.replace(
        "</head>",
        '<link rel="stylesheet" href="fh2-studio.css">\n</head>',
        1,
    )

    html = replace_between(html, "function changeTheme() {", "function log( t ) {", CHANGE_THEME)
    html = replace_between(html, "function status( t ) {", "function nybbleChar( n ) {", STATUS_FN)

    start = html.find("<body>")
    end = html.find('<table id="glb_table">')
    if start < 0 or end < 0:
        raise SystemExit("Could not find body chrome")
    toggles_start = html.find("<label class = 'hidden' for='glb_lbl'>")
    toggles = html[toggles_start:end]
    html = html[:start] + CHROME + toggles + TOGGLES_TAIL + html[end:]

    marker = 'showHide( "cvm_table", false );\n</script>'
    idx = html.find(marker)
    if idx < 0:
        raise SystemExit("Could not find post-table showHide script")
    insert_at = idx + len(marker)
    html = html[:insert_at] + AFTER_TABLES + html[insert_at:]

    html = html.replace(
        """const themeKey = 'fh2Theme';
if ( localStorage.getItem( themeKey ) ) {
	if ( localStorage.getItem( themeKey ) == 1 ) {
		document.getElementById( "theme" ).value = 1;
		changeTheme();
	}
}""",
        """const themeKey = 'fh2Theme';
if ( localStorage.getItem( themeKey ) == 0 || localStorage.getItem( themeKey ) == '0' ) {
	document.getElementById( "theme" ).value = 0;
	changeTheme();
} else {
	document.getElementById( "theme" ).value = 1;
	changeTheme();
}""",
    )

    html = html.replace("</body>", '<script src="fh2-studio.js"></script>\n</body>', 1)
    html = inline_studio(html)

    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")

    orig = raw.replace(
        '<select id="theme" onchange="changeTheme()"><option value=0>Light</option><option value=1>Dark</option></select>',
        ORIGINAL_THEME_SELECT,
        1,
    )
    orig = orig.replace("</body>", ORIGINAL_UI_SWITCH + "\n</body>", 1)
    orig_dir = ROOT / "original"
    orig_dir.mkdir(exist_ok=True)
    orig_path = orig_dir / "fh2_config_tool.html"
    orig_path.write_text(orig, encoding="utf-8")
    print(f"Wrote {orig_path}")
    write_dist(OUT, orig_path)


if __name__ == "__main__":
    main()
