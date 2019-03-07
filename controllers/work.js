var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');
var Promise = require('bluebird')

var Work = mongoose.model('Work') 

var getWorks = function(req, res, next){
	Work.find().populate('todos').populate('items').exec(function(err, w){
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

var completeWork = function(req, res){
	if(!req.work){
		res.send({message: "No Work"})
	} else {
		req.work.status = {complete: true, stage: "Finished"}
		req.work.save(function(err, result){
			if(err){
				res.send({message: "Error on Completing Work"})
			} else {
				res.send({message: "Work is " + result.status.stage})
			}
		})
	}
}

var addItemToWork = function(req, res){
	if(!req.item){
		res.send({message: "No Item"})
	} else if (!req.work){
		res.send({message: "No Work"})
	} else if ( checkForDup(req.work.items, req.item) != -1 ){
		res.send({message: "Already Exists in Record"})
	} else {
		req.work.items.push(req.item)
		req.work.save(function(err, result){
			if(err){
				res.send({message: "Error on Saving Item to Work"})
			} else {
				res.send({message: "Item has been saved"})
			}
		})
	}
}

var addTodoToWork = function(req, res){
	if(!req.todo){
		res.send({message: "No Todo"})
	} else if (!req.work){
		res.send({message: "No Work"})
	} else if( checkForDup(req.work.todos, req.todo) != -1 ){ 
		res.send({message: "Already Exists in Record"})
	}else{
		req.work.todos.push(req.todo)
		req.work.save(function(err, result){
			if(err){
				res.send({message: "Error on Saving Todo to Work"})
			} else {
				res.send({message: "Todo has been saved"})
			}
		})
	}
}

var checkForDup = function(array, obj){
	var pos = array.indexOf(obj._id);
	return pos
}

module.exports = {
	addTodoToWork: addTodoToWork,
	addItemToWork: addItemToWork,
	addWork: addWork,
	completeWork: completeWork,
	getWorks: getWorks,
	postWork: postWork
}