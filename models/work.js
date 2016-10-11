var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var WorkSchema = new mongoose.Schema({
	id: {type: String},
	name: {
		first: {type: String},
		last: {type: String},
		full: {type: String}
	}
//	routes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Routes'}],

	})

WorkSchema.methods.addWork = function(err) {
	if(this.save()){
	console.log('I saved a job named ' + this.name.full);
}}

mongoose.model('Work', WorkSchema);