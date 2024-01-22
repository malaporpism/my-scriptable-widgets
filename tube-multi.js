// This widget now supports multiple instances
// Add this widget to Home screen, as many times as you want.
// Put name of one line (lowercase) into the "Parameter" field of "Widget Configuarion"
// You can put different lines in each instance of the widget.

// By default it sends a request every 15 minutes, 
// therefore you do not need a TFL API key. 

// When run from inside the editor, args.widgetParameter will be null. 
// A preview can be displayed with line name "Debug" and line status "Lorem Ipsum"

// User Configurable ========================

const FORCE = true  // force using online data every time
const DEBUG = false
const VERBO = false // Be verbose and console.log everything
const SAVE  = true  // save every request into Scriptable's local cache directory (will overwrite)

const minute = 6e4
const REFRESH_DATA = 15 * minute // Apple set the refresh interval
const REFRESH_WDGT = 15 * minute // Values<15 is not guaranteed to work

// DO NOT MODIFY BELOW ===============================

const lines = ["bakerloo", "central", "circle", "district", "dlr", "elizabeth-line", "hammersmith-city", "jubilee", "london-overground", "metropolitan", "northern", "piccadilly", "victoria", "waterloo-city", "debug"]

var arg = args.widgetParameter

if (arg == null) {
	arg = 'debug'
} else {
	if (!lines.includes(arg))    throw `ERROR : The string ${arg} is not in the array`;
	if (typeof arg !== "string") throw "ERROR : You can only select one line";
}

const lineIndex = lines.indexOf(arg)
if (DEBUG) console.log(arg + ", " + lineIndex)

var shortName = {
	  "Bakerloo": "BAK",
	  "Central":  "CEN",
	  "Circle":   "CIR",
	  "District": "DIS",
	  "DLR":      "DLR",
	  "Elizabeth line": "ELZ",
	  "Hammersmith & City": "H&C",
	  "Jubilee":  "JUB",
	  "London Overground": "OVG",
	  "Metropolitan": "MET",
	  "Northern": "NOR",
	  "Piccadilly": "PIC",
	  "Tram":     "TRM",
	  "Victoria": "VIC",
	  "Waterloo & City": "WAT"
	}
	
let screen = Device.screenSize();
	 screen = Math.max(screen['height'], screen['width'])
	
switch (screen) {
	case 960: // macOS Desktop
		var layout = {
			TOP:    5,
			LEAD:   0,
			BOTTOM: 0,
			TRAIL:  0,
			TITLE_SIZE: 20,
			TEXT_SIZE:  14,
			SPACER_HOR: 18,
			SPACER_VER: 4,
			SPACER_LEFT: 20,
			LINE_SPACING: 8,
			ICON_SPACING: 4
		}
	  break;

  case 667: // on iPhone 8/SE
		var layout = {
			TOP:    5,
			LEAD:   0,
			BOTTOM: 0,
			TRAIL:  0,
			TITLE_SIZE: 16,
			TEXT_SIZE:  12,
			SPACER_HOR: 18,
			SPACER_VER: 4,
			SPACER_LEFT: 20,
			LINE_SPACING: 8,
			ICON_SPACING: 4
		}
	  break;
	
  default: // actual resolution; currenltly displayed in quick look
		var layout = {
			TOP:    5,
			LEAD:   0,
			BOTTOM: 0,
			TRAIL:  0,
			TITLE_SIZE: 18,
			TEXT_SIZE:  14,
			SPACER_HOR: 18,
			SPACER_VER: 4,
			SPACER_LEFT: 20,
			LINE_SPACING: 8,
			ICON_SPACING: 4
		}
	  break;
}

layout.TITLE_FONT = Font.boldSystemFont(layout.TITLE_SIZE)
layout.TEXT_FONT  = Font.regularSystemFont(layout.TEXT_SIZE)
layout.TEXT_DARK = new Color('#000000', 1)
layout.TEXT_LIGHT  = new Color('#ffffff', 1)
layout.LINK_DARK = Color.blue()
layout.LINK_LIGHT  = new Color('#a5d3f3', 1)
// layout.SUB_LIGHTBG  = new Color('#000000', 0.2)
// layout.SUB_DARKBG   = new Color('#ffffff', 0.33)
// layout.ICON_LIGHTBG = new Color('#ff3b30', 1)
// layout.ICON_DARKBG  = new Color('#ff453a', 1)
layout.ICON_SIZE    = new Size (layout.TITLE_SIZE + 3, layout.TITLE_SIZE + 3)
// layout.TEXT_DYNAMIC = new Color('#000000', 1) // Color.dynamic(TEXT_LIGHTBG, TEXT_DARKBG)
// layout.SUB_DYNAMIC  = new Color('#000000', 1) // Color.dynamic(SUB_LIGHTBG,  SUB_DARKBG)
// layout.ICON_DYNAMIC = Color.dynamic(layout.ICON_LIGHTBG, layout.ICON_DARKBG)

