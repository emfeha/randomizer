// Disable the context menu to have a more native feel
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

document.getElementById('select').addEventListener('change', function () {
    var msg = document.getElementById("select").value;
    window.postMessage('select-symbol', msg)
});

document.getElementById('button').addEventListener('click', function () {
    let selectedOverrides = printChecked();
    var symbol = document.getElementById("select").value;
    window.postMessage('add-to-document', selectedOverrides, symbol);
});

// called from the plugin
window.populateSelect = function (options) {

    let items = stringToArray(options);
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
    let availableOverrides = document.getElementById('symbols');
    availableOverrides.innerHTML = '';
    let items = stringToArray(positions);
    for (var i = 0; i < items.length; i++) {
        var item = makeCheckboxButton("check[]", items[i], items[i]);
        availableOverrides.appendChild(item);
    }
}

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

function printChecked(){
    var items=document.getElementsByName('check[]');
    var selectedItems = [];
    for(var i=0; i<items.length; i++){
        if(items[i].type=='checkbox' && items[i].checked==true)
            selectedItems.push(items[i].value);
    }
    return selectedItems;
}
