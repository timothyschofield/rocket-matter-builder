/**
 * Created by Timothy on 29/04/14.
 */
function Cursor (worldManager) {
    this.$canvas = $('#canvas');
    this.worldManager = worldManager;

    this.grid = worldManager.grid;
    this.defaultCursorWidth = 100;
    this.defaultCursorHeight = 50;


    this.left = 0;
    this.top = 0;
    this.width = this.defaultCursorWidth;
    this.height = this.defaultCursorHeight;

    this.oldLeft = this.left;
    this.oldTop = this.top;
    this.oldWidth = this.width;
    this.oldHeight = this.height;

    // for clicking on box and resizing and moving
    this.$cursor = $('<div></div>').attr('id', 'cursor').css( {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        position: 'absolute',
        border: '1px dashed red',
        'z-index': 1000,
        visibility: 'hidden',
        'background-color': 'yellow',
        'opacity': 0.3});
    this.$canvas.append(this.$cursor);

    var self = this;
    $(this.$cursor).on('click', function (e) {
        self.dispatchGameEvent('CURSOR_HIDE', {});
        self.hideCursor();
        e.stopPropagation();
    });

    // don't want any events on the cursor propagating to its parent $canvas
    $(this.$cursor).on('click mousedown mouseup', function (e) {
        e.stopPropagation();
    });

    // The $cursor controls
    this.addGameEventListener('CURSOR_SHOW', this.showCursor, this);
    this.addGameEventListener('CONTROL_STARTMOVE', this.startMove, this);
    this.addGameEventListener('CONTROL_STOPMOVE', this.stopMove, this);

    // edges
    this.topC = new Control('top', this, this.moveTop, {}, { axis: "y", xGrid: this.grid, yGrid: this.grid});
    this.bottomC = new Control('bottom', this, this.moveBottom, {}, { axis: "y", xGrid: this.grid, yGrid: this.grid});
    this.leftC = new Control('left', this, this.moveLeft, {}, { axis: "x", xGrid: this.grid, yGrid: this.grid});
    this.rightC = new Control('right', this, this.moveRight, {}, { axis: "x", xGrid: this.grid, yGrid: this.grid});

    // corners
    this.trhcC = new Control('trhc', this, this.moveTRHC, {}, {xGrid: this.grid, yGrid: this.grid});
    this.brhcC = new Control('brhc', this, this.moveBRHC, {}, {xGrid: this.grid, yGrid: this.grid});
    this.blhcC = new Control('blhc', this, this.moveBLHC, {}, {xGrid: this.grid, yGrid: this.grid});
    this.tlhcC = new Control('tlhc', this, this.moveTLHC, {}, {xGrid: this.grid, yGrid: this.grid});

    // center
    this.centerC = new Control('center', this, this.moveCenter, {}, {xGrid: this.grid, yGrid: this.grid});

    this.$canvas.append(this.topC.div);
    this.$canvas.append(this.bottomC.div);
    this.$canvas.append(this.leftC.div);
    this.$canvas.append(this.rightC.div);

    this.$canvas.append(this.trhcC.div);
    this.$canvas.append(this.brhcC.div);
    this.$canvas.append(this.blhcC.div);
    this.$canvas.append(this.tlhcC.div);

    this.$canvas.append(this.centerC.div);
}
Cursor.prototype = Object.create(EventDispatcher.prototype);
Cursor.prototype.constructor = Cursor;
/**
 * on selecting a target Block by clicking
 */
Cursor.prototype.showCursor = function (target) {

    if( !(target instanceof Item) ) {
        this.target = this; // the cursor (we have clicked on the canvas)

        this.left = target.left;
        this.top = target.top;
        this.width = this.width || this.defaultCursorWidth;
        this.height = this.height || this.defaultCursorHeight;
    } else {
        this.target = target;   // a block (we have clicked on a block)
        this.target.select();   // so select it

        this.left = target.left;
        this.top = target.top;
        this.width = target.width;
        this.height = target.height;
    }

    this.$cursor.css({
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        visibility: 'visible'
    });

    this.showControllers(this.target);
};
/**
 *
 */
Cursor.prototype.startMove = function () {
    this.oldLeft = this.left;
    this.oldTop = this.top;
    this.oldWidth = this.width;
    this.oldHeight = this.height;
};
/**
 * position comes from 'ondrag' in the particular Control
 */
Cursor.prototype.moveTop = function (position) {
    this.height = this.target.top + this.target.height - position.top;
    this.top = position.top;
    this.$cursor.css({
       top:  this.top,
       height:  this.height
    });
    this.showControllers(this.target);
};
/**
 * position comes from 'ondrag' in the particular Control
 */
