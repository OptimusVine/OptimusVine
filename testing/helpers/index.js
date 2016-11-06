var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var peopleHelper = require('./people.js')
var sites = require('./sites.js')
var routes = require('./routes.js')
var work = require('./work.js')