const colorBook = {
	"Bakerloo": {
		main: "b26300",
		fade: "c08128",
		dark: true // if true, use dark font on a light-colored background
	},	
	"Central": {
		main: "dc241f",
		fade: "e66552",
		dark: false
	},	
	"Circle": {
		main: "ffc80a",
		fade: "ffd843",
		dark: true
	},
	"District": {
		main: "007d32",
		fade: "4ca45f",
		dark: false
	},	
	"DLR": {
		main: "00afad",
		fade: "4cc7b5",
		dark: false
	},	
	"Elizabeth line": {
		main: "60399e",
		fade: "8f74ab",
		dark: false
	},	
	"Hammersmith & City": {
		main: "f589a6",
		fade: "f8acb0",
		dark: false
	},	
	"Jubilee": {
		main: "838d93",
		fade: "a8afa3",
		dark: true
	},	
	"London Overground": {
		main: "fa7b05",
		fade: "fba240",
		dark: false,
	},	
	"Metropolitan": {
		main: "9b0058",
		fade: "b94c7a",
		dark: true
	},	
	"Northern": {
		main: "000000",
		fade: "aaaaaa",
		dark: true
	},	
	"Piccadilly": {
		main: "0019a8",
		fade: "4c5eb2",
		dark: false
	},	
	"Tram": {
		main: "5fb526",
		fade: "8fcb57",
		dark: true
	},	
	"Victoria": {
		main: "039be5",
		fade: "4eb9dc",
		dark: false
	},	
	"Waterloo & City": {
		main: "76d0bd", 
		fade: "9fdec0",
		dark: true
	},
	"Debug": {
		main: "8074C7", 
		fade: "D6542F",
		dark: false
	}
};

try { 
	if (FORCE) throw "User force refresh";
	var api = getLocalData()
} catch(e){
	console.log(e)
	var api = await getOnlineData()
}

if (VERBO) console.log(api);

var lastUpdate = api.pop()
var lineName = api[lineIndex]['name']
var dark = colorBook[lineName].dark

var statusCode = api[lineIndex]['lineStatuses'][0]['statusSeverity']
let lineSymbol = getSymbol(statusCode)
let statusText = api[lineIndex]['lineStatuses'][0]['statusSeverityDescription']
let statusDesc = api[lineIndex]['lineStatuses'][0]['reason']
		console.log("statusText: " + statusText)
		console.log("statusDesc: " + statusDesc)

var widget = await createWidget(api)

if (config.runsInApp) widget.presentSmall();

Script.setWidget(widget)
Script.complete()

async function createWidget(api) {

  let widget = new ListWidget()
	  	widget.refreshAfterDate = new Date(Date.now() + REFRESH_WDGT)
	//widget.setPadding(TOP, LEAD, BOTTOM, TRAIL)
	widget.setPadding(20,10,10,10)
	let gradient = new LinearGradient()
  		gradient.locations = [0, 1] // top to down
			gradient.colors = [
				new Color(colorBook[lineName].fade),
				new Color(colorBook[lineName].main)
			]
  widget.backgroundGradient = gradient

  let main = widget.addStack()
			main.layoutVertically()
			//main.setPadding(0,0,0,0)
	let titleStack = main.addStack()
			titleStack.layoutHorizontally()
	let title =	titleStack.addText(lineName.split(" ")[0])
			title.textColor = (dark ? layout.TEXT_DARK : layout.TEXT_LIGHT)
			title.font = layout.TITLE_FONT
			title.lineLimit = 1
			title.minimumScaleFactor = 0.8
			titleStack.addSpacer(layout.SPACER_HOR)
	let symbol = titleStack.addImage(lineSymbol.image)
			symbol.imageSize = layout.ICON_SIZE
			symbol.tintColor = new Color(layout.ICON_COLOR)
	let status = main.addText(statusText)
			status.textColor = (dark ? layout.TEXT_DARK : layout.TEXT_LIGHT)
			status.font = layout.TITLE_FONT
			status.lineLimit = 1
			status.minimumScaleFactor = 0.8

	main.addSpacer(layout.SPACER_VER)

	let reasonStr = clean(statusText, statusDesc)
	let reason = main.addText(reasonStr)
			reason.textColor = (dark ? layout.TEXT_DARK : layout.TEXT_LIGHT)
			reason.font = layout.TEXT_FONT
			reason.minimumScaleFactor = 0.7

  // Display link only when run in an interactive context
  if (!config.runsWithSiri) {
		main.addSpacer()
    let linkStack = main.addStack()
    linkStack.centerAlignContent()
    linkStack.url = "https://tfl.gov.uk/tube-dlr-overground/status/#"
    let linkElement = linkStack.addText(new Date(lastUpdate).toISOString().substring(11,16) + ' tfl.gov.uk')
    linkElement.font = layout.TEXT_FONT
    linkElement.textColor = (dark ? layout.LINK_DARK : layout.LINK_LIGHT)
    linkStack.addSpacer(3)
    let linkSymbol = SFSymbol.named('arrow.up.forward')
    let linkSymbolElement = linkStack.addImage(linkSymbol.image)
    linkSymbolElement.imageSize = new Size(11, 11)
    linkSymbolElement.tintColor = (dark ? layout.LINK_DARK : layout.LINK_LIGHT)
  }

	if (DEBUG) {
		for (let i in ['titleStack', 'contentStack']) {
			i.borderColor = Color.red()
			i.borderWidth = 1
		}
	}
  return widget
}

