window.addEventListener('message', function(event) {
    var message = event.data;
    var BECSY = window.BECSY

    if(!BECSY) {
        console.error('Add world to window as BECSY')
    }

    if (message.name === 'update') {
        window.postMessage({
            name: 'send',
            data: BECSY.stats,
            source: 'becsy-inspector'
        })
    }

    if (message.name === 'stop') {
        BECSY.__dispatcher.systemsByClass.forEach(function(value, key, map){
            if (key.name === message.data) {
                BECSY.control({stop: [key], restart: []});
            }
        })
    }

    if (message.name === 'start') {
        BECSY.__dispatcher.systemsByClass.forEach(function(value, key, map){
            if (key.name === message.data) {
                BECSY.control({stop: [], restart: [key]});
            }
        })
    }
})