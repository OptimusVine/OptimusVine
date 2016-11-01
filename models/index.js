var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

// This calls all of the models
// It is called from the main app.js page to load all of the models into Mongoose

var item = require('./items.js')
var people = require('./people.js')
var production = require('./production.js')
var route = require('./route.js')
var site = require('./site.js')
var sourcing = require('./sourcing.js')
var todo = require('./todo.js')
var user = require('./user.js')
var webhook = require('./webhook.js')
var work = require('./work.js')
var _process = require('./process.js')
var workspace = require('./workspace.js')