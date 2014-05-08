/**
 * Created by Timothy on 29/04/14.
 */
/**
 * @param worldManager
 * @param id
 * @param left
 * @param top
 * @param width
 * @param height
 * @param cssOptions
 * @param physicalOptions
 * @constructor
 */
function Item (worldManager, id, type, left, top, width, height, cssOptions, physicalOptions) {

    this.worldManager = worldManager;
    this.id = id;
    this.type = type;
    this.defaultPhysicalOptions = {frictionAir: 0.01, friction: 0.1};
    this.physicalOptions = $.extend(this.defaultPhysicalOptions, physicalOptions);
    this.grid = this.worldManager.grid;
    this.selected = false;

    if(this.grid) {
        this.left = Math.round( left/this.grid ) * this.grid;
        this.width = Math.round( width/this.grid ) * this.grid;
        this.top = Math.round( top/this.grid ) * this.grid;
        this.height = Math.round( height/this.grid ) * this.grid; // + Math.random() * 3;
    } else {
        this.left = left;
        this.width = width;
        this.top = top;
        this.height = height;
    }

    this.div = $('<div></div>').attr('id', this.id).css({
        position: 'absolute',
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height
    });

    this.defaults = {
        'background-color': 'red',
        'border':'1px solid black'};

    this.options = $.extend(this.defaults, cssOptions);
    this.div.css(this.options);

    // Click on the block
    var self = this;
    $(this.div).on('click', function (e) {
        self.dispatchGameEvent('CURSOR_SHOW', self);    // the cursor will select the block
        e.stopPropagation();
    });

    // don't want any events on the cursor propagating to its parent $canvas
    $(this.div).on('mousedown mouseup', function (e) {
        e.stopPropagation();
    });

}   // eo constructor
Item.prototype = Object.create(EventDispatcher.prototype);
Item.prototype.constructor = Item;
/**
 *
 * @param left
 * @param top
 * @param width
 * @param height
 * Called in Controller.stopMove
 */
Item.prototype.draw = function (left, top, width, height) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.div.css({
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height
    });
};
/**
 *
 */
Item.prototype.getJSON = function () {
    return {id: this.id,
            type: this.type,
            rect: {
                'left': this.left,
                'top': this.top,
                'width': this.width,
                'height': this.height
                 },
            'cssOptions': this.options,
            'physicalOptions': this.physicalOptions
            }
};
/**
 *
 */
Item.prototype.select = function () {
    this.div.css( {'border':'2px dashed black'} );
    this.selected = true;
};
/**
 *
 */
Item.prototype.deSelect = function () {
    this.div.css( {'border':'1px solid black'} );
    this.selected = false;
};
/**
 *
 */
Item.prototype.move = function (newLeft, newTop) {
    this.left = newLeft;
    this.top = newTop;
    this.div.css({
        left: this.left,
        top: this.top
    });
};
/**
 *
 */
Item.prototype.moveRel = function (dLeft, dTop) {
    this.left += dLeft;
    this.top += dTop;
    this.div.css({
        left: this.left,
        top: this.top
    });
};

















