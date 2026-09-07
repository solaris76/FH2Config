# Theme — FH-2 Configuration Tool

## Part 1 — Compact token summary

Saved browser page of the Expert Sleepers FH-2 Web MIDI configuration tool. No framework, no Tailwind. Two Google fonts plus a handful of table-utility classes. Light/dark is a JS theme switcher that mutates `document.styleSheets[2]` (the inline stylesheet).

### Color palette

| Token / role | Light | Dark |
| --- | --- | --- |
| page background | `white` | `black` |
| page text | `black` | `#c0c0c0` |
| button fill | `#efefef` | `black` |
| button text | `black` | `#c0c0c0` |
| select / input / textarea fill | `white` | `black` |
| select / input / textarea text | `black` | `#c0c0c0` |
| `tr.a` zebra | `#e0e0e0` | `#505050` |
| `th` header | `#c0c0c0` | `#505050` |
| `td.tc` centered header cell | `#c0c0c0` | `#505050` |
| `td.tc_a` alt centered cell | `#e0e0e0` | `#606060` |
| file upload box | 1px dotted border | same |

No CSS variables, no accent color, no shadows, no border-radius tokens.

### Typography

- UI: `'PT Sans', serif` at `16px` on `body`
- Controls: `'PT Sans', serif` at `11px` on `input, select, button`
- SysEx log: `'PT Mono', monospace` at `11px` on `textarea`
- `button.big`: `120%`
- `th`, `td.tc`, `td.tc_a`, `div.small`, `div.tc_c`, `label.logs`: `80%`

### Spacing / layout

- `table { margin-bottom: 5px }`
- `p` block margins 0
- `div.rth` vertical-rl headers, `transform: rotate(200deg)`, 5px left/right padding
- `.hidden` off-screen a11y labels (`left:-10000px`)
- `div.upload` inline-block dotted box
- `div.relative_cb` inline; relative-CC checkbox has 0 margin

### Radius / shadow / breakpoints

None. Layout is a single flowing document of nested HTML tables. No media queries.

---

## Part 2 — Raw source

Inline stylesheet from `FH-2 Configuration Tool.html` lines 9–101:

```css
body {
}
button {
}
select {
}
tr.a {
	background-color: #e0e0e0;
}
th {
	background-color: #c0c0c0;
	font-size: 80%;
}
td.tc {
	text-align: center;
	background-color: #c0c0c0;
	font-size: 80%;
}
td.tc_a {
	text-align: center;
	background-color: #e0e0e0;
	font-size: 80%;
}
input {
}
textarea {
    font-family: 'PT Mono', monospace;
	font-size: 11px;
}
body {
	font-family: 'PT Sans', serif;
	font-size: 16px;
}
button.big {
	font-size: 120%;
}
input, select, button {
	font-family: 'PT Sans', serif;
	font-size: 11px;
}
div.small {
	font-size: 80%;
}
table {
	margin-bottom: 5px;
}
div.tc_c {
	font-size: 80%;
}
div.rth {
	-webkit-writing-mode: vertical-rl;
	transform: rotate(200deg);
	padding-left: 5px;
	padding-right: 5px;
}
table.logs {
	margin: 0px;
	border-spacing: 0px;
}
table.nested {
	margin: 0px;
}
td.logs {
	padding: 0px;
}
label.logs {
	font-size: 80%;
}
.hidden {
	position:absolute;
	left:-10000px;
	top:auto;
	width:1px;
	height:1px;
	overflow:hidden;
}
p {
	margin-block-start: 0em;
	margin-block-end: 0em;
}
div.relative_cb {
	display:inline;
}
input.relative_cb {
	margin:0px;
}
div.upload {
	border: 1px;
	border-style: dotted;
	display: inline-block;
}
```

Fonts loaded from `./FH-2 Configuration Tool_files/css` (PT Sans) and `./FH-2 Configuration Tool_files/css(1)` (PT Mono).