function getLocalData() {
	
	const fm = FileManager.local()
	const path = fm.cacheDirectory() + '/tube.json'
	
	if (!fm.fileExists(path)) throw "EXCEPTION cache does not exist"
	
	console.log("Use local data")
	
	let raw, par, lastUpdate
	
	raw = fm.readString(path)
	par = JSON.parse(raw)	
	lastUpdate = par.at(-1)
	
	if (!typeof lastUpdate === 'number') throw "EXCEPTION: cache is corrupted"
	if (Date.now() > lastUpdate + REFRESH_DATA) throw "EXCEPTION: cahe is out of date"

	return par
}

async function getOnlineData(save=SAVE) {
	const fm = FileManager.local()
	const path = fm.cacheDirectory() + '/tube.json'
	const url = 'https://api.tfl.gov.uk/Line/Mode/tube,dlr,overground,elizabeth-line/Status?detail=false'
	const req = new Request(url)
	let par = await req.loadJSON()
	let lorem =  {
    "id": "debug",
    "name": "Debug",
    "lineStatuses": [
      {
        "statusSeverity": 8,
        "statusSeverityDescription": "Lorem ipsum",
        "reason": "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incident"
      }
    ]
	}
	par.push(lorem)
	par.push(Date.now())
		
	if (save) {
		fm.writeString(path, JSON.stringify(par))
		console.log("Cached online data")
	}
	
	return par
}

function getSymbol(statusCode) {
	switch(statusCode) {
		case 2: // suspended
		case 3: // part suspended
		case 4: // planned closure
			var ico = SFSymbol.named('xmark.diamond.fill')
			layout.ICON_COLOR = '#ff6666'
			break;
			
		case 5: // part closure
		case 7: // reduced service
			var ico = SFSymbol.named('minus.square.fill')
			layout.ICON_COLOR = (dark ? '#ffaaaa' : '#ff6666')
			layout.ICON_SIZE  = new Size(layout.TITLE_SIZE, layout.TITLE_SIZE)
			break;
			
		case 6: // severe delay
			var ico = SFSymbol.named('exclamationmark.triangle.fill')
			layout.ICON_COLOR = (dark ? '#ffaaaa' : '#ff6666')
			break;

		case 9: // minor delay
			var ico = SFSymbol.named('tortoise')
				 ico.applyBlackWeight()
			layout.ICON_COLOR = (dark ? '#d86b2d' : '#ffae7f')
			layout.ICON_SIZE  = new Size(layout.TITLE_SIZE + 6, layout.TITLE_SIZE + 6)
			break;
			
		case 10: // good service
			var ico = SFSymbol.named('checkmark.circle.fill')
				 ico.applyHeavyWeight()
			layout.ICON_COLOR = (dark ? '#00bb00' : '#66ff66')
			break;
			
		case 20: // service closed
			var ico = SFSymbol.named('moon.zzz')
			layout.ICON_COLOR = (dark ? '#ffaaaa' : '#ff6666')
			break;
			
		default: // status unmatched
			//var ico = SFSymbol.named('questionmark.app.dashed')
			var ico = SFSymbol.named(statusCode + '.circle')
				 ico.applySemiboldWeight()
			layout.ICON_COLOR = (dark ? '#000000' : '#ffffff')
			break;
	}
	return ico
}

function clean(statusText, statusDesc) {
	if (statusText == 'Good Service') {
		return '--'
	} else {
		let rgx = new RegExp(".*" + statusText + " ", "gi");
		let str = statusDesc.replace(/.*\:\s/, "").replace(rgx, "")
		if (VERBO) console.log("Before: " + str)
		if (str.includes("accept")) {
			str = str.replace(/(?:\.)\s.*accept.*/i, "")
			titleStack.addSpacer(4)
			let tkSymbol = SFSymbol.named('ticket')
				 tkSymbol.applyBoldWeight()
			let ticket = titleStack.addImage(tkSymbol.image)
			ticket.imageSize = layout.ICON_SIZE
			ticket.tintColor = Color.dynamic(new Color('#ffffff99'), new Color('#ffffff99'))
		}
		if (str.includes("rest")) {
			str = str.replace(/GOOD(.*)/gi, "[GR]");
		}
		if (VERBO) console.log("After: " + str)
		return str
	}
}