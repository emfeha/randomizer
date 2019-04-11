const sketch = require('sketch');
const UI = require('sketch/ui');
import BrowserWindow from 'sketch-module-web-view'

const document = sketch.getSelectedDocument();
const page = document.selectedPage;

let selectedLayers = document.selectedLayers;
let selectedCount = selectedLayers.length;

const symbols = document.getSymbols();

export default function() {

  const options = {
    identifier: 'unique.id',
    width: 300,
    height: 400,
    titleBarStyle: 'hiddenInset'
  }

  const browserWindow = new BrowserWindow(options);

  const webContents = browserWindow.webContents;

  let availableSymbolNames = [];
  let availableSymbols = [];

  function getAvailableSymbols() {
    if (selectedCount) {
      availableSymbolNames.push('Selected symbol')
    }

    symbols.forEach(function (symbol) {

      availableSymbolNames.push(symbol.name);
      availableSymbols.push({
        name: symbol.name,
        symbolId: symbol.symbolId
      });

    });
  }

  webContents.on('did-finish-load', () => {
    UI.message('Initial');
    getAvailableSymbols();
    webContents
      .executeJavaScript(`populateSelect("${availableSymbolNames}")`)
      .catch(console.error)
  });

  webContents.on('add-to-document', (o, s) => {
    UI.message(s);

    if(s === 'Selected symbol') {
      selectedLayers.forEach(function (layer){
        randomizeOverridableLayers(layer, o);
      });
    } else {
      var ns = createSymbol(s);
      var os = insertSymbol(ns);
      randomizeOverridableLayers(os, o)
    }
  });

  webContents.on('close', () => {
    closeWindow();
  });

  webContents.on('select-symbol', (s) => {
    getOverridePositions(s);
  });

  browserWindow.loadURL(require('../resources/webview.html'));

  function createSymbol(selectedSymbol) {
    let index = availableSymbolNames.indexOf(selectedSymbol);
    let symbolId = availableSymbols[index].symbolId;
    let symbolMaster = document.getSymbolMasterWithID(symbolId);

    return symbolMaster;
  }

  function insertSymbol(symbolMaster) {
    let instance = symbolMaster.createNewInstance();

    let inserted = new sketch.SymbolInstance({
      name: instance.name + ' Randomized',
      parent: page,
      symbolId: instance.symbolId,
      selected: true
    });

    inserted.frame.width = instance.frame.width;
    inserted.frame.height = instance.frame.height;

    return inserted;
  }

  function getOverridePositions(s) {
    UI.message('get positions');
    let positions = [];
    let symbol = createSymbol(s);
    symbol.overrides.forEach(function(item){
      if(item.editable){
        positions.push(item.affectedLayer.name);
      }
    });

    webContents
        .executeJavaScript(`displayOverridePositions("${positions}")`)
        .catch(console.error)

  }

  function randomizeOverridableLayers(master, overrides) {

    overrides.forEach(function (override) {
      master.overrides.forEach(function(item){
        if(item.affectedLayer.name == override) {
          console.log(item.affectedLayer.name);
          let random = getRandomOverride(item.affectedLayer.name);
          if(random) {
            item.value = random.symbolId;
          }
        }
      })
    });

  }


  function getRandomOverride(symbolName){
    let item = null;
    let items = [];
    symbols.forEach(function(s){
      if(s.name.startsWith(symbolName)) {
        let item = {
          name: s.name,
          symbolId: s.symbolId
        };
        items.push(item);
      }
    });

    if(items.length) {
      item = items[Math.floor(Math.random()*items.length)];
    }

    return item;

  }

  function closeWindow() {
    browserWindow.destroy();
  }

}
