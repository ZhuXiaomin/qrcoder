//  This file is required by the index.html file and will
//  be executed in the renderer process for that window.
//  All of the Node.js APIs are available in this process.

// In renderer process (web page).
const {ipcRenderer, clipboard} = require('electron')
const jsQR = require("jsqr");
const Mousetrap = require('mousetrap');
const moment = require('moment');


var decodeElem = window.document.getElementById('decoded')
var timeElem = window.document.getElementById('time')


// map multiple combinations to the same callback
Mousetrap.bind(['command+v', 'ctrl+v'], () => {
  qrDecode()
  // return false to prevent default behavior and stop event from bubbling
  return false
})


function qrDecode() {
  const image = clipboard.readImage(['image/png'])

  if (!image.isEmpty()) {
    let size = image.getSize();
    let img = image.toBitmap()

    const code = jsQR(new Uint8ClampedArray(img), size.width, size.height)

    if (code) {
      console.log("Found QR code", code);
      let decodedText = code.data
      clipboard.writeText(decodedText);

      decodeElem.innerHTML = decodedText
      ipcRenderer.send('notify' , decodedText + ' 已复制到粘贴板')
    }else{
      decodeElem.innerHTML = "QRcode Not Found"
    }
  } else {
    decodeElem.innerHTML = "PNG Not Found"
  }

  timeElem.innerHTML = 'at ' + moment().format()
}
