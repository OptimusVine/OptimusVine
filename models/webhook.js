var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var WebhookSchema = new mongoose.Schema({
	id: {type: Number},
	slackId: {type: String},
	webhook: {type: String},
	})

mongoose.model('Webhook', WebhookSchema);