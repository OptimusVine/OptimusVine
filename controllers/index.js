var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

// This file is a single spot where I would call controllers, its currently not in use

var peopleController = require('./controllers/people')
var workController = require('./controllers/work.js')