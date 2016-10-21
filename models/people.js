var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var PeopleSchema = new mongoose.Schema({
	id: {type: String},
	name: {
		slack: {type: String},
		first: {type: String},
		last: {type: String},
		full: {type: String}
	},
	email: {type: String},
	slackId: {type: String},
	asana_assignee: {type: Number},
	slack: {
		slackId: {type: String},
		webhook: {type: String}
	}
//	routes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Routes'}],

	}) 

PeopleSchema.methods.addPerson = function(err) {
	if(this.save()){
	console.log('I saved a person named ' + this.name.full);
}}

mongoose.model('People', PeopleSchema);