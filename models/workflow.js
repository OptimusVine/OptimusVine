var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var WorkflowSchema = new mongoose.Schema({
	id: {type: Number},
	stateName: {type: String},
	stateId: {type: Number},
	type: {type: String},
	workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace'},
	description: {type: String},
	uri: {type: String},
	precededBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workflow'}],
	followedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workflow'}]
	})

mongoose.model('Workflow', WorkflowSchema);