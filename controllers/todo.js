var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose');

var ToDo = mongoose.model('ToDo')
var People = mongoose.model('People')

var asana = require('../middlewares/asana/tasks');

var getTodos = function(req, res, next){
	ToDo.find(function(err, todos){
	/*	todos.forEach(function(t){
			if(!t.projects[0]){
				t.projects.push({name: "no project"})
			}
		})*/
		res.json(todos)
	})
}

var getMyTasks = function(req, res, next){
	console.log("Assignee via Request: " + req.assignee)
	var assignee = 10363492364586
	asana.pullTasksMyTasks(assignee).then(function(tasks){
		return processDownloadedTask(tasks)
	}).catch(function(err){}).then(function(todos){
		res.send(todos)
	})
}

var getAssignees = function(){
	var q = {'asana_assignee.id':{$ne:null}}
	ToDo.find(q, function(err, results){

		console.log(results.length)
		return results
	}).then(function(results){
		var arr = []
		for(i=0;i<results.length;i++){
			if (!results[i].asana_assignee) {
				console.log("ERROR : No ASSIGNEE " + results[i].name)
			}else if(results[i].asana_assignee.id == null){
				console.log("NO ASSIGNEE!?!?!")
				console.log(results[i])
			} else {
				if(arr.indexOf(results[i].asana_assignee.id) == -1){
					arr.push(results[i].asana_assignee.id)
				}
			}
		}
	//	console.log(arr)
		var q = {'asana_assignee':{$in: arr}}
		People.find(q, function(err, results){
			console.log(results)
			return results
		})
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
var updateIncompleteTasks = function(req, res){
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

module.exports = {
	todoPutByIdAssign: todoPutByIdAssign,
	pullFullTask: pullFullTask,
	pullTodos: pullTodos,
	completeToDo: completeToDo,
	getTodos: getTodos,
	postTodos: postTodos, 
	pullIncompleteTasks: pullIncompleteTasks,
	updateIncompleteTasks: updateIncompleteTasks,
	getMyTasks: getMyTasks
}