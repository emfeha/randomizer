const sketch = require('sketch');
const UI = require('sketch/ui');

const document = sketch.getSelectedDocument();

let selectedLayers = document.selectedLayers;
let selectedCount = selectedLayers.length;

const symbols = document.getSymbols();

export default function () {

    if (!selectedCount) {
        UI.message('Please select symbol to randomize');
        return
    }

    selectedLayers.forEach(function (layer) {
        randomizeOverridableLayers(layer);
    });

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

