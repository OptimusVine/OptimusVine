var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');
var Promise = require('bluebird')

var Work = mongoose.model('Work') 

var getWorks = function(req, res, next){
	Work.find().populate('todos').exec(function(err, w){
		res.json(w)
	})
}

var addWork = function(work){
	return new Promise(function(resolve, reject){
		console.log(work)
		if(!work){
		//	console.log("Nothing Here")
			reject("Nothing Here")
			} else {

			var w = new Work(work)
			w.save(function(err, result){
		//		res.send(result) // should either send or resolve
				resolve(result); // not both
			});
		}
	})	
}

var postWork = function(req, res, next){
	var response
	console.log(req.body)
	if(!req.body){
		res.send({message: "No Work listed on request"})
	} else if (!req.body.work.title){
		var msg = "Not all required fields lists"
		response = {
			work: req.body,
			message: msg,
			error: msg,
			reqFields: ['Title']
		}
		res.send(response)
	} else {
		addWork(req.body.work).then(function(w){
			res.send(w)
		}).catch(function(err){
			console.log("ERROR ON ADD WORK")
			console.log(err)
			response = {
				message: "Error on Add Work",
				error: err
			}
			res.send(response)
		})
	}
}

var addTodoToWork = function(req, res){
	console.log("AM I HERE!?")
	console.log(req.body)
	if(!req.todo){
		res.send({message: "No Todo"})
	} else if (!req.work){
		res.send({message: "No Work"})
	} else {
		req.work.todos.push(req.todo)
		req.work.save(function(err, result){
			res.send({message: "Todo has been saved"})
		})
		
	}
}

module.exports = {
	addTodoToWork: addTodoToWork,
	addWork: addWork,
	getWorks: getWorks,
	postWork: postWork
}