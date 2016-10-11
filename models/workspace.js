var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var WorkspaceSchema = new mongoose.Schema({
	id: {type: Number},
	category: {type: String},
	label: {type: String},
	uri: {type: String}
	})

mongoose.model('Workspace', WorkspaceSchema);