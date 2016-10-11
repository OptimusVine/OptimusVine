var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var ToDo = mongoose.model('ToDo')

var asana = require('../middlewares/asana/tasks');

exports.getTodos = function(req, res, next){
	ToDo.find(function(err, todos){
				res.json(todos)
	})
}

exports.postTodos = function(req, res, next){
	if(!req.body.name){res.status(400).send('Something broke!');
		} else {
			//console.log("Body received: " + req.body)
			t = new ToDo(req.body)
			if (!t.assignee){t.asana_assignee = {id: null}}
			if (!t.summary){t.summary = ""}
			console.log(t)		
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

exports.completeToDo = function(req, res, next){
	asana.completeTask(req).then(function(task){
		console.log(task)
		res.send(task)
	})
}

// Pulls all incomplete tasks based on the hardcoded list
// calls a function in the asana file to grab project list one by one
exports.pullIncompleteTasks = function(req, res){
	projects = [159790025348212, 168506215476292, 88419022206391]
	projectCount = 0
	resultCount = 0
	results = []
	forPush = []

	for(i=0;i<projects.length;i++){
		asana.pullIncompleteTasks(projects[i]).then(function(tasks){
			console.log("Tasks Length: " + tasks.length)
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
							res.send(forPush)
						}
					}).catch(function(err){
					//	console.log(err)
						resultCount++
						if (results.length == resultCount){
						//	console.log(forPush)
							console.log(resultCount + " turned into " + forPush.length)
							res.send(forPush)
						}
					})
				}
			}
		//	console.log(results)
		})

	}	
}

// When called, pull an update on all tasks showing incomplete in DB
// Goes Tasks by Task, pulling the update from Asana, updating to DB
// At end, returns all tasks in Response
exports.updateIncompleteTasks = function(req, res){
	var list = []
	ToDo.find({"complete":false}, function(err, results){
		for(i=0;i<results.length;i++){
		//	console.log(results)
			asana.updateTask(results[i]).then(function(result){
				list.push(result)
				console.log(result.name + " is currently : " + result.complete)
				if(list.length == results.length){
					console.log("Full")
					console.log(list)
					res.send(list)
				}
			})
		}
	})	
}


exports.pullTodos = function(req, res){
	asana.pullTasks(req, res).then(function(tasks){
		console.log(tasks.length + " Tasks received, preparing to process")
		return processDownloadedTask(tasks)
	}).then(function(processedTodos){
		console.log("ToDos processed, preparing to process")
		res.send(processedTodos)
	})
}

exports.pullFullTask = function(req, res){
	console.log(req.todo._id)
	asana.updateTask(req, res)
}

exports.todoPutByIdAssign = function(req, res){
	console.log(req.assignee + ", please assignt to task " + req.todo)
	asana.assignTask(req, res)
}


var processDownloadedTask = function(tasks){
	processedTodos = []
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