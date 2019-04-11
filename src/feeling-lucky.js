const sketch = require('sketch');
const UI = require('sketch/ui');

const document = sketch.getSelectedDocument();
const page = document.selectedPage;

let selectedLayers = document.selectedLayers;
let selectedCount = selectedLayers.length;

const symbols = document.getSymbols();

export default function() {

    let availableSymbolNames = [];
    let availableSymbols = [];

    if (selectedCount) {
        availableSymbolNames.push('Selected symbol')
    }

    symbols.forEach(function (symbol) {
        let item = {
            name: symbol.name,
            symbolId: symbol.symbolId
        };

        availableSymbolNames.push(symbol.name);
        availableSymbols.push(item);

    });

    UI.getInputFromUser("Please select symbol you want to randomize", {
      type: UI.INPUT_TYPE.selection,
      possibleValues: availableSymbolNames
    }, (err, value) => {
      if (err) {
        // most likely the user canceled the input
        return
      } else {
        if(value === 'Selected symbol') {
          selectedLayers.forEach(function (layer){
            randomizeOverridableLayers(layer);

          });
        } else {
          createSymbol(value);
        }

      }
    });

    function createSymbol(selectedSymbol) {
        let index = availableSymbolNames.indexOf(selectedSymbol);
        let symbolId = availableSymbols[index].symbolId;
        let symbolMaster = document.getSymbolMasterWithID(symbolId);
        let instance = symbolMaster.createNewInstance();

        let inserted = new sketch.SymbolInstance({
            name: instance.name + ' Randomized',
            parent: page,
            symbolId: instance.symbolId
        });

        inserted.frame.width = instance.frame.width;
        inserted.frame.height = instance.frame.height;

        randomizeOverridableLayers(inserted);

    }

    function randomizeOverridableLayers(master) {
        master.overrides.forEach(function(item){
            if(item.editable){
                let random = getRandomOverride(item.affectedLayer.name);
                if(random) {
                    item.value = random.symbolId;
                }
            }

        })
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

}
