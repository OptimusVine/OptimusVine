var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
	id: {type: Number},
	rank: {type: String, required: true, default: 'a'},
	workspace: {type: Number},
	type: {type: String, required: true},
	description: {type: String},
	uri: {type: String},
	plmItem: {type: Object}
	})

mongoose.model('Item', ItemSchema);