var connections = {};
console.log('background worker starting')

/*
 * agent -> content-script.js -> **background.js** -> dev tools
 */
chrome.runtime.onMessage.addListener(function(request, sender) {
    if (sender.tab) {
        var tabId = sender.tab.id;
        console.log(sender)
        if (tabId in connections) {
            connections[tabId].postMessage(request);
        } else {
            console.log("Tab not found in connection list.");
        }
    } else {
        console.log("sender.tab not defined.");
    }
    return true;
});


/*
 * agent <- content-script.js <- **background.js** <- dev tools
 */
chrome.runtime.onConnect.addListener(function(port) {

   // Listen to messages sent from the DevTools page
    port.onMessage.addListener(function(request) {
        console.log('incoming message from dev tools page', request);

        // Register initial connection
        if (request.name === 'init') {
            connections[request.tabId] = port;

            port.onDisconnect.addListener(function() {
                delete connections[request.tabId];
            });

            return;
        }

        // Otherwise, broadcast to agent
        chrome.tabs.sendMessage(request.tabId, {
            name: request.name,
            data: request.data
        });
    });

});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (tabId in connections && changeInfo.status === 'complete') {
        // TODO: reload connection to page somehow...?
        connections[tabId].postMessage({
            name: 'reloaded'
        });
    }
});