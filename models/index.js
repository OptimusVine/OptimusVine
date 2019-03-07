var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

// This calls all of the models
// It is called from the main app.js page to load all of the models into Mongoose


var people = require('./people.js')

var todo = require('./todo.js')
var tee = require('./tee.js')
var user = require('./user.js')
var sherman = require('./sherman.js')
var webhook = require('./webhook.js')
