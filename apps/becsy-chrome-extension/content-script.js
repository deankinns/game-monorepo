console.log('injected')

/*
 * agent -> **content-script.js** -> background.js -> dev tools
 */
window.addEventListener('message', function(event) {
    // Only accept messages from same frame
    if (event.source !== window) {
        return;
    }

    var message = event.data;

    // Only accept messages of correct format (our messages)
    if (typeof message !== 'object' || message === null ||
        message.source !== 'becsy-inspector') {
        return;
    }


    chrome.runtime.sendMessage(message)
});


/*
 * agent <- **content-script.js** <- background.js <- dev tools
 */
chrome.runtime.onMessage.addListener(function(request) {
    request.source = 'becsy-inspector';
    window.postMessage(request, '*');

    // if (!window.BECSY) {
    //     console.error('Becsy has not bee added to window')
    // }
    // if (request.name === 'update') {
    //     window.postMessage({
    //         name: 'update',
    //         data: window.BECSY.stats,
    //         source: 'becsy-inspector'
    //     })
    // }
});

var s = document.createElement('script');
s.src = chrome.runtime.getURL('script.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);