var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var WorkSchema = new mongoose.Schema({
	id: {type: String},
	title: {type: String, required: true},
	description: {type: String},
	status: {
		complete: {type: Boolean, default: false, required: true},
		stage: {type: String, default: "Unstarted", required: true}
	},
	todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ToDo'}],
	services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service'}],
	orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
	routes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Route'}],
	communication:{
		slack: {
		channel: {type: String},
		people: [{ type: mongoose.Schema.Types.ObjectId, ref: 'People'}],
		webhook: {type: String}
	}},
	items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
	})

WorkSchema.methods.addWork = function(err) {
	if(this.save()){
	console.log('I saved a job named ' + this.name.full);
}}

mongoose.model('Work', WorkSchema);