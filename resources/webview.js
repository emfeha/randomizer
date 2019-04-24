// Disable the context menu to have a more native feel
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

document.getElementById('button').addEventListener('click', function () {

    window.postMessage('randomize-all');
});

window.displaySelectedSymbol = function (symbol) {
    document.getElementById('selected').innerHTML = symbol;
};

window.displayOverridePositions = function (positions) {

    document.getElementById('message').style.display = 'none';
    document.getElementById('content').style.display = 'block';

    let availableOverrides = document.getElementById('symbols');
    availableOverrides.innerHTML = '';

    let items = stringToArray(positions);

    for (var i = 0; i < items.length; i++) {
        var item = makeItem(items[i]);
        availableOverrides.appendChild(item);
        createListener(item, items[i]);
    }
};

window.displayMessage = function (message) {
    document.getElementById('message').innerHTML = message;
    document.getElementById('message').style.display = 'block';
    document.getElementById('content').style.display = 'none';
};

function createListener(item, override) {
    item.addEventListener('click', function () {
        window.postMessage('randomize-single', override);
    });
}

function stringToArray(string) {
    return string.split(',');
}

function makeItem(text) {

    var item = document.createElement("div");
    item.className = 'item';
    var button = document.createElement("button");
    button.id = text;
    button.className = 'button';

    item.appendChild(document.createTextNode(text));
    item.appendChild(button);

    return item;
}

