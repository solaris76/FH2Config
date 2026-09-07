(function () {
  "use strict";

  var SECTIONS = {
    outputs: {
      title: "FH-2 output configurator",
      intro: "Each output can receive a generator such as MIDI/CV, clock, trigger, Euclidean pattern, or Direct control. LFO and envelope signals are then added before smoothing is applied, so assigning several sources to one jack stacks their voltages.",
      tables: ["outs0_table"],
      checks: ["showfh2outputs"]
    },
    mcv: {
      title: "MIDI/CV converters",
      intro: "Up to 16 converters turn incoming MIDI notes into CV, gates, triggers, velocity, aftertouch, and related outputs. Enable a converter, choose its type, then set the base output and which per-voice signals it occupies.",
      tables: ["mcv_table"],
      checks: ["conv_lbl"]
    },
    env: {
      title: "Portamento, transpose, envelopes",
      intro: "These controls sit on top of the MIDI/CV converters: portamento, per-converter transpose, and envelope shapes that can be routed as extra outputs.",
      tables: ["env_table"],
      checks: ["env_lbl"]
    },
    arp: {
      title: "Arpeggiators",
      intro: "Each arpeggiator is driven by a MIDI/CV converter. Map MIDI CCs to rate, gate, octaves and similar parameters here.",
      tables: ["arp_table"],
      checks: ["arp_lbl"]
    },
    clocks: {
      title: "Clocks",
      intro: "Clock outputs generate tempo-related gates and run/stop signals. A clock only occupies a jack when its type is set to something other than --.",
      tables: ["clk_table"],
      checks: ["clock_lbl"]
    },
    triggers: {
      title: "Triggers / gates",
      intro: "Triggers fire from MIDI notes. Like clocks, they only occupy an output once a type is selected.",
      tables: ["trg_table"],
      checks: ["trig_lbl"]
    },
    euc: {
      title: "Euclidean patterns",
      intro: "Sixteen Euclidean rhythm generators. Output and Off output choose the jacks that receive pulses and the inverted off-beats.",
      tables: ["euc_table"],
      checks: ["euc_lbl"]
    },
    seq: {
      title: "Sequencers",
      intro: "Note and drum sequencers output MIDI internally or to USB/DIN. They do not directly seize CV jacks unless you route that MIDI back through a converter.",
      tables: ["seq_table", "seqm_table"],
      checks: ["sq_lbl"]
    },
    srr: {
      title: "Shift register random",
      intro: "Turing-machine style random CV, change gates, and triggers. Each row can occupy up to three jacks.",
      tables: ["srr_table"],
      checks: ["srr_lbl"]
    },
    inputs: {
      title: "Inputs X & Y (CV/MIDI)",
      intro: "The X and Y jacks are inputs, not outputs. Enabling CV/MIDI on an input generates MIDI from incoming CV and disables that jack as a clock input.",
      tables: ["cvm_table"],
      checks: ["cvm_lbl"]
    },
    hid: {
      title: "HID gamepad & keyboard",
      intro: "Map gamepad axes/buttons and HID keys onto FH-2 outputs. A row only occupies a jack when a usage or key is selected.",
      tables: ["hid_table", "kbd_table"],
      checks: ["hid_lbl", "kbd_lbl"]
    },
    globals: {
      title: "Globals",
      intro: "Machine-wide settings: transpose, trigger length, external clock, tap tempo, start/stop, swing, and display behaviour.",
      tables: ["glb_table", "glb_table2"],
      checks: ["glb_lbl"]
    }
  };

  var ALL_TABLES = ["glb_table", "glb_table2", "mcv_table", "env_table", "arp_table", "clk_table", "trg_table", "euc_table", "srr_table", "seq_table", "seqm_table", "hid_table", "kbd_table", "cvm_table", "outs0_table", "outs1_table", "outs2_table", "outs3_table", "outs4_table", "outs5_table", "outs6_table", "outs7_table"];

  var HELP = {
    "output-bank": ["Device / expander", "The FH-2 is the main module (jacks 1–8). FHX-8CV units are expanders (jacks n/1–n/8). Occupancy and the output mapping table follow whichever you select."],
    midiinput: ["MIDI input", "Port used when getting the current configuration from the FH-2 (SysEx dump)."],
    midioutput: ["MIDI output", "Port used when sending this configuration to the FH-2 over SysEx."],
    "btn-load-config": ["Load File", "Opens a .syx file from disk and applies it in the editor. This does not send it to the FH-2 until you click Send to FH-2."],
    "btn-save-config": ["Save to File", "Downloads the current editor state as a .syx file. Same format as the original tool."],
    rng_: ["Output range", "Sets the voltage range for this output: 0–10V, ±5V, 0–1V, 0–5V, or 0–8V."],
    out_DC_: ["Direct control", "Maps a MIDI channel and CC directly to this output's voltage. Combined with any MIDI/CV, clock, trigger, envelope, or LFO already assigned to the same jack."],
    out_LFO_: ["LFO speed", "Maps MIDI to the free-running LFO rate for this output."],
    out_CLK_: ["LFO base", "Selects the tempo base used when the LFO is synchronized."],
    out_CLKM_: ["LFO multiplier", "Multiplies or divides the tempo-based LFO rate."],
    out_MLT_: ["LFO level", "Maps MIDI to LFO output level."],
    out_SIN_: ["LFO sine", "Maps MIDI to the sine component of this output's LFO."],
    out_SQR_: ["LFO square", "Maps MIDI to the square component of this output's LFO."],
    out_PW_: ["LFO pulse width", "Maps MIDI to pulse-width of the square component."],
    out_TRI_: ["LFO triangle", "Maps MIDI to the triangle component."],
    out_SAW_: ["LFO saw", "Maps MIDI to the saw component."],
    out_RND_: ["LFO random", "Maps MIDI to the random component."],
    out_NSE_: ["LFO noise", "Maps MIDI to the noise component."],
    out_PHS_: ["LFO phase", "Offsets LFO phase."],
    out_FAD_: ["LFO fade", "Maps MIDI to LFO fade time."],
    out_SMO_: ["Smoothing", "Applies smoothing after generators and LFO signals are combined on this output."],
    lfotrig_: ["LFO reset", "Controls how and when the LFO resets: off, CC, note, clock, Euclidean, or from a MIDI/CV converter."],
    out_gt_: ["Gate levels", "Numeric codes for the low and high voltages used when this output acts as a gate."],
    mcv_enable_: ["Enable converter", "Turns this MIDI/CV converter on. Disabled converters occupy no outputs."],
    mcv_ch_: ["MIDI channel", "Channel the converter listens on. For MPE this is the master channel."],
    mcv_min_: ["Note range (min)", "Lowest MIDI note number this converter will respond to."],
    mcv_max_: ["Note range (max)", "Highest MIDI note number this converter will respond to."],
    mcv_type_: ["Converter type", "Mono, polyphonic, or MPE. Poly and MPE spread per-voice outputs using Voices and Stride."],
    mcv_base_: ["Base output", "The first jack this converter uses. Enabled per-voice signals occupy consecutive jacks from here: if CV and Gate are on and base is 3, CV is on 3 and Gate is on 4."],
    mcv_basegate_: ["Base gate", "Optional FHX-8GT gate output for this converter."],
    mcv_VC_: ["CV (pitch)", "Per-voice pitch CV. Occupies the base output jack first."],
    mcv_VG_: ["Gate", "Per-voice gate. Occupies the next jack after CV (so base 3 with CV+Gate puts Gate on 4)."],
    mcv_VVG_: ["Velocity gate", "Per-voice gate whose level follows velocity."],
    mcv_VV_: ["Velocity", "Per-voice velocity CV. On or inverted."],
    mcv_VR_: ["Release velocity", "Per-voice release-velocity CV."],
    mcv_VT_: ["Trigger", "Per-voice trigger pulse on note-on."],
    mcv_VE_: ["Envelope", "Per-voice envelope CV from the envelope section."],
    mcv_VP_: ["MPE aftertouch", "Per-voice channel pressure (MPE)."],
    mcv_VRND_: ["Random", "Per-voice random CV."],
    mcv_VY_: ["MPE Y", "Per-voice CC used as the MPE Y axis. -- disables it."],
    mcv_G_: ["Paraphonic gate", "One shared gate for all voices, placed after the per-voice outputs."],
    mcv_A_: ["Paraphonic aftertouch", "One shared aftertouch CV after the per-voice outputs."],
    mcv_PB_: ["Pitch bend output", "Optional extra jack(s) for pitch bend (single or double)."],
    mcv_stride_: ["Stride", "Spacing between per-voice output sets. With CV+gate and base 1, stride 2 gives 1/2, 3/4; stride 3 gives 1/2, 4/5, 7/8."],
    mcv_voices_: ["Voices", "How many polyphonic voices this converter allocates (poly/MPE)."],
    mcv_scheme_: ["Voice allocation", "How new notes choose a voice: round robin, lowest, unison, note range, alternating, or random."],
    clk_: ["Clock", "A clock occupies its chosen output only when Type is not --. Types include clock, run/stop, and start/stop triggers."],
    trg_: ["Trigger", "A trigger occupies its chosen output only when Type is not --."],
    euc_output_: ["Euclidean output", "Jack that receives Euclidean pulses for this pattern."],
    euc_offoutput_: ["Euclidean off output", "Jack that receives the inverted (off-beat) pattern."],
    srr_output_: ["Random CV", "Shift-register random CV jack."],
    srr_change_: ["Random change", "Gate that fires when the random value changes."],
    srr_trigger_: ["Random trigger", "Trigger output from this random generator."],
    cvm_en_: ["Enable CV/MIDI", "When enabled, this input converts CV to MIDI and can no longer be used as a clock input."],
    cvm_type_: ["CV/MIDI type", "CC, trigger, note, program change, or aftertouch generated from the incoming CV."],
    cvm_ch_: ["CV/MIDI channel", "MIDI channel for messages generated from this input."],
    cvm_cc_: ["CC or note", "Controller number or base note associated with this conversion."],
    cvm_0v_: ["0V level", "Input code that corresponds to 0V. Start around 0 and calibrate with Test inputs if needed."],
    cvm_5v_: ["5V level", "Input code that corresponds to 5V. A typical starting point is 4096."],
    cvm_out: ["MIDI destination", "Where generated MIDI is sent: Internal (into the FH-2 converters), USB A, USB C, DIN, or Select Bus."],
    hid_: ["HID mapping", "Gamepad axis or button mapped onto an output. Occupies a jack only when Usage is not --."],
    kbd_: ["HID keyboard", "Key press mapped onto an output."],
    glb_: ["Global setting", "Applies to the whole FH-2, not a single converter or jack."],
    "btn-clear": ["Reset row", "Resets this row to the tool's starting defaults. Euclidean Output/Off output and SR Random CV are set to None."]
  };

  var currentSection = "outputs";
  var occupancyPaused = false;
  var selectedOccupancy = null;
  var jackSources = [];
  var allJackSources = [];
  var inputSources = { X: [], Y: [] };

  function currentBank() {
    var bank = el("output-bank");
    var b = bank ? Number(bank.value) : 0;
    return isNaN(b) ? 0 : b;
  }

  function jackNum(globalIndex) {
    if (globalIndex < 8) return String(globalIndex + 1);
    return Math.floor(globalIndex / 8) + "/" + ((globalIndex % 8) + 1);
  }

  function jackLabel(globalIndex) {
    if (globalIndex < 8) return "OUT " + (globalIndex + 1);
    return Math.floor(globalIndex / 8) + "/" + ((globalIndex % 8) + 1);
  }

  function bankTitle(bank) {
    return bank === 0 ? "FH-2 (main module)" : ("FHX-8CV expander " + bank);
  }

  function bankOptionLabel(bank) {
    return bank === 0 ? "FH-2 (main module)" : ("FHX-8CV " + bank + " (expander)");
  }

  function el(id) { return document.getElementById(id); }
  function val(id) {
    var n = el(id);
    return n ? n.value : "";
  }
  function isChecked(id) {
    var n = el(id);
    return !!(n && n.checked);
  }
  function num(id) {
    var v = val(id);
    if (v === "" || v == null) return NaN;
    return Number(v);
  }

  function rowControls(tr) {
    var list = [];
    var table = tr.parentElement && tr.parentElement.closest ? tr.closest("table") : null;
    [].forEach.call(tr.children, function (cell) {
      [].forEach.call(cell.querySelectorAll("input, select, textarea"), function (node) {
        if (node.type === "button" || node.classList.contains("btn-clear")) return;
        if (table && node.closest("table") !== table) return;
        list.push(node);
      });
    });
    return list;
  }

  function snapshotRow(tr) {
    return rowControls(tr).map(function (node) {
      return {
        el: node,
        value: node.value,
        checked: !!node.checked,
        display: node.style.display
      };
    });
  }

  function restoreRow(tr, opts) {
    opts = opts || {};
    var snap = tr._fh2Defaults;
    if (!snap) return;
    snap.forEach(function (s) {
      if (!s.el) return;
      if (s.el.type === "checkbox" || s.el.type === "radio") s.el.checked = s.checked;
      else s.el.value = s.value;
      s.el.style.display = s.display;
    });
    snap.forEach(function (s) {
      if (!s.el) return;
      if (typeof s.el.onchange === "function") {
        try { s.el.onchange(); } catch (err) {}
      } else {
        s.el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    forceOutputsNone(tr);
    if (!opts.silent) refreshOccupancy();
  }

  function forceOutputsNone(tr) {
    var eucOut = tr.querySelector("[id^='euc_output_']");
    var eucOff = tr.querySelector("[id^='euc_offoutput_']");
    if (eucOut) eucOut.value = "-1";
    if (eucOff) eucOff.value = "-1";
    var srrCv = tr.querySelector("[id^='srr_output_']");
    if (srrCv) srrCv.value = "-1";
  }

  function resetAllConfirmMessage() {
    if (currentSection === "outputs") {
      return "This will reset all settings on this page for every output on the current device. Are you sure?";
    }
    if (currentSection === "mcv") {
      return "This will reset all MIDI/CV converters on this page. Are you sure?";
    }
    if (currentSection === "euc") {
      return "This will reset every Euclidean pattern on this page and set Output / Off output to None. Are you sure?";
    }
    if (currentSection === "srr") {
      return "This will reset every SR Random generator on this page and set CV to None. Are you sure?";
    }
    if (currentSection === "clocks") {
      return "This will reset all clocks on this page. Are you sure?";
    }
    if (currentSection === "triggers") {
      return "This will reset all triggers on this page. Are you sure?";
    }
    return "This will reset all settings on this page. Are you sure?";
  }

  function resetAllVisibleRows() {
    if (currentSection === "globals") return;
    if (!window.confirm(resetAllConfirmMessage())) return;
    occupancyPaused = true;
    sectionTables(currentSection).forEach(function (id) {
      var table = el(id);
      if (!table) return;
      [].forEach.call(table.querySelectorAll("tr"), function (tr) {
        if (tr._fh2Defaults) restoreRow(tr, { silent: true });
      });
    });
    occupancyPaused = false;
    refreshOccupancy();
    var resetHelp = "Every row on this page is back to its starting defaults.";
    if (currentSection === "euc") resetHelp = "Every Euclidean pattern now has Output and Off output set to None, so they occupy no jacks.";
    else if (currentSection === "srr") resetHelp = "Every SR Random generator now has CV set to None, so they occupy no jacks.";
    setHelp("Reset all", resetHelp);
  }

  function sectionTables(name) {
    if (name === "outputs") return ["outs" + currentBank() + "_table"];
    var spec = SECTIONS[name];
    return spec ? spec.tables.slice() : [];
  }

  function ensureResetAll() {
    if (el("reset-all")) return;
    var intro = el("section-intro");
    if (!intro) return;
    var bar = document.createElement("div");
    bar.id = "section-actions";
    bar.className = "section-actions";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "reset-all";
    btn.className = "btn-clear-all";
    btn.textContent = "Reset all";
    btn.title = "Reset every row on this page to defaults";
    btn.addEventListener("click", resetAllVisibleRows);
    bar.appendChild(btn);
    intro.insertAdjacentElement("afterend", bar);
  }

  function addClearButtons() {
    var skip = { glb_table: true, glb_table2: true };
    document.querySelectorAll("#config-main .config-scroll > table").forEach(function (table) {
      if (skip[table.id]) return;
      var rows = table.querySelectorAll(":scope > tbody > tr, :scope > tr");
      [].forEach.call(rows, function (tr) {
        var controls = rowControls(tr);
        if (!controls.length) return;
        if (tr.querySelector(".btn-clear")) return;
        tr._fh2Defaults = snapshotRow(tr);
        var cell = tr.children[0];
        if (!cell) return;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-clear";
        btn.textContent = "Reset";
        btn.title = "Reset this row to defaults";
        btn.setAttribute("aria-label", "Reset row");
        btn.addEventListener("click", function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          restoreRow(tr);
          var rowHelp = "This row is back to its starting defaults. Other rows are unchanged.";
          if (tr.querySelector("[id^='euc_output_']")) rowHelp = "This Euclidean pattern's Output and Off output are None. Other rows are unchanged.";
          else if (tr.querySelector("[id^='srr_output_']")) rowHelp = "This SR Random generator's CV is None. Other rows are unchanged.";
          setHelp("Reset row", rowHelp);
        });
        cell.appendChild(btn);
      });
    });
  }

  function wrapTables() {
    var main = el("config-main");
    if (!main) return;
    var tables = [].slice.call(main.querySelectorAll(":scope > table"));
    tables.forEach(function (table) {
      if (table.parentElement.classList.contains("config-scroll")) return;
      var wrap = document.createElement("div");
      wrap.className = "config-scroll";
      wrap.dataset.table = table.id || "";
      main.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function showHideTable(id, show) {
    var table = el(id);
    if (!table) return;
    table.style.display = show ? "table" : "none";
    var wrap = table.closest(".config-scroll");
    if (wrap) wrap.style.display = show ? "block" : "none";
  }

  window.showHide = function (id, show) {
    showHideTable(id, show);
  };

  function showSection(name, opts) {
    opts = opts || {};
    var spec = SECTIONS[name];
    if (!spec) return;
    currentSection = name;

    ALL_TABLES.forEach(function (id) { showHideTable(id, false); });

    Object.keys(SECTIONS).forEach(function (key) {
      SECTIONS[key].checks.forEach(function (cid) {
        var cb = el(cid);
        if (cb) cb.checked = key === name;
      });
    });

    for (var i = 1; i < 8; i++) {
      var exp = el("show8cvoutputs" + i);
      if (exp) exp.checked = false;
      showHideTable("outs" + i + "_table", false);
    }

    var tables = spec.tables.slice();
    if (name === "outputs") {
      var bank = el("output-bank");
      var b = bank ? Number(bank.value) : 0;
      tables = ["outs" + b + "_table"];
      if (b === 0) {
        var fh2 = el("showfh2outputs");
        if (fh2) fh2.checked = true;
      } else {
        var ex = el("show8cvoutputs" + b);
        if (ex) ex.checked = true;
      }
    }

    tables.forEach(function (id) { showHideTable(id, true); });
    spec.checks.forEach(function (cid) {
      var cb = el(cid);
      if (cb) cb.checked = true;
    });

    document.querySelectorAll(".studio-nav button[data-section]").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-section") === name);
    });

    var intro = el("section-intro");
    if (intro) {
      var title = spec.title;
      if (name === "outputs") title = bankTitle(currentBank()) + " output configurator";
      intro.innerHTML = "<h1>" + title + "</h1><p>" + spec.intro + "</p>";
    }
    var bankRow = el("bank-row");
    if (bankRow) bankRow.hidden = name !== "outputs";
    var actions = el("section-actions");
    if (actions) actions.hidden = name === "globals";
    renderJacks();

    if (!opts.keepHelp) {
      selectedOccupancy = null;
      document.querySelectorAll(".jack").forEach(function (j) {
        j.classList.remove("is-on", "is-related");
      });
      clearRowHighlight();
      setHelp(name === "outputs" ? (bankTitle(currentBank()) + " outputs") : spec.title, spec.intro);
    } else {
      applyOccupancyHighlight();
    }
    if (!opts.keepHelp && !opts.noScroll) {
      var occ = document.querySelector(".occupancy");
      if (occ) occ.scrollIntoView({ block: "start" });
    }
  }

  function chipClass(kind) {
    if (kind === "cv" || kind === "pitch") return "chip-cv";
    if (kind === "gate" || kind === "trig") return "chip-gate";
    if (kind === "clock") return "chip-clock";
    if (kind === "lfo") return "chip-lfo";
    if (kind === "direct") return "chip-direct";
    if (kind === "euc") return "chip-euc";
    if (kind === "srr") return "chip-srr";
    if (kind === "hid") return "chip-hid";
    if (kind === "in") return "chip-in";
    return "";
  }

  function addOut(map, output, source) {
    var n = Number(output);
    if (isNaN(n) || n < 0 || n > 63) return;
    if (!map[n]) map[n] = [];
    map[n].push(source);
  }

  function mappingOn(prefix, index) {
    var ch = el(prefix + "_ch_" + index);
    if (!ch) return false;
    var v = Number(ch.value);
    return !isNaN(v) && v > 0;
  }

  var NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  function noteName(n) {
    n = Number(n);
    if (isNaN(n) || n < 0 || n > 127) return "";
    return NOTE_NAMES[n % 12] + (Math.floor(n / 12) - 1);
  }

  function midiJoin(parts) {
    return parts.filter(Boolean).join(" · ");
  }

  function midiChannelText(id) {
    var ch = num(id);
    if (isNaN(ch) || ch < 1) return "";
    return "ch" + ch;
  }

  function mappingMidi(prefix, index) {
    if (!mappingOn(prefix, index)) return "";
    var cc = num(prefix + "_cc_" + index);
    var bits = [midiChannelText(prefix + "_ch_" + index)];
    if (!isNaN(cc) && cc >= 0) bits.push("CC" + cc);
    return midiJoin(bits);
  }

  function firstMappingMidi(prefixes, index) {
    for (var i = 0; i < prefixes.length; i++) {
      var text = mappingMidi(prefixes[i], index);
      if (text) return text;
    }
    return "";
  }

  function mcvMidi(m) {
    var min = num("mcv_min_" + m);
    var max = num("mcv_max_" + m);
    var range = "";
    if (!isNaN(min) && !isNaN(max) && !(min === 0 && max === 127)) {
      range = min === max ? noteName(min) : (noteName(min) + "–" + noteName(max));
    }
    return midiJoin([midiChannelText("mcv_ch_" + m), range]);
  }

  function source(kind, label, midi, meta) {
    meta = meta || {};
    return {
      kind: kind,
      label: label,
      midi: midi || "",
      key: meta.key || "",
      rowId: meta.rowId || "",
      section: meta.section || "",
      base: meta.base,
      role: meta.role || ""
    };
  }

  function unique(list) {
    var out = [];
    list.forEach(function (item) {
      if (item && out.indexOf(item) < 0) out.push(item);
    });
    return out;
  }

  function keysOnJack(globalIndex) {
    return unique((allJackSources[globalIndex] || []).map(function (s) { return s.key; }));
  }

  function jackHasKey(globalIndex, keys) {
    if (!keys || !keys.length) return false;
    var list = allJackSources[globalIndex] || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].key && keys.indexOf(list[i].key) >= 0) return true;
    }
    return false;
  }

  function relatedJackIndexes(keys) {
    var out = [];
    if (!keys || !keys.length) return out;
    for (var i = 0; i < 64; i++) {
      if (jackHasKey(i, keys)) out.push(i);
    }
    return out;
  }

  function primarySection(src) {
    var rank = { mcv: 1, clocks: 2, triggers: 3, euc: 4, srr: 5, hid: 6, outputs: 9, inputs: 10 };
    var best = "outputs";
    var bestRank = 99;
    (src || []).forEach(function (s) {
      var r = rank[s.section] || 99;
      if (r < bestRank) {
        bestRank = r;
        best = s.section;
      }
    });
    return best;
  }

  function scanMcv(map) {
    for (var m = 1; m <= 16; m++) {
      if (!isChecked("mcv_enable_" + m)) continue;
      var base = num("mcv_base_" + m);
      if (isNaN(base)) continue;
      var type = val("mcv_type_" + m);
      var voices = type === "0" ? 1 : (num("mcv_voices_" + m) || 1);
      var stride = num("mcv_stride_" + m) || 1;
      var midi = midiJoin([mcvMidi(m), "base " + jackNum(base)]);
      var meta = { key: "mcv:" + m, rowId: "mcv_enable_" + m, section: "mcv", base: base };
      var per = [];
      if (isChecked("mcv_VC_" + m)) per.push({ kind: "cv", label: "CV " + m, role: "CV" });
      if (isChecked("mcv_VG_" + m)) per.push({ kind: "gate", label: "Gate " + m, role: "Gate" });
      if (isChecked("mcv_VVG_" + m)) per.push({ kind: "gate", label: "VelGate " + m, role: "VelGate" });
      if (num("mcv_VV_" + m) > 0) per.push({ kind: "cv", label: "Vel " + m, role: "Vel" });
      if (num("mcv_VR_" + m) > 0) per.push({ kind: "cv", label: "RelVel " + m, role: "RelVel" });
      if (isChecked("mcv_VT_" + m)) per.push({ kind: "trig", label: "Trig " + m, role: "Trig" });
      if (isChecked("mcv_VE_" + m)) per.push({ kind: "cv", label: "Env " + m, role: "Env" });
      if (isChecked("mcv_VP_" + m)) per.push({ kind: "cv", label: "Press " + m, role: "Press" });
      if (isChecked("mcv_VRND_" + m)) per.push({ kind: "cv", label: "Rnd " + m, role: "Rnd" });
      if (num("mcv_VY_" + m) > 0) per.push({ kind: "cv", label: "MPE Y " + m, role: "MPE Y" });

      var step = type === "0" ? Math.max(per.length, 1) : stride;
      for (var v = 0; v < voices; v++) {
        var start = base + v * step;
        for (var i = 0; i < per.length; i++) {
          addOut(map, start + i, source(per[i].kind, per[i].label + (voices > 1 ? " v" + (v + 1) : ""), midi, {
            key: meta.key, rowId: meta.rowId, section: meta.section, base: base, role: per[i].role
          }));
        }
      }
      var after = base + voices * step;
      if (isChecked("mcv_G_" + m)) addOut(map, after++, source("gate", "Para gate " + m, midi, { key: meta.key, rowId: meta.rowId, section: "mcv", base: base, role: "Para gate" }));
      if (isChecked("mcv_A_" + m)) addOut(map, after++, source("cv", "Para AT " + m, midi, { key: meta.key, rowId: meta.rowId, section: "mcv", base: base, role: "Para AT" }));
      var pb = num("mcv_PB_" + m);
      if (pb >= 1) addOut(map, after++, source("cv", "Bend " + m, midi, { key: meta.key, rowId: meta.rowId, section: "mcv", base: base, role: "Bend" }));
      if (pb >= 2) addOut(map, after++, source("cv", "Bend2 " + m, midi, { key: meta.key, rowId: meta.rowId, section: "mcv", base: base, role: "Bend2" }));
    }
  }

  function refreshOccupancy() {
    var map = [];
    for (var i = 0; i < 64; i++) map[i] = [];
    scanMcv(map);

    for (var c = 1; c <= 32; c++) {
      if (num("clk_" + c + "_type") > 0) {
        addOut(map, num("clk_" + c + "_output"), source("clock", "Clock " + c, "", {
          key: "clk:" + c, rowId: "clk_" + c + "_output", section: "clocks"
        }));
      }
    }
    for (var t = 1; t <= 64; t++) {
      if (num("trg_" + t + "_type") > 0) {
        var note = num("trg_" + t + "_note");
        addOut(map, num("trg_" + t + "_output"), source("trig", "Trig " + t, midiJoin([
          midiChannelText("trg_" + t + "_ch"),
          (isNaN(note) || note < 0) ? "any" : noteName(note)
        ]), { key: "trg:" + t, rowId: "trg_" + t + "_output", section: "triggers" }));
      }
    }
    for (var e = 1; e <= 16; e++) {
      var eucMeta = { key: "euc:" + e, rowId: "euc_output_" + e, section: "euc" };
      addOut(map, num("euc_output_" + e), source("euc", "Euc " + e, "", eucMeta));
      addOut(map, num("euc_offoutput_" + e), source("euc", "Euc " + e + " off", "", eucMeta));
    }
    for (var s = 1; s <= 16; s++) {
      var srrMidi = midiChannelText("srr_nch_" + s);
      var srrMeta = { key: "srr:" + s, rowId: "srr_output_" + s, section: "srr" };
      addOut(map, num("srr_output_" + s), source("srr", "SRR CV " + s, srrMidi, srrMeta));
      addOut(map, num("srr_change_" + s), source("srr", "SRR Δ " + s, srrMidi, srrMeta));
      addOut(map, num("srr_trigger_" + s), source("srr", "SRR trig " + s, srrMidi, srrMeta));
    }
    var lfoMaps = ["out_LFO", "out_MLT", "out_SIN", "out_SQR", "out_TRI", "out_SAW", "out_RND", "out_NSE"];
    for (var o = 0; o < 64; o++) {
      if (mappingOn("out_DC", o)) {
        addOut(map, o, source("direct", "Direct", mappingMidi("out_DC", o), {
          key: "direct:" + o, rowId: "out_DC_ch_" + o, section: "outputs"
        }));
      }
      var lfoMidi = firstMappingMidi(lfoMaps, o);
      if (lfoMidi) {
        addOut(map, o, source("lfo", "LFO", lfoMidi, {
          key: "lfo:" + o, rowId: "out_LFO_ch_" + o, section: "outputs"
        }));
      }
    }
    for (var h = 1; h <= 32; h++) {
      if (num("hid_" + h + "_usage") > 0) {
        addOut(map, num("hid_" + h + "_output"), source("hid", "HID " + h, "", {
          key: "hid:" + h, rowId: "hid_" + h + "_usage", section: "hid"
        }));
      }
    }
    for (var k = 1; k <= 32; k++) {
      var keyEl = el("kbd_" + k + "_key");
      if (keyEl && keyEl.value && num("kbd_" + k + "_type") > 0) {
        addOut(map, num("kbd_" + k + "_output"), source("hid", "Key " + k, "", {
          key: "kbd:" + k, rowId: "kbd_" + k + "_key", section: "hid"
        }));
      }
    }

    allJackSources = map;
    renderJacks();
    renderInputs();
    updateNavCounts();
    markBusyBanks();
  }

  window.refreshOccupancy = refreshOccupancy;

  function sourceLabel(s) {
    return s.midi ? (s.label + " (" + s.midi + ")") : s.label;
  }

  function chipHtml(s) {
    var html = "<span class='chip " + chipClass(s.kind) + "'><span class='chip-name'>" + s.label + "</span>";
    if (s.midi) html += "<span class='chip-midi'>" + s.midi + "</span>";
    html += "</span>";
    return html;
  }

  function renderJacks() {
    var bank = currentBank();
    var base = bank * 8;
    jackSources = [];
    var cap = el("occupancy-caption");
    if (cap) {
      cap.textContent = bank === 0
        ? "Main module · jacks 1–8"
        : ("Expander " + bank + " · jacks " + bank + "/1–" + bank + "/8");
    }
    for (var i = 0; i < 8; i++) {
      var btn = el("jack-" + i);
      if (!btn) continue;
      var globalIndex = base + i;
      var src = (allJackSources[globalIndex] || []).slice();
      jackSources[i] = src;
      btn.dataset.output = String(globalIndex);
      var keys = selectedOccupancy && selectedOccupancy.keys ? selectedOccupancy.keys : [];
      var isOn = !!(selectedOccupancy && selectedOccupancy.type === "out" && selectedOccupancy.slot === i);
      var isRelated = !isOn && jackHasKey(globalIndex, keys);
      btn.classList.toggle("is-stack", src.length === 2);
      btn.classList.toggle("is-triple", src.length >= 3);
      btn.classList.toggle("is-on", isOn);
      btn.classList.toggle("is-related", isRelated);
      var html = "<span class='jack-id'>" + jackLabel(globalIndex) + "</span>";
      if (src.length >= 2) html += "<span class='badge'>" + src.length + "</span>";
      if (!src.length) {
        html += "<span class='empty'>Empty</span>";
      } else {
        html += "<span class='chips'>";
        src.forEach(function (s) {
          html += chipHtml(s);
        });
        html += "</span>";
      }
      btn.innerHTML = html;
    }
  }

  function markBusyBanks() {
    var bank = el("output-bank");
    if (!bank) return;
    for (var b = 0; b < 8; b++) {
      var opt = bank.options[b];
      if (!opt) continue;
      var used = 0;
      var stacked = 0;
      for (var i = 0; i < 8; i++) {
        var n = (allJackSources[b * 8 + i] || []).length;
        if (n) used++;
        if (n >= 2) stacked++;
      }
      var baseLabel = bankOptionLabel(b);
      if (stacked) opt.text = baseLabel + " · " + stacked + " stacked";
      else if (used) opt.text = baseLabel + " · " + used + " used";
      else opt.text = baseLabel;
    }
  }

  function renderInputs() {
    inputSources = { X: [], Y: [] };
    ["X", "Y"].forEach(function (name, i) {
      var btn = el("jack-" + name);
      if (!btn) return;
      var src = [];
      if (isChecked("cvm_en_" + i)) {
        var typeEl = el("cvm_type_" + i);
        var typeName = typeEl && typeEl.options[typeEl.selectedIndex] ? typeEl.options[typeEl.selectedIndex].text : "CV/MIDI";
        var type = num("cvm_type_" + i);
        var cc = num("cvm_cc_" + i);
        var spec = "";
        if (type === 0 && cc >= 0) spec = "CC" + cc;
        else if ((type === 1 || type === 2) && cc >= 0) spec = noteName(cc);
        else if (type === 3) spec = "PC";
        else if (type === 4) spec = "AT";
        src.push(source("in", typeName, midiJoin([midiChannelText("cvm_ch_" + i), spec])));
      }
      inputSources[name] = src;
      var html = "<span class='jack-id'>IN " + name + "</span>";
      if (!src.length) html += "<span class='empty'>Input</span>";
      else {
        html += "<span class='chips'>";
        src.forEach(function (s) {
          html += chipHtml(s);
        });
        html += "</span>";
      }
      btn.classList.toggle("is-on", !!(selectedOccupancy && selectedOccupancy.type === "in" && selectedOccupancy.name === name));
      btn.innerHTML = html;
    });
  }

  function updateNavCounts() {
    function setCount(section, n) {
      var btn = document.querySelector('.studio-nav button[data-section="' + section + '"] .count');
      if (btn) btn.textContent = n;
    }
    var mcv = 0;
    for (var m = 1; m <= 16; m++) if (isChecked("mcv_enable_" + m)) mcv++;
    setCount("mcv", mcv);
    var clk = 0;
    for (var c = 1; c <= 32; c++) if (num("clk_" + c + "_type") > 0) clk++;
    setCount("clocks", clk);
    var trg = 0;
    for (var t = 1; t <= 64; t++) if (num("trg_" + t + "_type") > 0) trg++;
    setCount("triggers", trg);
    var euc = 0;
    for (var e = 1; e <= 16; e++) if (num("euc_output_" + e) >= 0) euc++;
    setCount("euc", euc);
    var srr = 0;
    for (var s = 1; s <= 16; s++) if (num("srr_output_" + s) >= 0) srr++;
    setCount("srr", srr);
    var ins = (isChecked("cvm_en_0") ? 1 : 0) + (isChecked("cvm_en_1") ? 1 : 0);
    setCount("inputs", ins);
    var hid = 0;
    for (var h = 1; h <= 32; h++) if (num("hid_" + h + "_usage") > 0) hid++;
    setCount("hid", hid);
    var used = 0;
    (allJackSources || []).forEach(function (list) { if (list && list.length) used++; });
    setCount("outputs", used);
  }

  function helpForId(id) {
    if (!id) return null;
    if (HELP[id]) return HELP[id];
    var keys = Object.keys(HELP).sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < keys.length; i++) {
      if (id.indexOf(keys[i]) === 0) return HELP[keys[i]];
    }
    var lab = document.querySelector("label[for='" + id + "']");
    if (lab && lab.textContent) return [lab.textContent, "This control is part of the FH-2 configuration sent over SysEx. Use the Manual PDF for the full parameter list."];
    return null;
  }

  function setHelp(title, body, warning) {
    var card = el("help-card");
    if (!card) return;
    card.innerHTML = "<div class='help-kicker'>Selected field</div><h3></h3><p></p>";
    card.querySelector("h3").textContent = title;
    card.querySelector("p").textContent = body;
    var warn = el("help-warn");
    if (!warn) return;
    if (warning) {
      warn.hidden = false;
      warn.innerHTML = warning;
    } else {
      warn.hidden = true;
      warn.innerHTML = "";
    }
  }

  function rowOf(id) {
    var n = el(id);
    return n ? n.closest("tr") : null;
  }

  function clearRowHighlight() {
    document.querySelectorAll("#config-main tr.is-lit").forEach(function (tr) {
      tr.classList.remove("is-lit");
    });
    document.querySelectorAll("#config-main .is-lit-field").forEach(function (n) {
      n.classList.remove("is-lit-field");
    });
    document.querySelectorAll("#config-main td.is-lit-cell").forEach(function (n) {
      n.classList.remove("is-lit-cell");
    });
  }

  function footprintNote(keys, currentIndex) {
    var mcvKeys = (keys || []).filter(function (k) { return k.indexOf("mcv:") === 0; });
    var bits = [];
    mcvKeys.forEach(function (key) {
      var items = [];
      var base = null;
      for (var i = 0; i < 64; i++) {
        (allJackSources[i] || []).forEach(function (s) {
          if (s.key !== key) return;
          items.push({ index: i, role: s.role || s.label });
          if (s.base != null) base = s.base;
        });
      }
      if (!items.length) return;
      var layout = items.map(function (it) {
        return it.role + " on " + jackLabel(it.index) + (it.index === currentIndex ? " (this jack)" : "");
      }).join(", ");
      bits.push("Base output " + jackNum(base) + ": " + layout + ".");
    });
    var other = (keys || []).filter(function (k) { return k.indexOf("mcv:") !== 0; });
    return (bits.length ? " " + bits.join(" ") : "") + (other.length ? spanNote(other, currentIndex) : "");
  }

  function applyOccupancyHighlight() {
    clearRowHighlight();
    if (!selectedOccupancy) return;
    var keys = selectedOccupancy.keys || [];
    var rows = [];
    if (selectedOccupancy.type === "in") {
      rows.push(rowOf("cvm_en_" + (selectedOccupancy.name === "Y" ? 1 : 0)));
    } else if (keys.length) {
      keys.forEach(function (key) {
        for (var i = 0; i < 64; i++) {
          (allJackSources[i] || []).forEach(function (s) {
            if (s.key === key && s.rowId) rows.push(rowOf(s.rowId));
          });
        }
      });
    } else if (selectedOccupancy.type === "out") {
      var gi = currentBank() * 8 + selectedOccupancy.slot;
      rows.push(rowOf("rng_" + (gi + 1)));
    }
    var firstVisible = null;
    var seen = [];
    rows.forEach(function (tr) {
      if (!tr || seen.indexOf(tr) >= 0) return;
      seen.push(tr);
      tr.classList.add("is-lit");
      if (!firstVisible && tr.offsetParent !== null) firstVisible = tr;
    });
    keys.forEach(function (key) {
      if (key.indexOf("mcv:") !== 0) return;
      var baseEl = el("mcv_base_" + key.split(":")[1]);
      if (!baseEl) return;
      baseEl.classList.add("is-lit-field");
      var cell = baseEl.closest("td");
      if (cell) cell.classList.add("is-lit-cell");
    });
    if (firstVisible) firstVisible.scrollIntoView({ block: "nearest", inline: "nearest" });
    renderJacks();
    renderInputs();
  }

  function spanNote(keys, currentIndex) {
    var related = relatedJackIndexes(keys);
    if (related.length < 2) return "";
    var labels = related.filter(function (n) { return n !== currentIndex; }).map(jackLabel);
    if (!labels.length) return "";
    return " Same source also occupies " + labels.join(", ") + ".";
  }

  function showJackHelp(slot) {
    var globalIndex = currentBank() * 8 + slot;
    var src = (allJackSources[globalIndex] || []).slice();
    var keys = keysOnJack(globalIndex);
    selectedOccupancy = { type: "out", slot: slot, keys: keys };
    var title = jackLabel(globalIndex);
    var body;
    var warning = "";
    var extra = footprintNote(keys, globalIndex);
    if (!src.length) body = "Nothing is assigned to this jack yet.";
    else if (src.length === 1) body = "Assigned: " + sourceLabel(src[0]) + "." + extra;
    else {
      body = src.length + " sources are summed on this jack: " + src.map(sourceLabel).join(", ") + "." + extra;
      warning = "<h3>" + title + " has " + src.length + " sources</h3><p>These sources are summed. Confirm this is intentional before sending the configuration.</p>";
    }
    setHelp(title, body, warning);
    applyOccupancyHighlight();
  }

  function showInputHelp(name) {
    selectedOccupancy = { type: "in", name: name, keys: [] };
    var src = inputSources[name] || [];
    var title = "Input " + name;
    var body = src.length
      ? ("CV/MIDI is enabled as " + sourceLabel(src[0]) + ". This jack is no longer available as a clock input.")
      : "This jack is an input. Enable CV/MIDI to generate MIDI from incoming CV, or leave it free for clock duties.";
    setHelp(title, body);
    applyOccupancyHighlight();
  }

  function metaFromRow(tr) {
    if (!tr) return null;
    var node;
    node = tr.querySelector("[id^='mcv_enable_']");
    if (node) return { keys: ["mcv:" + node.id.replace("mcv_enable_", "")], section: "mcv" };
    node = tr.querySelector("[id^='clk_'][id$='_output']");
    if (node) {
      var clk = node.id.match(/^clk_(\d+)_output$/);
      if (clk) return { keys: ["clk:" + clk[1]], section: "clocks" };
    }
    node = tr.querySelector("[id^='trg_'][id$='_output']");
    if (node) {
      var trg = node.id.match(/^trg_(\d+)_output$/);
      if (trg) return { keys: ["trg:" + trg[1]], section: "triggers" };
    }
    node = tr.querySelector("[id^='euc_output_']");
    if (node) return { keys: ["euc:" + node.id.replace("euc_output_", "")], section: "euc" };
    node = tr.querySelector("[id^='srr_output_']");
    if (node) return { keys: ["srr:" + node.id.replace("srr_output_", "")], section: "srr" };
    node = tr.querySelector("[id^='hid_'][id$='_usage']");
    if (node) {
      var hid = node.id.match(/^hid_(\d+)_usage$/);
      if (hid) return { keys: ["hid:" + hid[1]], section: "hid" };
    }
    node = tr.querySelector("[id^='kbd_'][id$='_key']");
    if (node) {
      var kbd = node.id.match(/^kbd_(\d+)_key$/);
      if (kbd) return { keys: ["kbd:" + kbd[1]], section: "hid" };
    }
    node = tr.querySelector("[id^='cvm_en_']");
    if (node) {
      return { type: "in", name: node.id === "cvm_en_1" ? "Y" : "X", keys: [] };
    }
    node = tr.querySelector("[id^='rng_']");
    if (node) {
      var gi = Number(node.id.replace("rng_", "")) - 1;
      if (isNaN(gi) || gi < 0) return null;
      return {
        type: "out",
        slot: gi % 8,
        keys: keysOnJack(gi)
      };
    }
    return null;
  }

  function selectFromControl(id) {
    var node = el(id);
    if (!node || node.classList.contains("btn-clear")) return;
    var tr = node.closest("#config-main tr");
    var meta = metaFromRow(tr);
    if (!meta) return;
    if (meta.type === "in") selectedOccupancy = { type: "in", name: meta.name, keys: [] };
    else if (meta.type === "out") selectedOccupancy = { type: "out", slot: meta.slot, keys: meta.keys || [] };
    else selectedOccupancy = { type: "source", keys: meta.keys || [] };
    applyOccupancyHighlight();
  }

  function patchParse() {
    if (typeof window.parseConfigDump !== "function") return;
    var orig = window.parseConfigDump;
    window.parseConfigDump = function (data) {
      orig(data);
      refreshOccupancy();
    };
  }

  function pinHeaderHeight() {
    var header = document.querySelector(".studio-header");
    if (!header) return;
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  function init() {
    wrapTables();
    addClearButtons();
    ensureResetAll();
    patchParse();
    pinHeaderHeight();
    window.addEventListener("resize", pinHeaderHeight);

    var theme = el("theme");
    if (theme && typeof window.changeTheme === "function") {
      if (localStorage.getItem("fh2Theme") !== "0") {
        theme.value = 1;
        window.changeTheme();
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
    pinHeaderHeight();
    if (theme) theme.addEventListener("change", function () { pinHeaderHeight(); });

    document.querySelectorAll(".studio-nav button[data-section]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showSection(btn.getAttribute("data-section"));
      });
    });
    Object.keys(SECTIONS).forEach(function (name) {
      SECTIONS[name].checks.forEach(function (cid) {
        var cb = el(cid);
        if (!cb) return;
        cb.addEventListener("click", function () {
          if (cb.checked) showSection(name);
        });
      });
    });

    for (var exp = 1; exp < 8; exp++) {
      (function (n) {
        var cb = el("show8cvoutputs" + n);
        if (!cb) return;
        cb.addEventListener("click", function () {
          if (!cb.checked) return;
          var sel = el("output-bank");
          if (sel) sel.value = String(n);
          showSection("outputs");
        });
      })(exp);
    }

    var bank = el("output-bank");
    if (bank) {
      bank.addEventListener("change", function () {
        if (currentSection === "outputs") showSection("outputs", { keepHelp: !!selectedOccupancy });
        else renderJacks();
        applyOccupancyHighlight();
      });
    }

    for (var i = 0; i < 8; i++) {
      (function (idx) {
        var btn = el("jack-" + idx);
        if (btn) btn.addEventListener("click", function () {
          showJackHelp(idx);
          var src = allJackSources[currentBank() * 8 + idx] || [];
          showSection(primarySection(src), { keepHelp: true });
        });
      })(i);
    }
    ["X", "Y"].forEach(function (name) {
      var btn = el("jack-" + name);
      if (btn) btn.addEventListener("click", function () {
        showInputHelp(name);
        showSection("inputs", { keepHelp: true });
      });
    });

    document.addEventListener("change", function () {
      if (occupancyPaused) return;
      refreshOccupancy();
    });
    document.addEventListener("focusin", function (ev) {
      var t = ev.target;
      if (!t || !t.id) return;
      if (t.id === "theme" || t.id === "output-bank") return;
      selectFromControl(t.id);
      var info = helpForId(t.id);
      if (info) setHelp(info[0], info[1]);
    });

    wireConfigFiles();
    showSection("outputs", { noScroll: true });
    refreshOccupancy();
  }

  function wireConfigFiles() {
    var loadBtn = el("btn-load-config");
    var saveBtn = el("btn-save-config");
    var file = el("chooseConfig");
    if (loadBtn && file) {
      loadBtn.addEventListener("click", function () {
        if (typeof chosenConfig !== "undefined") chosenConfig = [];
        file.value = "";
        file.click();
      });
      file.addEventListener("change", function () {
        var n = 0;
        var t = setInterval(function () {
          n++;
          if (typeof chosenConfig !== "undefined" && chosenConfig.length >= 7) {
            clearInterval(t);
            if (typeof window.loadConfig === "function") window.loadConfig();
            refreshOccupancy();
          }
          if (n > 80) clearInterval(t);
        }, 40);
      });
    }
    if (saveBtn && typeof window.prepareSaveConfig === "function") {
      saveBtn.addEventListener("click", function () {
        window.prepareSaveConfig();
        var a = el("saveConfig");
        if (a && a.href) {
          a.click();
          a.style.display = "none";
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
