/*
 event type: {context, callback}
 e.g. 'click': {dragon3, handleClick} on click dragon3.handleClick() gets called
 listeners is static because we do not want each instance that inherits from EventDispatcher
 to have their own copy. What would the point be of a skeleton instance registering its interest
 in a button click in its own copy of listeners. Then when the button is clicked
 the button would check its (the buttons) listeners (empty) to see who was listening. Nothing happens
*/

    EventDispatcher.listeners = {};

    function EventDispatcher() {
    }
    /*
    e.g. addEventListener('daily', tim.drinkCoffee, tim)
    */
    EventDispatcher.prototype.addGameEventListener = function (eventType, callback, context) {

        // make a new list for objects (contexts) listening to eventType
        if (typeof EventDispatcher.listeners[eventType] === "undefined") {
            EventDispatcher.listeners[eventType] = [];
        }

        // how about push(context[callback])
        EventDispatcher.listeners[eventType].push({ callback: callback, context: context });

        // returns a handle to the listener - this can be used to conveniently remove the listener
        // at a later date
        return {eventType: eventType,  callback: callback, context: context };
    };
    /*
    */
    EventDispatcher.prototype.removeGameEventListener = function (eventType, callback, context) {

        var listenersToThisEvent = EventDispatcher.listeners[eventType];
        var numListeners = listenersToThisEvent.length;
        for (var i = numListeners - 1; i >= 0; i--) {

            var thisContext = listenersToThisEvent[i].context;
            var thisCallback = listenersToThisEvent[i].callback;

            if (context === thisContext && callback === thisCallback)
                listenersToThisEvent.splice(i, 1);
        }
    };
    /*
    */
    EventDispatcher.prototype.dispatchGameEvent = function (eventType, message) {

        //console.log("In EventDispatcher.prototype.dispatchGameEvent " + eventType + " " + message);

        var listenersToThisEvent = EventDispatcher.listeners[eventType];
        if(listenersToThisEvent) {
            var numListeners = listenersToThisEvent.length;
            for (var i = 0; i < numListeners; i++) {

                var thisContext = listenersToThisEvent[i].context;
                var thisCallback = listenersToThisEvent[i].callback;

                thisCallback.call(thisContext, message);
            }
        }
    };

