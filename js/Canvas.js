/**
 * Created by Timothy on 30/04/14.
 */
function Canvas (worldManager) {

    this.$canvas = $('#canvas');
    this.worldManager = worldManager;

    this.canvasWidth = this.worldManager.worldWidth;
    this.canvasHeight = this.worldManager.worldHeight;
    this.grid = this.worldManager.grid;

    this.drawGrid();

    var self = this;
    $(this.$canvas).on('click', function (e) {
        var thisX = Math.round(e.offsetX/self.grid) * self.grid;
        var thisY = Math.round(e.offsetY/self.grid) * self.grid;

        // because we don't want a selection to remain or move as a result
        // of the cursor moving because of a palette click
        // We only want them to move when one of the Controls cause the cursor to move (or resize)
        self.dispatchGameEvent('CURSOR_SHOW', {left: thisX, top: thisY});
    });

}   // eo constructor
Canvas.prototype = Object.create(EventDispatcher.prototype);
Canvas.prototype.constructor = Canvas;
/**
 * Just for visuals
 */
Canvas.prototype.drawGrid = function () {

    var canvasHeightRoundUp = Math.ceil(this.canvasHeight/this.grid) * this.grid;
    var canvasWidthRoundUp = Math.ceil(this.canvasWidth/this.grid) * this.grid;

    this.$backgroundGrid = $('<div></div>').attr('id', 'backgroundGrid').css({
        overflow: 'hidden',
        height: canvasHeightRoundUp,
        width: canvasWidthRoundUp,
        opacity: 0.2,
        'pointer-events': 'none'
    });
    this.$canvas.append(this.$backgroundGrid);

    var horizLine =  $('<div></div>').css({
        height: this.grid + 'px',
        width: canvasWidthRoundUp + 'px',
        'border-bottom': '1px solid',
        'pointer-events': 'none'
    });

    var numHoriz = canvasHeightRoundUp/this.grid;
    var n;
    for(n = 0; n < numHoriz; n++ ) {
        horizLine.clone().appendTo(this.$backgroundGrid);
    }

    var vertLine =  $('<div></div>').css({
        position: 'relative',
        top: -canvasHeightRoundUp + 'px',
        float: 'left',
        height: canvasHeightRoundUp,
        width: this.grid + 'px',
        'border-left': '1px solid',
        'pointer-events': 'none'
    });

    var numVert = canvasWidthRoundUp/this.grid;
    var n;
    for(n = 0; n < numVert; n++ ) {
        vertLine.clone().appendTo(this.$backgroundGrid);
    }

};
