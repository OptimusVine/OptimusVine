var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var siteControlller = require('../controllers/sites')

var mongoose = require('mongoose')
var Site = mongoose.model('Work')