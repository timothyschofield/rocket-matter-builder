/*
*/

    Keys.KEYDOWN = "keydown";
    Keys.KEYUP = "keyup";
    Keys.theseKeysDown = {
        'Up': false,
        'Down': false,
        'Right': false,
        'Left': false,
        'Delete': false
    };

    function Keys() {

        var self = this;
        this.keyupCallback = function (eventData) {
            var thisKeyUp = self.getKey(eventData.keyCode);
            if(thisKeyUp) {
                Keys.theseKeysDown[thisKeyUp] = false;
            }
            self.dispatchGameEvent(Keys.KEYUP);
        };
        document.addEventListener('keyup', this.keyupCallback);

        this.keydownCallback = function (eventData) {
            var thisKeyDown = self.getKey(eventData.keyCode);
            if(thisKeyDown) {
                Keys.theseKeysDown[thisKeyDown] = true;
            }

            self.dispatchGameEvent(Keys.KEYDOWN);

        };
        document.addEventListener('keydown', this.keydownCallback);

    } // eo constructor
    Keys.prototype = Object.create(EventDispatcher.prototype);
    Keys.prototype.constructor = Keys;
    /*
     */
    Keys.prototype.getKey = function (keyCode) {
        var thisAction;
        //console.log(keyCode)
        switch (keyCode) {

            case 38: thisAction = 'Up'; break;          // arrow up
            case 40: thisAction = 'Down'; break;        // arrow down
            case 39: thisAction = 'Right'; break;       // arrow right
            case 37: thisAction = 'Left'; break;        // arrow left
            case 46: thisAction = "Delete"; break;      // delete key
            default:
        }

        return thisAction;
    };
    /*
     */
    Keys.prototype.getKeysDown = function () {
        return Keys.theseKeysDown;
    };
    /*
     */
Keys.prototype.removeKeyListeners = function () {
    document.removeEventListener('keyup', this.keyupCallback);
    document.removeEventListener('keydown', this.keydownCallback);
};

