/**
 * Created by Timothy on 25/04/14.
 */
/*
 var test = {};
 var key;
 test.one = "111";
 test.two = "222";
 test.three = "333";

 var x = test.two;

 for(key in test) {
 console.log(key, test[key]);
 }

 // delete x;                // no
 // delete test.two;         // yes
 // delete test["two"];      // yes

 for(key in test) {
 console.log(key, test[key]);
 }
 */
function App () {
    this.worldManager = new WorldManager();

    this.canvas = new Canvas(this.worldManager);
    this.cursor = new Cursor(this.worldManager);
    this.palette = new Palette(this.worldManager);

}   // eo constructor
App.prototype = Object.create(EventDispatcher.prototype);
App.prototype.constructor = App;
/**
 *
 */
App.prototype.init = function () {
};





































