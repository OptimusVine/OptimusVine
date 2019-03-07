var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var TeeSchema = new mongoose.Schema({
    data: {type: String, required: true},
    created: {type: Date},
	action: {needed: Boolean, description: String},
	summary: {type: String},
	sherman: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sherman'}],
	complete: {type: Boolean}
});

/*
TeeSchema.methods.addToDo = function(err) {
	if(this.save()){
		console.log('A ToDo has been saved to the DB named : ' + this.name);
		}
} */
 
TeeSchema.methods.add = function(cb) {
	this.create = new Date()
	this.save(cb);
}

mongoose.model('Tee', TeeSchema);