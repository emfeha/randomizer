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
/******/ 	return __webpack_require__(__webpack_require__.s = "./resources/webview.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/webview.js":
/*!******************************!*\
  !*** ./resources/webview.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Disable the context menu to have a more native feel
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
document.getElementById('select').addEventListener('change', function () {
  var msg = document.getElementById("select").value;
  window.postMessage('select-symbol', msg);
});
document.getElementById('button').addEventListener('click', function () {
  var selectedOverrides = printChecked();
  var symbol = document.getElementById("select").value;
  window.postMessage('add-to-document', selectedOverrides, symbol);
}); // called from the plugin

window.populateSelect = function (options) {
  var items = stringToArray(options);

  for (var i = 0; i < items.length; i++) {
    var opt = items[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    document.getElementById('select').appendChild(el);
  }

  window.postMessage('select-symbol', items[0]);
};

window.displayOverridePositions = function (positions) {
  var availableOverrides = document.getElementById('symbols');
  availableOverrides.innerHTML = '';
  var items = stringToArray(positions);

  for (var i = 0; i < items.length; i++) {
    var item = makeCheckboxButton("check[]", items[i], items[i]);
    availableOverrides.appendChild(item);
  }
};

function stringToArray(string) {
  return string.split(',');
}

function makeCheckboxButton(name, value, text) {
  var label = document.createElement("label");
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = name;
  checkbox.value = value;
  checkbox.checked = true;
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(text));
  return label;
}

function printChecked() {
  var items = document.getElementsByName('check[]');
  var selectedItems = [];

  for (var i = 0; i < items.length; i++) {
    if (items[i].type == 'checkbox' && items[i].checked == true) selectedItems.push(items[i].value);
  }

  return selectedItems;
}

/***/ })

/******/ });
//# sourceMappingURL=webview.js.map