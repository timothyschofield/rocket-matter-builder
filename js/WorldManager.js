/**
 * Created by Timothy on 25/04/14.
 *  width for iPhone = 1600
 *  height for iPhone = 467
 *  rounded to 1600 470 (may have to subtract 3 for export)
 */
function WorldManager() {
    this.$canvas = $('#canvas');

    this.itemID = 1;
    this.itemTable = {};
    this.boundaryIDs = [];

    this.keys = new Keys();

    this.worldWidth = 1600;
    this.worldHeight = 470;
    this.grid = 10;     // pixel grid that the world is quantized to - x same as y

    this.rocketWidth = 100;
    this.rocketHeight = 60;

    // the center of an 800 by 470 window
    this.rocketL = this.worldWidth/4 - this.rocketWidth/2;
    this.rocketT = this.worldHeight/2 - this.rocketHeight/2;

    this.createRocket({'left': this.rocketL , 'top': this.rocketT, 'width':this.rocketWidth, 'height':this.rocketHeight});


    this.addGameEventListener('CURSOR_SHOW', this.deSelectAll, this);
    this.addGameEventListener('CURSOR_HIDE', this.deSelectAll, this);
    this.addGameEventListener('CURSOR_MOVE_END', this.cursorMoveEnd, this);

}   // eo constructor
WorldManager.prototype = Object.create(EventDispatcher.prototype);
WorldManager.prototype.constructor = WorldManager;
/**
 *
 */
WorldManager.prototype.createBlock = function (valuesTL, cssOptions, physicalOptions) {

    var thisID = 'id' + this.itemID++;

    var thisBlock = new Item(this, thisID, 'rectangle', valuesTL.left, valuesTL.top, valuesTL.width, valuesTL.height, cssOptions, physicalOptions );
    this.$canvas.append(thisBlock.div);

    this.itemTable[thisID] = thisBlock;

    return thisBlock;
};
/**
 *  returns a JSON {} representation of the world - for storing in a file
 */
WorldManager.prototype.getJSON = function () {

    var world = {'items': []};

    var key, thisItem;
    for(key in this.itemTable) {
        thisItem = this.itemTable[key].getJSON();
        world.items.push(thisItem);
    }
    return world;
};
/**
 * @param jsonWorld {} - We have loaded some JSON from file describing the world to create
 */
WorldManager.prototype.createNewWorld = function (jsonWorld) {
    var key;

    // removes all old the objects from the canvas
    for(key in this.itemTable) {
        $('#' + key).remove();
    }

    this.itemID = 1;   // might be some confusion with ids, some will change
    delete this.itemTable;
    this.itemTable = {};

    var n, numItems, thisItem;
    numItems = jsonWorld.items.length;
    for( n = 0 ; n < numItems; n++ ) {
        thisItem = jsonWorld.items[n];
        // Give the new objects new contiguous ids (some objects may have been deleted in the originally world that was stored)
        // So some block's ids will change - I can't think this matters

        switch(thisItem.type) {
            case 'rectangle': this.createBlock(thisItem.rect, thisItem.cssOptions, thisItem.physicalOptions);
            break;

            case 'rocket': this.createRocket(thisItem.rect);
            break;

            default: console.log("Unknown object type: ", thisItem.type);
        }

    }


};
/**
 * @param cursor {} describing the position of the cursor
 * 1. If any blocks had been selected before the cursor moved then this is the time to move them
 * 2. We select all the blocks within the new cursor position
 */
WorldManager.prototype.cursorMoveEnd = function (cursor) {

    var key, thisItem;
    var thisController = cursor.id;
    var dLeft = cursor.left - cursor.oldLeft;
    var dTop = cursor.top - cursor.oldTop;

    // what happens should be dependent on which controller has just moved
    // case statement on thisController needed
    // console.log(thisController, dLeft, dTop);

    for(key in this.itemTable) {
        thisItem = this.itemTable[key];
        if(thisItem.selected) {
            thisItem.moveRel(dLeft, dTop);
        }
    }

    for(key in this.itemTable) {
        thisItem = this.itemTable[key];
        if( this.insideR1R2(thisItem, cursor) ) {
            thisItem.select();
        } else {
            thisItem.deSelect();
        }
    }
};
/**
 *
 */
