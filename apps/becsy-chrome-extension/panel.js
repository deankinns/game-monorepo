var backgroundPageConnection = chrome.runtime.connect({
    name: 'panel'
});

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});

$('#step').click(function () {
    console.log(data)
    backgroundPageConnection.postMessage({
        name: 'update',
        tabId: chrome.devtools.inspectedWindow.tabId
    })
})

var running = false;

$('#startstop').click(function () {
    // console.log(data)

    if (!running) {
        $(this).html('Stop');
        backgroundPageConnection.postMessage({
            name: 'update',
            tabId: chrome.devtools.inspectedWindow.tabId
        })
        running = true;
    } else {
        $(this).html('Start');
        running = false;
    }
});

$('#systems').on('click', 'span.control-system', function () {
    var system = $(this).attr('rel');
    var running = data[system];

    $(this).html(running ? 'start' : 'stop')

    backgroundPageConnection.postMessage({
        name: running ? 'stop' : 'start',
        data: system,
        tabId: chrome.devtools.inspectedWindow.tabId
    })
    data[system] = false;

})

var data = [];
var updating = false;

function draw(inputData, prefix, parent) {
    for (var inputDataKey in inputData) {
        var key = (prefix ? prefix : '') + inputDataKey
        var value = inputData[inputDataKey]
        if (isNaN(value)) {
            if (!data[key]) {
                data[key] = []
                var button = '';
                if (prefix === 'system') {
                    button = '<span id="control' + key + '" rel="' + inputDataKey + '" role="button" class="btn btn-sm btn-outline-primary float-right control-system">stop</span>'
                    data[inputDataKey] = true
                }
                $(parent).append('<div class="card"><div class="card-header d-flex justify-content-between align-items-center">' + inputDataKey + button + '</div><div id="' + key + '"  class="card-body"></div></div>')
            }
            draw(value, key + '-', '#' + key)
        } else if (inputDataKey.charAt(0) === '_') {
            if (!data[key]) {
                data[key] = [];
                $(parent).append('<div>' + (!prefix.startsWith('component') ? inputDataKey + ': ' : '') + '<span id="' + key + '">Loading...</span></div>')
            }
            data[key].push(value)
            data[key] = data[key].slice(-100)
            $('#' + key).sparkline(data[key], {chartRangeMin: 0, width: '100%'})
        }
    }
}

chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.name === 'send' && !updating && request.data) {
        // updating = true;
        var stats = Object.fromEntries(Object.entries(request.data).filter(function (value) {
            return !isNaN(value[1]);
        }))

        draw(stats, 'stats', '#stats')
        draw(request.data.components, 'component', '#components')
        draw(request.data.systems, 'system', '#systems')

        if (running) {
            setTimeout(function () {
                backgroundPageConnection.postMessage({
                    name: 'update',
                    tabId: chrome.devtools.inspectedWindow.tabId
                })
            }, 100)
        }

    }


})
