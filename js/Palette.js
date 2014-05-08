/**
 * Created by Timothy on 30/04/14.
 */
function Palette (worldManager) {

    this.$palette = $('#palette');

    this.worldManager = worldManager;
    this.grid = worldManager.grid;
    this.defaultColour = "#ff0000"; // default for the colour picker
    this.currentColour = this.defaultColour;

    this.defaultPhysicalOptions = {isStatic: false};

    this.keys = this.worldManager.keys;
    this.keys.addGameEventListener(Keys.KEYDOWN, this.doKeyboardAction, this);

    this.init();

    function roundAndConstrain($inputElement, grid) {
        var newValue = Math.round( parseInt( $inputElement.val() )/grid) * grid;
        $inputElement.val(newValue);
        return newValue;
    }

    // The FILE INPUT/OUTPUT BUTTONS
    this.fileIO = new FileIO(this.worldManager, $('#saveToDiskButton'));

    var self = this;
    // The create block BUTTON
    $('#createBlockButton').on('click', function () {
        var blockXY = self.getValuesXY();
        var blockTL = {left: blockXY.x, top: self.worldManager.worldHeight - blockXY.y - blockXY.height, width: blockXY.width, height: blockXY.height};
        var theseCSSOptions = self.getCSSOptions();

        self.worldManager.createBlock( blockTL, theseCSSOptions, self.defaultPhysicalOptions);

        self.currentSumDX += self.currentDX;
        self.currentSumDY += self.currentDY;
        $('#sumDX').val(self.currentSumDX);
        $('#sumDY').val(self.currentSumDY);
        self.displayBlockSize();
    });

    // The static CHECKBOX - makes a block static
    $('input[id=staticCheckbox]').on('change', function () {
        if( $(this).prop('checked') ) {
            self.defaultPhysicalOptions['isStatic'] = true;
            self.currentColour = "#ccc";
        } else {
            self.defaultPhysicalOptions['isStatic'] = false;
            self.currentColour = $('input[id=inputColour]').val();
        }
    });

    // The delete selection BUTTON
    $('#deleteBlockButton').on('click', function () {
        self.worldManager.deleteSelection();
    });

    $('#resetSumDXButton').on('click', function () {
        self.currentSumDX = 0;
        $('#sumDX').val(self.currentSumDX);
    });

    $('#resetSumDYButton').on('click', function () {
        self.currentSumDY = 0;
        $('#sumDY').val(self.currentSumDY);
    });

    // All this is to get around an apparent bug in the colourpicker.
    // The picker seems to default back to black when it first gains (or regains) focus but
    // we want it always to remember the last colour selected.
    $('input[id=inputColour]').on('change', function() {
        self.currentColour = $(this).val();
    });
    $('input[id=inputColour]').on('focus', function() {
        $(this).val(self.currentColour);
    });
    $('input[id=inputColour]').trigger('focus'); // to setup the colour picker to the default


    // TEXT dimensions for the Block
    $('input[id=inputX]').on('change', function() {
        self.currentX = roundAndConstrain($(this), self.grid);
    });

    $('input[id=inputY]').on('change', function() {
        self.currentY = roundAndConstrain($(this), self.grid);
    });

    $('input[id=inputW]').on('change', function() {
        self.currentW = roundAndConstrain($(this), self.grid);
    });

    $('input[id=inputH]').on('change', function() {
        self.currentH = roundAndConstrain($(this), self.grid);
    });

    $('input[id=inputDX]').on('change', function() {
        var oldVal = self.currentDX;
        self.currentDX = roundAndConstrain($(this), self.grid);
        self.currentSumDX += (self.currentDX - oldVal);
        $('#sumDX').val(self.currentSumDX);
    });

    $('input[id=inputDY]').on('change', function() {
        var oldVal = self.currentDY;
        self.currentDY = roundAndConstrain($(this), self.grid);
        self.currentSumDY += (self.currentDY - oldVal);
        $('#sumDY').val(self.currentSumDY);
    });

    $('input').on('change', function() {
        self.displayBlockSize();
    });

    // The world bounds checkbox, create or destroy the world bounds
    if($('#worldBounds').prop('checked')) {
        this.worldManager.createWorldBounds();
    }
    $('input[id=worldBounds]').on('change', function () {
        if($(this).prop('checked')) {
            self.worldManager.createWorldBounds();
        } else {
            self.worldManager.deleteWorldBounds();
        }
    });


}   // eo constructor
Palette.prototype = Object.create(EventDispatcher.prototype);
Palette.prototype.constructor = Palette;
/**
 *
 */
Palette.prototype.init = function () {

    this.defaultX = 10;
    this.defaultY = 10;
    this.currentX = this.defaultX;
    this.currentY = this.defaultY;
    $('#inputX').val(this.currentX);
    $('#inputY').val(this.currentY);

    this.defaultDX = 20;
    this.defaultDY = 0;
    this.currentDX = this.defaultDX;
    this.currentDY = this.defaultDY;
    $('#inputDX').val(this.currentDX);
    $('#inputDY').val(this.currentDY);

    this.currentSumDX = 0;
    this.currentSumDY = 0;
    $('#sumDX').val(this.currentSumDX);
    $('#sumDY').val(this.currentSumDY);

    this.defaultW = 10;
    this.defaultH = 100;
    this.currentW = this.defaultW;
    this.currentH = this.defaultH;
    $('#inputW').val(this.currentW);
    $('#inputH').val(this.currentH);

   this.displayBlockSize();
};
/**
 *
 */
Palette.prototype.doKeyboardAction = function (eventData) {

    var keys = this.keys.getKeysDown();
    //console.log(keys);

    if(keys.Delete) {
        this.worldManager.deleteSelection();
    }

};
/**
 *
 */
Palette.prototype.getValuesXY = function () {
    return {
        'x': this.currentX + this.currentSumDX,
        'y': this.currentY + this.currentSumDY,
        'width': this.currentW,
        'height': this.currentH
    };
};
/**
 *
 */
Palette.prototype.getCSSOptions = function () {
    return {'background-color': this.currentColour };
};
/**
 *
 */
Palette.prototype.displayBlockSize = function () {
    $('#blockSize').text(
            'x:' + (this.currentX + this.currentSumDX) + ", " +
            'y:' + (this.currentY + this.currentSumDY) + ", " +
            'width:' + this.currentW + ", " +
            'height:' + this.currentH);

};