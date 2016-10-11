var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

// This calls all of the models
// It is called from the main app.js page to load all of the models into Mongoose

var people = require('./people.js')
var site = require('./site.js')
var route = require('./route.js')
var work = require('./work.js')
var todo = require('./todo.js')
var item = require('./items.js')
var workspace = require('./workspace.js')
var sourcing = require('./sourcing.js')
var production = require('./production.js')
var workflow = require('./workflow.js')