/**
 * Created by Timothy on 01/05/14.
 */
function FileIO (worldManager, saveToDiskButton) {

    this.worldManager = worldManager;

    ////////////////////////// to do with saving a file - not very happy about this
    var defaultFileName = "rocket-matter.js";

    // The json data to export is "padded" with frontPad at the front and backPad at the back
    // so that when imported into the game, the json can be returned by calling the function getWorld()
    this.frontPad = "function getWorld() { return ";
    this.backPad = "; };";

    var self = this;
    saveToDiskButton.downloadify({
        filename: function(){ return defaultFileName; },
        data: function () { return self.stringifyWorld(); },

        onComplete: function(){ console.log('Your File Has Been Saved!'); },
        onCancel: function(){ alert('You have cancelled the saving of this file.'); },
        onError: function(){ alert('You must put something in the File Contents or there will be nothing to save!'); },
        swf: 'media/downloadify.swf',
        downloadImage: 'img/download.png',
        width: 101,
        height: 34,
        transparent: true,
        append: false
    });


    //////////////////////// to do with loading a file
    // The #fileInputElement and #loadWorldButton elements work together to create a Bootstrap styled "choose file" button
    $("#fileInputElement").on('change', function () {

        // the file list "files" contains "File" objects
        var files = this.files;
        var thisFile = files[0];

        var reader = new FileReader();
        reader.readAsText(thisFile);
        reader.onload = function() {
            self.loadWorld(reader.result);
        };

        // so that the input val has changed even if we load the same file again and
        // we therefore make the onchange handler fire again
        $(this).val("");

    });

    $("#loadWorldButton").click(function(){
        $("#fileInputElement").trigger('click');
        return false;
    });

}
/**
 *  returns a stringified and padded JSON description of the world
 */
FileIO.prototype.stringifyWorld = function () {
    var world = this.worldManager.getJSON();
    return this.frontPad + JSON.stringify(world) + this.backPad;
};
/**
 * passed a stringified and padded JSON description of the world, it strips the padding,
 * parses the resultant string it to JSON and passes the result to createNewWorld to instantiate a new world
 */
FileIO.prototype.loadWorld = function (jsonString) {
    var withoutFront = jsonString.substring(this.frontPad.length);
    var withoutEither = withoutFront.substring(0, withoutFront.length - this.backPad.length);
    var jsonObject = $.parseJSON( withoutEither );

    this.worldManager.createNewWorld(jsonObject);
};

























