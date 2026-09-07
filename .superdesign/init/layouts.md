# Layouts — FH-2 Configuration Tool

No shared layout components, nav, sidebar, or app shell. The “layout” is the top of `FH-2 Configuration Tool.html` (approx. lines 1344–1424): a linear document header of small text, buttons, selects, file boxes, log textareas, then a wrap of section-visibility checkboxes.

Chrome markup (trimmed of the 7-expander `document.write` explosion):

```html
<body>
<div class="small">
At the time of writing this will work only in Google's <a href="http://www.google.com/chrome/">Chrome</a> browser or in the <a href="https://www.opera.com/">Opera</a> browser. Chrome may block SysEx access if you run this from a website, in which case download the html file locally and run it from there.
</div>
<div class="small" id="status">Web MIDI status: OK</div>
<div class="small">
This version is for FH-2 firmware v2.0 and above.
<label for="theme">Theme: </label><select id="theme" onchange="changeTheme()"><option value="0">Light</option><option value="1">Dark</option></select>
</div>
<p>
<button class="big" accesskey="s" onclick="send()">Send to FH-2</button>
<label for="midioutput">Send to MIDI output port: </label><select id="midioutput" onchange="changeOutput()"></select>
<button onclick="sendMsg()">Send Msg</button>
<br>
<button class="big" accesskey="u" onclick="request()">Upload from FH-2</button>
<label for="midiinput">Listen on MIDI input port: </label><select id="midiinput" onchange="changeInput()"></select>
<button onclick="reqVersion()" accesskey="v">Request FH-2 Version</button>
</p>
<div id="upload" class="upload">
<label for="chooseConfig">Choose config to load:</label><input type="file" id="chooseConfig" name="files[]" single="">
<button onclick="loadConfig()">Load</button>
</div>
<div id="download" class="upload">
<button onclick="prepareSaveConfig()">Generate config to save</button>
<a id="saveConfig" download="config.syx">Click to Save Config</a>
</div>
<p>
<textarea rows="5" cols="50" id="log" class="log" readonly="" title="Log"></textarea>
<textarea rows="5" cols="48" id="txSysex" title="Transmitted SysEx"></textarea>
<textarea rows="5" cols="48" id="rxSysex" title="Received SysEx"></textarea>
</p>
<p>
<label for="config_name">Configuration name:</label><input id="config_name" type="text">
</p>
<p>
<input id="glb_lbl" type="checkbox">Show Globals
<input type="checkbox" id="conv_lbl" checked>Show MIDI/CV Converters
<input type="checkbox" id="env_lbl">Show Portamento/Transpose/Envelopes
<input type="checkbox" id="arp_lbl">Show Arpeggiators
<input type="checkbox" id="clock_lbl">Show Clocks
<input type="checkbox" id="trig_lbl">Show Triggers
<input type="checkbox" id="euc_lbl">Show Euclidean Patterns
<input type="checkbox" id="sq_lbl">Show Sequencers
<br>
<input id="showfh2outputs" type="checkbox" checked>Show FH-2 Output Configurator
| Show FHX-8CV Expander Output Configurator: 1 2 3 4 5 6 7
<input type="checkbox" id="hid_lbl">Show Gamepad
<input type="checkbox" id="kbd_lbl">Show HID Keyboard
<input type="checkbox" id="cvm_lbl">Show CV/MIDI
<input type="checkbox" id="srr_lbl">Show SR Random
</p>
```

There is no header bar, no footer, no sidebar. After this block, feature tables stack in document order.
