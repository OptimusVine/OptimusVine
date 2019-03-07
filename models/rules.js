var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var RuleSchema = new mongoose.Schema({
	id: {type: String},
	name: {type: String, required: true, unique: true},
	rule: {}
	})


mongoose.model('Rule', RuleSchema);