/**
 * Created by Timothy on 29/04/14.
 * origin tlhc
 * +ve y is down
 * +ve x is right
 */
function Control (id, callBackContext, myCallback, cssOptions, controlOptions) {

    this.id = id;
    this.controlOptions = controlOptions;

    this.xGrid = this.controlOptions.xGrid || 10;
    this.yGrid = this.controlOptions.yGrid || 10;

    this.left = 0;       // relative to the parent container
    this.top = 0;         // relative to the parent container
    this.myCallback = myCallback;
    this.callBackContext = callBackContext;
    this.width = 10;
    this.height = 10;

    this.div = $('<div></div>').attr('id', this.id).css({
        position: 'absolute',
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        'z-index':2000,
        visibility: 'hidden'
    });

    // stops a click going through to the canvas and repositioning the cursor
    this.div.on('click', function (e) {
        e.stopPropagation();
    });

    this.defaults = {
        'background-color': 'yellow',
        opacity: 0.9,
        border: '1px solid black'
    };
    this.options = $.extend(this.defaults, cssOptions);
    this.div.css(this.options);

   this.div.draggable(); //this.controlOptions); // causes too may headaches

    var self = this;
    this.div.on('dragstart', function (e) {
        self.dispatchGameEvent('CONTROL_STARTMOVE', {});
    });

    this.div.on('drag', function (e) {
        var position = $(this).position();
        var posLeft = Math.round( position.left/self.xGrid ) * self.xGrid;
        var posTop = Math.round( position.top/self.yGrid ) * self.yGrid;
        self.myCallback.call(self.callBackContext, {left: posLeft, top: posTop});
    });

    this.div.on('dragstop', function (e) {
        self.dispatchGameEvent('CONTROL_STOPMOVE', {id: self.id });
       e.stopPropagation();
    });

}
Control.prototype = Object.create(EventDispatcher.prototype);
Control.prototype.constructor = Control;
/**
 * Called in Controller.showControllers
 */
Control.prototype.moveTo = function (target, left, top) {

    // check that the drag does not cause the target to go 'inside out'
    // depends on which control is being dragged
    this.left = left;
    this.top = top;
    this.div.css({
        left: this.left,
        top: this.top
    });
};
/**
 *
 */
Control.prototype.show = function () {
    this.div.css({ visibility: 'visible' });
};
/**
 *
 */
Control.prototype.hide = function () {
    this.div.css({ visibility: 'hidden' });
};
















