var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var SourcingSchema = new mongoose.Schema({
	id: {type: Number},
	workspace: {type: Number},
	description: {type: String},
	uri: {type: String},
	plmItem: {type: Object}
	})

mongoose.model('Sourcing', SourcingSchema);