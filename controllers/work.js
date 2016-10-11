var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var Work = mongoose.model('Work') 

exports.getWorks = function(req, res, next){
	Work.find(function(err, Work){
		res.json(Work)
	})
}

exports.addWork = function(req, res, next){
	p = {id: 1,
		name: {
			first: "Kjiel",
			last: "Carlson"
			}
		}

	var work = new Work(p)

	work.save(function(err, result){
		res.json(result);
	});
}