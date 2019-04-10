var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/my-command.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/my-command.js":
/*!***************************!*\
  !*** ./src/my-command.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var sketch = __webpack_require__(/*! sketch */ "sketch");

var UI = __webpack_require__(/*! sketch/ui */ "sketch/ui");

var document = sketch.getSelectedDocument();
var page = document.selectedPage;
var selectedLayers = document.selectedLayers;
var selectedCount = selectedLayers.length;
var symbols = document.getSymbols();
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var availableSymbolNames = [];
  var availableSymbols = [];

  if (selectedCount) {
    availableSymbolNames.push('Selected symbol');
  }

  symbols.forEach(function (symbol) {
    var item = {
      name: symbol.name,
      symbolId: symbol.symbolId
    };
    availableSymbolNames.push(symbol.name);
    availableSymbols.push(item);
  });
  UI.getInputFromUser("Please select symbol you want to randomize", {
    type: UI.INPUT_TYPE.selection,
    possibleValues: availableSymbolNames
  }, function (err, value) {
    if (err) {
      // most likely the user canceled the input
      return;
    } else {
      if (value === 'Selected symbol') {
        selectedLayers.forEach(function (layer) {
          randomizeOverridableLayers(layer);
        });
      } else {
        createSymbol(value);
      }
    }
  });

  function createSymbol(selectedSymbol) {
    var index = availableSymbolNames.indexOf(selectedSymbol);
    var symbolId = availableSymbols[index].symbolId;
    var symbolMaster = document.getSymbolMasterWithID(symbolId);
    var instance = symbolMaster.createNewInstance();
    var inserted = new sketch.SymbolInstance({
      name: instance.name + ' Randomized',
      parent: page,
      symbolId: instance.symbolId
    });
    inserted.frame.width = instance.frame.width;
    inserted.frame.height = instance.frame.height;
    randomizeOverridableLayers(inserted);
  }

  function randomizeOverridableLayers(master) {
    master.overrides.forEach(function (item) {
      if (item.editable) {
        var random = getRandomOverride(item.affectedLayer.name);

        if (random) {
          item.value = random.symbolId;
        }
      }
    });
  }

  function getRandomOverride(symbolName) {
    var item = null;
    var items = [];
    symbols.forEach(function (s) {
      if (s.name.startsWith(symbolName)) {
        var _item = {
          name: s.name,
          symbolId: s.symbolId
        };
        items.push(_item);
      }
    });

    if (items.length) {
      item = items[Math.floor(Math.random() * items.length)];
    }

    return item;
  }
});

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=my-command.js.map