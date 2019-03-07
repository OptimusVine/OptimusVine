var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var ToDoSchema = new mongoose.Schema({
	name: {type: String, required: true},
	action: {needed: Boolean, description: String},
	summary: {type: String},
	dateAdded: {type: Date}, // Set default to "NOW"
	dateLastUpdate: {type: Date},
	dateDue: {type: Date},
	dateCompleted: {type: Date},
	owner_id: String,
	complete: {type: Boolean, default: false},
	asana_id: {type: Number, unique: true},
	asana_assignee: {type: Object},
	projects: {type: Object},
	critical: {type: Boolean}
});

ToDoSchema.methods.addToDo = function(err) {
	if(this.save()){
		console.log('A ToDo has been saved to the DB named : ' + this.name);
		}
}
 
ToDoSchema.methods.completeIt = function(cb) {
	this.complete = true;
	this.save(cb);
}

mongoose.model('ToDo', ToDoSchema);