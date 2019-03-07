var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)
var logger = require('../kj_modules/logger')

var mongoose = require('mongoose');

var Sherman = mongoose.model('Sherman') 
var Tee = mongoose.model('Tee') 


var getShermans = function(req, res, next){
	logger.event('Requesting Shermans')
	Sherman.find({}).populate({
		path: 'tees',
		limit: 5
	})
		.exec(function(err, shermans){
        res.json(shermans)
    })
}

var createSherman = function(req, res, next){
	logger.result('Creating Sherman', req.body)
	if(!req.body.name){res.status(400).send('Something broke!')}
		else {
			var s = new Sherman(req.body)
			s.save(function(err, sherman){
				res.send(sherman)
			})		
		}
}

var newTee = function(req, res){
	var t = new Tee(req.body)
	t.sherman = req.sherman
	t.created = new Date()
	t.save(function(err, tee){
		if (err){logger.result("Error at Tee Save", err)}
		req.sherman.tees.push(tee)
		req.sherman.save(function(err, sh){
			logger.result('Attempting to save Sherman after entering Tee', sh)
		})
		res.send(tee)
	})
}

var postTee = function ( req, res, next){
	logger.result('Adding Tee', req.body)
	if(!req.sherman || !req.body.data){res.status(400).send('Something broke!')}
	else {
		var d = new Date();
		d.setHours(0,0,0,0);
		var dp1 = new Date();
		dp1.setHours(24,0,0,0);
		var q = {
			created: {
				$gte: d,
				$lt: dp1
			}	
		}
		console.log(d)
		console.log(dp1)
		Tee.find(q)
			.populate('sherman')
			.exec(function(err, tees){
				console.log(tees)
				logger.result("Looking for same day tees", tees)
				if(err){res.send({error: "error on find based on date"})}
				else if (tees.length < 1 || !tees){ // If this is the first Sherman of the day
					var t = new Tee(req.body)
					t.sherman = req.sherman
					t.created = new Date()
					t.save(function(err, tee){
						if (err){logger.result("Error at Tee Save", err)}
						req.sherman.tees.push(tee)
						req.sherman.save(function(err, sh){
							logger.result('Attempting to save Sherman after entering Tee', sh)
						})
						res.send(tee)
					})	
				} else { // If other work has been done today
					logger.result("Looking for Tee with Sherman: ", req.sherman._id)
					var rs_id = req.sherman._id
					var foundTee = 0
					for(i=0;i<tees.length;i++){
						for(j=0;j<tees[i].sherman.length;j++){
							if(new String(tees[i].sherman[j]._id).trim() == new String(req.sherman._id).trim()){
								foundTee = tees[i]
							}
						}
					}
					if (foundTee == 0){
						newTee(req, res)
					} else {
						logger.result("Found existing dtstamp", foundTee)
						foundTee.data += '::' + req.body.data
						foundTee.save(function(err, tee){
							res.send(tee)
						})
					}

					
				}
			})
	}
}




var getTees = function(req, res, next){
	logger.event('Requesting Tees')
    Tee.find(function(err, tees){
        res.json(tees)
    })
}

/*
var getTodos = function(req, res, next){
	ToDo.find(function(err, todos){
		res.json(todos)
	})
}



var postTodos = function(req, res, next){
	if(!req.body.name){res.status(400).send('Something broke!');
		} else {
			console.log(req.body)
			t = new ToDo(req.body)
			console.log(t)	
			if (!t.asana_assignee){t.asana_assignee = {id: null}}
			if (!t.summary){t.summary = ""}
	
			asana.createTask(t).then(function(data){
				t.asana_id = data.id;
				return(t)
			}).then(function(t){
				t.save(function(err, todo){
					res.send(todo)
				})
			})
		}
	

}

var completeToDo = function(req, res, next){
	asana.completeTask(req).then(function(task){
		console.log(task)
		res.send(task)
	})
}

// Pulls all incomplete tasks based on the hardcoded list
// calls a function in the asana file to grab project list one by one
var pullIncompleteTasks = function(req, res){
	projects = [1112103529453402,1112255175085630]
	res.json({message:"Starting Task Download", count: projects.length, projects: projects})
	projectCount = 0
	resultCount = 0
	results = []
	forPush = []
	console.log("*** Pulling tasks for " + projects.length + " projects ***")
	for(i=0;i<projects.length;i++){
		asana.pullIncompleteTasks(projects[i]).then(function(tasks){
			console.log(tasks)
			for(j=0;j<tasks.length;j++){
				results.push(tasks[j])
			}
		}).then(function(){
			projectCount++
			if(projectCount == projects.length){
				
			//	console.log("They are equal")
				for(k=0;k<results.length;k++){
					var r = results[k]
				//	console.log(r)
					asana.processDownloadedTask(r).then(function(task){
						resultCount++
						forPush.push(task)
						if (results.length == resultCount){
						//	console.log(forPush)
							console.log(resultCount + " turned into " + forPush.length)
					//		res.send(forPush)
						}
					}).catch(function(err){
					//	console.log(err)
						resultCount++
						if (results.length == resultCount){
						//	console.log(forPush)
							console.log(resultCount + " turned into " + forPush.length)
					//		res.send(forPush)
						}
					})
				}
			}
		//	console.log(results)
		})

	}	
}

var getTodoStories = function(req, res){
	asana.getStories(req).then(function(stories){
		var comments = []
		for(i=0;i<stories.length;i++){
			if(stories[i].type == 'comment'){
				comments.push(stories[i])
			}
		}
		res.send(comments)
	})
}

// When called, pull an update on all tasks showing incomplete in DB
// Goes Tasks by Task, pulling the update from Asana, updating to DB
// At end, returns all tasks in Response
var updateIncompleteTasks = function(req, res){
	var list = []
	ToDo.find({"complete":false}, function(err, results){
		console.log(results.length + " items found as incomplete, preparing to update")
		for(i=0;i<results.length;i++){
		//	console.log(results)
			asana.updateTask(results[i]).then(function(result){
				list.push(result)
		//		console.log(result.name + " is currently : " + result.complete)
				if(list.length == results.length){
		//			console.log("Full")
					console.log(list.length + " items updated, sending respose")
					res.send(list)
				}
			})
		}
	})	
 }


var pullTodos = function(req, res){
	asana.pullTasks(req, res).then(function(tasks){
		console.log(tasks.length + " Tasks received, preparing to process")
		return processDownloadedTask(tasks)
	}).then(function(processedTodos){
		console.log("ToDos processed, preparing to process")
		res.send(processedTodos)
	})
}

var pullFullTask = function(req, res){
	console.log(req.todo._id)
	asana.updateTask(req, res)
}

var todoPutByIdAssign = function(req, res){
	console.log(req.assignee + ", please assignt to task " + req.todo)
	asana.assignTask(req, res)
}


var processDownloadedTask = function(tasks){
	processedTodos = []
	console.log("I am in : processDownloadedTask")
	return new Promise(function(resolve){
		for(i=0; i<tasks.length; i++){
			asana.processDownloadedTask(tasks[i]).then(function(todo){
				console.log(todo._id)
				processedTodos.push(todo)
				if(processedTodos.length == tasks.length){
					console.log('Todos length : ' + processedTodos.length)
					resolve(processedTodos)
				}
			})
		}
	})
}
*/

module.exports = {
	createSherman: createSherman,
	getShermans: getShermans,
	getTees: getTees,
	postTee: postTee
}