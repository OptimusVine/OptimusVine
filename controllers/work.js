var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');
var Promise = require('bluebird')

var Work = mongoose.model('Work') 

var getWorks = function(req, res, next){
	Work.find(function(err, Work){
		res.json(Work)
	})
}

var addWork = function(req, res, next){
	return new Promise(function(resolve, reject){
		if(!req.work){
			console.log("Nothing Here")
			reject("Nothing Here")
			} else {

			var w = req.work
			var work = new Work(w)

			work.save(function(err, result){
				res.send(result) // should either send or resolve
				resolve(result); // not both
			});
		}
	})	
}

module.exports = {
	addWork: addWork,
	getWorks: getWorks
}