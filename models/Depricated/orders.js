var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
	id: {type: String},
	name: {type: String},
	tech: {type: String}, // Eventually make this a Mongoose Schema
	day: {type: String}, // regular day of the week
	status: {type: String}, // If its active, inactive, completed, pending, etc
	scheduleDate: {type: Date},
	originalDate: {type: Date},
	comments: {type: String}, 
    sites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site'}],
    places: {type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place'}], required: true}
	})

OrderSchema.methods.addSite = function(req, err) {
	site = req.site;
	if(this.sites.push(site)){
		console.log(site + " has been added to route : " + this.id)
		this.save();
		return this;
	}
}

mongoose.model('Order', OrderSchema);