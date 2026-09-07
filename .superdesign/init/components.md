# Components — FH-2 Configuration Tool

No component library. Shared UI is inline helpers in `FH-2 Configuration Tool.html` that `document.write` `<select>` controls.

## writeChannelSelector

- File: `FH-2 Configuration Tool.html`
- Description: CV output picker — FH-2 1–8 then expander `e/n` (1/1–7/8)
- Props: `id`, `includeNone=true`

```javascript
function writeChannelSelector( id, includeNone=true ) {
	document.write( "<select id='" + id + "'>" );
	if ( includeNone ) {
		document.write( "<option value='-1'>None</option>" );
	}
	var j;
	for ( j = 0; j < 8; ++j ) {
		document.write( "<option value='"+j+"'>" + (j+1) + "</option>" );
	}
	var e;
	for ( e = 1; e < 8; ++e ) {
		for ( j = 0; j < 8; ++j ) {
			document.write( "<option value='"+(e*8+j)+"'>" + e + "/" + (j+1) + "</option>" );
		}
	}
	document.write( "</select>" );
}
```

## writeGateChannelSelector

- File: `FH-2 Configuration Tool.html`
- Description: Same as channel selector plus FHX-8GT `GTe/n` outputs 65–128

```javascript
function writeGateChannelSelector( id, includeNone=true ) {
	document.write( "<select id='" + id + "'>" );
	if ( includeNone ) {
		document.write( "<option value='-1'>None</option>" );
	}
	for ( j = 0; j < 8; ++j ) {
		document.write( "<option value='"+j+"'>" + (j+1) + "</option>" );
	}
	var e;
	for ( e = 1; e < 8; ++e ) {
		for ( j = 0; j < 8; ++j ) {
			document.write( "<option value='"+(e*8+j)+"'>" + e + "/" + (j+1) + "</option>" );
		}
	}
	for ( e = 0; e < 4; ++e ) {
		for ( j = 0; j < 16; ++j ) {
			document.write( "<option value='"+(64+e*16+j)+"'>GT" + e + "/" + (j+1) + "</option>" );
		}
	}
	document.write( "</select>" );
}
```

## writeMIDIChannelSelector / writeMIDICCSelector / changeMIDIChannel

- Description: Mapping pair — MIDI channel 1–16 (or `--`), CC 0–127 (or `--`), optional Relative checkbox. CC is hidden until a channel is chosen.

```javascript
function changeMIDIChannel( id, ccid ) {
	if ( ccid != null ) {
		var show = ( document.getElementById( id ).value > 0 );
		document.getElementById( ccid ).style.display = show ? "inline" : "none";
		let rel = document.getElementById( ccid + "_rel" );
		if ( rel != null ) {
			rel.style.display = show ? "inline" : "none";
		}
	}
}

function writeMIDIChannelSelector( id, includeNone=false, ccid=null ) {
	document.write( "<select onchange='changeMIDIChannel(\"" + id + "\",\"" + ccid + "\")' id='" + id + "'>" );
	if ( includeNone ) {
		document.write( "<option value='-1'>--</option>" );
	}
	var j;
	for ( j = 1; j < 17; ++j ) {
		document.write( "<option value='"+j+"'>" + j + "</option>" );
	}
	document.write( "</select>" );
}

function writeMIDICCSelector( id, includeNone=true, hide=true, showRelative=true ) {
	document.write( "<select id='" + id + "'>" );
	if ( includeNone ) {
		document.write( "<option value='-1'>--</option>" );
	}
	var j;
	for ( j = 0; j < 128; ++j ) {
		document.write( "<option value='"+j+"'>" + j + "</option>" );
	}
	document.write( "</select>" );
	if ( showRelative ) {
		document.write( "<div title='Relative' class='relative_cb'><input type='checkbox' class='relative_cb' id='" + id + "_rel' /></div>" );
	}
	if ( hide ) {
		document.getElementById( id ).style.display = "none";
		if ( showRelative ) {
			document.getElementById( id + "_rel" ).style.display = "none";
		}
	}
}
```

## showHide

```javascript
function showHide( id, show ) {
	var ta = document.getElementById( id );
	ta.style.display = show ? "inline" : "none";
}
```

## Button / table primitives

There are no Button/Input/Card components. Visual primitives:

- `button.big` — 120% font Send/Upload
- `button` default for Send Msg, Load, Generate
- `select` 11px PT Sans
- `textarea` 11px PT Mono
- `table` / `th` gray `#c0c0c0` / zebra `tr.a` `#e0e0e0`
- `td.tc` centered gray header cells labeled “Channel/CC”
- `div.upload` 1px dotted inline-block
- `div.rth` rotated vertical table headers
