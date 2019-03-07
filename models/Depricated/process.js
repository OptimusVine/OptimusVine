var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var ProcessSchema = new mongoose.Schema({
	id: {type: Number},
	stateName: {type: String},
	stateId: {type: Number},
	type: {type: String},
	count: {type: Number},
	countChildren: {type: Number},
	workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace'},
	description: {type: String},
	uri: {type: String},
	precededBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Process'}],
	children: [{type: mongoose.Schema.Types.ObjectId, ref: "Process"}],
	followedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Process'}]
	})

mongoose.model('Process', ProcessSchema);