var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var SiteSchema = new mongoose.Schema({
	id: {type: String},
	name: {type: String},
	nextDate: {type: Date},
	address: {
		street: {type: String},
		stree2: {type: String},
		city: {type: String},
		state: {type: String},
		zip: {type: String},
		zipPlusFour: {type: String}
	},
	routes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Routes'}]
})

SiteSchema.methods.addSite = function(err) {
	if(this.save()){
	console.log('I saved site number ' + this.id);
}}

mongoose.model('Site', SiteSchema);