Cursor.prototype.moveBottom = function (position) {
    this.height = position.top - this.target.top;
    this.$cursor.css({
       height:  this.height
    });
    this.showControllers(this.target);
};
/**
 * position comes from 'ondrag' in the particular Control
 */
Cursor.prototype.moveLeft = function (position) {
    this.width = this.target.left + this.target.width - position.left;
    this.left = position.left;
    this.$cursor.css({
        left:  this.left,
        width:  this.width
    });
    this.showControllers(this.target);
};
/**
 * position comes from 'ondrag' in the particular Control
 */
Cursor.prototype.moveRight = function (position) {
    this.width  = position.left - this.target.left;
    this.$cursor.css({
        width:  this.width
    });
    this.showControllers(this.target);
};
/**
 * position comes from 'ondrag' in the particular Control
 */
Cursor.prototype.moveTRHC = function (position) {
    this.moveRight(position);
    this.moveTop(position);
};
/**
 * position comes from 'ondrag' in the particular Control
 */
Cursor.prototype.moveBRHC = function (position) {
    this.moveRight(position);
    this.moveBottom(position);
};
/**
 * position comes from 'ondrag' in the particular Control
 */
Cursor.prototype.moveBLHC = function (position) {
    this.moveLeft(position);
    this.moveBottom(position);
};
/**
 * position comes from 'ondrag' in the particular Control
 */
Cursor.prototype.moveTLHC = function (position) {
    this.moveLeft(position);
    this.moveTop(position);
};
/**
 * position comes from 'ondrag' in the particular Control
 */
Cursor.prototype.moveCenter = function (position) {
    // rounding deals with problem when a blocks height or width (e.g. 130)
    // does not divide evenly, so the middle cursor would be left at 65
    this.top = position.top - Math.round((this.target.height/2)/this.grid ) * this.grid;
    this.left = position.left - Math.round((this.target.width/2)/this.grid ) * this.grid;

    this.$cursor.css({
        top: this.top,
        left: this.left
    });
    this.showControllers(this.target);
};
/**
 *
 */
Cursor.prototype.stopMove = function (controllerId) {

    var left = this.$cursor.position().left;
    var top = this.$cursor.position().top;
    var width = this.$cursor.outerWidth();      // because of the target block's border
    var height = this.$cursor.outerHeight();

    // the target may be a Block that has been clicked on
    // or the cursor if we are moving the cursor around the canvas
    if(this.target.draw) {
        //console.log("Cursor.prototype.stopMove draw Block");
        this.target.draw(left, top, width, height); // <<<<<<<<<<<<<<<<<<<<<<<<<<
    } else {
        //console.log("Cursor.prototype.stopMove CURSOR_MOVE_END");
        this.dispatchGameEvent( 'CURSOR_MOVE_END', {id: controllerId.id, left: left, top: top, width: width, height: height,
                                                        oldLeft: this.oldLeft, oldTop: this.oldTop, oldWidth: this.oldWidth, oldHeight: this.oldHeight } );
    }

    this.showControllers(this.target);
};
/**
 * target is a Block or the cursor
 */
Cursor.prototype.showControllers = function (target) {
    this.topC.show();
    this.topC.moveTo(target, target.left + target.width/2, target.top);
    this.bottomC.show();
    this.bottomC.moveTo(target, target.left + target.width/2, target.top + target.height);
    this.leftC.show();
    this.leftC.moveTo(target, target.left, target.top + target.height/2);
    this.rightC.show();
    this.rightC.moveTo(target, target.left + target.width, target.top + target.height/2);
    this.trhcC.show();
    this.trhcC.moveTo(target, target.left + target.width, target.top);
    this.brhcC.show();
    this.brhcC.moveTo(target, target.left + target.width, target.top + target.height);
    this.blhcC.show();
    this.blhcC.moveTo(target, target.left, target.top + target.height);
    this.tlhcC.show();
    this.tlhcC.moveTo(target, target.left, target.top);
    this.centerC.show();
    this.centerC.moveTo(target, target.left + target.width/2, target.top + target.height/2);
};
/**
 *
 */
Cursor.prototype.hideCursor = function () {
    this.width = this.defaultCursorWidth;
    this.height = this.defaultCursorHeight;
    this.$cursor.css({visibility: 'hidden'});
    this.topC.hide();
    this.bottomC.hide();
    this.leftC.hide();
    this.rightC.hide();
    this.trhcC.hide();
    this.brhcC.hide();
    this.blhcC.hide();
    this.tlhcC.hide();
    this.centerC.hide();
};














