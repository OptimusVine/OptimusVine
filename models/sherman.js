var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var ShermanSchema = new mongoose.Schema({
    name: {type: String, required: true},
    days: {type: Array, required: false},
    datalink: {type: String},
    slackChannel: {type: String},
    owner: {type: String},
    complete: {type: Boolean},
    summary: {type: String},
    tees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tee'}]
});

ShermanSchema.methods.addToDo = function(err) {
	if(this.save()){
		console.log('A Sherman has been saved to the DB named : ' + this.name);
		}
}
 
ShermanSchema.methods.completeIt = function(cb) {
	this.complete = true;
	this.save(cb);
}

mongoose.model('Sherman', ShermanSchema);