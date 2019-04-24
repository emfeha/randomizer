const sketch = require('sketch');
const UI = require('sketch/ui');
import BrowserWindow from 'sketch-module-web-view'

const document = sketch.getSelectedDocument();

let selectedLayers = document.selectedLayers;
let selectedCount = selectedLayers.length;

const symbols = document.getSymbols();

export default function () {

    if (!selectedCount) {
        UI.message('Please select symbol you want to randomize');
        return;
    }

    const options = {
        identifier: 'randomizer',
        y: -100,
        x: 350,
        width: 300,
        height: 400,
        alwaysOnTop: true
    };

    const browserWindow = new BrowserWindow(options);

    const webContents = browserWindow.webContents;

    webContents.on('did-finish-load', () => {
        selectedLayers.forEach(function (layer) {

            getOverridePositions(layer);
        })
    });

    webContents.on('randomize-single', (o) => {
        selectedLayers.forEach(function (layer) {
            randomizeOverridableLayer(layer, o);
            getOverridePositions(layer);
        });
    });

    webContents.on('randomize-all', () => {
        selectedLayers.forEach(function (layer) {
            randomizeOverridableLayers(layer);
            getOverridePositions(layer);
        });
    });

    browserWindow.loadURL(require('../resources/webview.html'));

    browserWindow.on('focus', () => {
        selectedLayers = document.selectedLayers;
        selectedCount = selectedLayers.length;
        UI.message(selectedCount);
        if (!selectedCount) {
            UI.message('select symbol!');
            webContents
                .executeJavaScript(`displayMessage('Please select symbol')`)
                .catch(console.error)
        }
        selectedLayers.forEach(function (layer) {
            getOverridePositions(layer);
        })
    });

    function getOverridePositions(s) {
        let positions = [];
        s.overrides.forEach(function (item) {
            if (item.editable) {
                positions.push(item.affectedLayer.name);
            }
        });

        webContents
            .executeJavaScript(`displaySelectedSymbol("${s.name}")`)
            .catch(console.error);

        webContents
            .executeJavaScript(`displayOverridePositions("${positions}")`)
            .catch(console.error);

    }

    function randomizeOverridableLayer(master, override) {
        master.overrides.forEach(function (item) {
            if (item.affectedLayer.name === override) {
                let random = getRandomOverride(item.affectedLayer.name);
                if (random) {
                    item.value = random.symbolId;
                }
            }
        })
    }

    function randomizeOverridableLayers(master) {

        master.overrides.forEach(function (item) {
            if (item.editable) {
                let random = getRandomOverride(item.affectedLayer.name);
                if (random) {
                    item.value = random.symbolId;
                }
            }
        })

    }

    function getRandomOverride(symbolName) {
        let item = null;
        let items = [];
        symbols.forEach(function (s) {
            if (s.name.startsWith(symbolName)) {
                let item = {
                    name: s.name,
                    symbolId: s.symbolId
                };
                items.push(item);
            }
        });

        if (items.length) {
            item = items[Math.floor(Math.random() * items.length)];
        }

        return item;

    }

}