WorldManager.prototype.deSelectAll = function () {
    var key;
    for(key in this.itemTable) {
        this.itemTable[key].deSelect();
    }
};
/**
 *
 * @param r1
 * @param cursor
 * returns true if r1 is inside (or edges are the same as) cursor
 * (BUT IT CAN BE ANY RECTANGLE NOT JUST A CURSOR)
 */
WorldManager.prototype.insideR1R2 = function (r1, cursor) {

    var leftR1 = r1.left;
    var rightR1 = r1.left + r1.width;
    var topR1 = r1.top;
    var bottomR1 = r1.top + r1.height;

    var leftCursor = cursor.left;
    var rightCursor = cursor.left + cursor.width;
    var topCursor = cursor.top;
    var bottomCursor = cursor.top + cursor.height;

    return leftR1 >= leftCursor && rightR1 <= rightCursor && topR1 >= topCursor && bottomR1 <= bottomCursor;
};
/**
 * The world bounding blocks surround and slightly overlap the world.
 * They are static and of thickness 50 to stop tunneling of high speed objects.
 * Called in Palette
 */
WorldManager.prototype.createWorldBounds = function () {
    //console.log("createWorldBounds");
    var thickNess = 50;
    var overLap = 10;
    var cssOptions = {'background-color': 'green'};
    var physicalOptions = { isStatic: true, frictionAir: 0};
    var thisBlock;
    this.boundaryIDs = [];

    var thisRect = {left: -thickNess, top: 0 - thickNess + overLap, width: this.worldWidth + 2 * thickNess, height: thickNess}; // top
    thisBlock = this.createBlock(thisRect, cssOptions, physicalOptions);
    this.boundaryIDs.push(thisBlock.id);

    thisRect = {left: -thickNess, top: this.worldHeight - overLap, width: this.worldWidth + 2 * thickNess, height: thickNess}; // bottom
    thisBlock = this.createBlock(thisRect, cssOptions, physicalOptions);
    this.boundaryIDs.push(thisBlock.id);

    thisRect = {left: -thickNess + overLap, top: 0, width: thickNess, height: this.worldHeight + 2 * thickNess}; // left
    thisBlock = this.createBlock(thisRect, cssOptions, physicalOptions);
    this.boundaryIDs.push(thisBlock.id);

    thisRect = {left: this.worldWidth - overLap, top: 0, width: thickNess, height: this.worldHeight + 2 * thickNess}; // right
    thisBlock = this.createBlock(thisRect, cssOptions, physicalOptions);
    this.boundaryIDs.push(thisBlock.id);
};
/**
 * World bounds are optional
 */
WorldManager.prototype.deleteWorldBounds = function () {
    //console.log("deleteWorldBounds ", this.boundaryIDs);
    var n,
        numIDs = this.boundaryIDs.length,
        thisItem, thisID;

    for(n = 0; n < numIDs; n++) {
        thisID = this.boundaryIDs[n];
        thisItem = this.itemTable[thisID];
        thisItem.div.remove();
        delete this.itemTable[thisID];
    }
    this.boundaryIDs = [];
};
/**
 * Deletes the objects that have been selected
 */
WorldManager.prototype.deleteSelection = function () {
    var key, thisItem;
    for(key in this.itemTable) {
        thisItem = this.itemTable[key];
        if(thisItem.selected) {
            thisItem.div.remove();
            delete this.itemTable[key];
        }
    }
};
/**
 * @param valuesTL - there has to be one rocket in the scene so - we get it by default
 */
WorldManager.prototype.createRocket = function (valuesTL) {

    var thisID = 'id_rocket';
    var thisType = "rocket";
    var cssOptions = {'background-color': 'black'};
    var thisItem = new Item(this, thisID, thisType, valuesTL.left, valuesTL.top, valuesTL.width,valuesTL.height, cssOptions, {} );
    this.$canvas.append(thisItem.div);

    this.itemTable[thisID] = thisItem;

    return thisItem;
};














