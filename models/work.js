var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var WorkSchema = new mongoose.Schema({
	id: {type: String},
	title: {type: String, required: true},
	description: {type: String},
	todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}],
	slack: {
		channel: {type: String},
		people: [{type: String}],
		webhook: {type: String}
	},
	items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
	})

WorkSchema.methods.addWork = function(err) {
	if(this.save()){
	console.log('I saved a job named ' + this.name.full);
}}

mongoose.model('Work', WorkSchema);