var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var Promise = require('bluebird')

var request = require('request')
var events = require('events')
var mongoose = require('mongoose')

var model = require('../../models/todo')

var ToDo = mongoose.model('ToDo')

var env = process.env.NODE_ENV
//var env = 'development'

if(env == "development" || "test"){
	var token = require('../../private/keys').asana.token
} else {
	var token = process.env.asana_token_kjiel
}

//var keys = require('../../private/keys.js')

//var token = keys.asana.token

if (token){console.log("\n ----- Asana Token: ***HIDDEN*** ----- \n" )}


var projectId = 88419022206391
var workspaceId = 2733326967720

var pullWorkspaces = function(){
	options = {
	    "method":"GET",
	    "url": "https://app.asana.com/api/1.0/workspaces",
	    "headers": {
	        "Accept": "application/json"
	    ,   "Authorization": "Bearer " + token}
	}

	request(options, function(err, response){
			if(err){console.log(err)}
			console.log(response.body)
		})

}

var resetOptionsProject = function(project){
	options = {
    "method":"GET",
    "url": "https://app.asana.com/api/1.0/tasks?project=" + project,
    "headers": {
        "Accept": "application/json"
    ,   "Authorization": "Bearer " + token
    }}}

var resetOptionsTask = function(task){

options = {
    "method":"GET",
    "url": "https://app.asana.com/api/1.0/tasks/" + task.asana_id,
    "headers": {
        "Accept": "application/json"
    ,   "Authorization": "Bearer " + token
    	}}
	}

// Pulls all incompplete tasks for a given project
var pullIncompleteTasks = function(projectId){
	options = {
	    "method":"GET",
	    "url": "https://app.asana.com/api/1.0/tasks?project=" + projectId + "&completed_since=now",
	    "headers": {
	        "Accept": "application/json"
	    ,   "Authorization": "Bearer " + token},
	    json: {
	    	data: {
	    		complete: "false"
	    	}
	    }
	}
	return new Promise(function(resolve, reject){
		request(options, function(err, response){
			if(err){console.log(err)}
	//		console.log(response.body.data)
			resolve(response.body.data)
		})
	})
}

var pullTasksMyTasks = function(assignee){
	if(!assignee){var assignee = 10363492364586}
	options = {
	    "method":"GET",
	    "url": "https://app.asana.com/api/1.0/tasks?workspace="+ workspaceId + "&assignee=me&completed_since=now",
	    "headers": {
	        "Accept": "application/json"
	    ,   "Authorization": "Bearer " + token}
	}
	return new Promise(function(resolve, reject){
	request(options, function(err, response){
			if(err){console.log(err)}
			var resBody	= JSON.parse(response.body)
			resBody.data.forEach(function(t){
			})
			resolve(resBody.data)
		})
	})
}

// Name, Summary and Assignee are sent via API and loaded into Asana
// This should be returned to the controller to enter into the DB
var createTask = function(task){
	options = {
		"method":"POST",
    	"url": "https://app.asana.com/api/1.0/tasks",
    	"headers": {
        	"Accept": "application/json",
        	"Authorization": "Bearer " + token
    		},
    	json: {
    		data: {
    			"projects": [88419022206391], // This is hard coded to fromScratch project
    			"name": task.name,
    			"assignee": task.asana_assignee.id,
    			"notes": task.summary
    		}}}

	return new Promise(function(resolve, reject){
    request(options, function(err, response){
    	if(err){console.log(err); reject(err)
    	} else if(response.statusCode!=201){
    		console.log('Response Status Code: ' + response.statusCode)
	//		console.log(response.body)
			reject(new Error("Error --- Status Code : " + response.statusCode + " received "))
    	} else {
    		console.log('Status Code: ' + response.statusCode)
			res = response.body.data
			resolve(res)
    	}
    	})
	})
}

exports.assignTask = function(req, res){
	resetOptionsTask(req.todo);
	options.method = "PUT"		
	options.json = {}
	options.json.data = {
		'assignee': req.assignee
	}
//	console.log(options)
	request(options, function(err, response){
	if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
			console.log(response.body)
		} else {
		console.log('Status Code: ' + response.statusCode)
	//	var data = JSON.parse(response.body.data);
		var data = response.body.data
	//	console.log(data)
		updateAsanaInDatabase(data, res)
	//	cb(data)
		}
	})
}

// Pulls ALL tasks, complete or not, from a hardcoded project
var pullTasks = function(req, res){
	return new Promise(function(resolve){
	resetOptionsProject(projectId)		
 	request(options, function(err, response){
	if(err){
			console.log(err);
		} else if (response.statusCode != 200) {
			console.log('Response Status Code: ' + response.statusCode)
		} else {
		console.log('Status Code: ' + response.statusCode)
		var resBody = JSON.parse(response.body);
		var tasks = resBody.data;
	//	console.log(tasks)
		resolve(tasks);
		}
	})
 })
}

//Enter a downloaded tasks and enter them into the DB
var processDownloadedTask = function(asanaRecord){
	return new Promise(function(resolve, reject){
		if(asanaRecord.name.slice(-1) == ":"){
			reject(new Error("This is a section" ))
			} else {
				query = ToDo.findOne({'asana_id': asanaRecord.id})
				query.exec().then(function(todo){
					return todo
				}).then(function(todo){

					if(!todo){
						t = new ToDo({
							name: asanaRecord.name,
							asana_id:asanaRecord.id,
						})
						t.save(function(err, tNew){
							pullTask(tNew).then(function(todo){
								resolve(todo);
							})

						})

					} else { // If Task Exists in DB, go pull update from Asana
						pullTask(todo)
						.then(function(todo){
						//	console.log(todo)
							resolve(todo)
						}).catch(function(err){
							console.log(err)
							resolve(todo)
						})
						/*
						.catch(function(err){
							console.log("I am erroring out here")
						//	console.log(err)
						})
						*/
						

					}


				})
			}
	})
}

// A Todo is send via a reqeust, it then pulls from Asana --- loaded to DB and send full todo back
var Task = function(req, res){
	t = req.todo
	pullTask(t).then(function(todo){
		res.send(todo)
	})

}

// exported function to pass a Todo that needs to be updated 
var updateTask = function(t){
	return new Promise(function(resolve, reject){ 
		pullTask(t).then(function(todo){
			resolve(todo)
		}).catch(function(err){
			console.log(err)
		})
	})
}

// Pull the full details of a given task
var pullTask = function(t){
	return new Promise(function(resolve, reject){
		resetOptionsTask(t)
		request(options, function(err, response){
			if(err){ 
					console.log(err)
					reject(err)
				} else if(response.statusCode !=200 ) {
					console.log(' ****** \n Response Status Code: ' + response.statusCode + " on " + t.name)
					if(response.statusCode == 404){
						t.action = {needed: true, description: "Possibly Missing, 404 Found"}
						t.save(function(){
							console.log(" ****** \n SAVED \n ******")
						})
					}
					reject(" ****** \n Bad Status Code \n ******")
				} else {
			//		console.log('Status Code: ' + response.statusCode)
					var data = JSON.parse(response.body).data;
			//		console.log(data)
			//		console.log("Preparing up update task to DB")
					updateAsanaInDatabase(data).then(function(todo){
					//	console.log("I have updated the task in the DB")
						resolve(todo)
					}).catch(function(err){
						console.log("Is the issue here?")
				//		console.log(err)
					})
				}
		})
	})
}

var getStories = function(req){
	var t = req.todo
	return new Promise(function(resolve){
		resetOptionsTask(t)
		options.url += '/stories'
		request(options, function(err, result){
			var d = JSON.parse(result.body)
		//	console.log(d.data)
			resolve(d.data)
		})
	})
}

// Complete a task into Asana
var completeTask = function(req){
	resetOptionsTask(req.todo);
		options.method = "PUT"		
		options.json = {}
		options.json.data = {
		'completed': true
	}
	return new Promise(function(resolve){
		request(options, function(err, response){
			if(err){console.log(err); res.send("Error Received")}
			if(response.statusCode == 201 || response.statusCode == 200){
				d = response.body.data	
		//		console.log(d)
				updateAsanaInDatabase(d).then(function(todo){
				resolve(todo)
			})
			} else {
				d = req.todo
				d.complete = true
				d.save(function(err, result){
					resolve(result)
				})
			}
		})
	})
}


// Load full data pulled from the API into the DB
var updateAsanaInDatabase = function(asanaResult){
  //	console.log(asanaResult)
	return new Promise(function(resolve){
		if(asanaResult.id){
			console.log(asanaResult)
			conditions = { 'asana_id': asanaResult.id};
			update = {	name: asanaResult.name,
						summary: asanaResult.notes,
						complete: asanaResult.completed,
						dateDue: asanaResult.due_on,
						dateAdded: asanaResult.created_at,
						asana_assignee: asanaResult.assignee,
						projects: asanaResult.projects
					};
	//		console.log(conditions)
			query = ToDo.findOneAndUpdate(conditions, update)
			query.exec(function(err,todo){
		//		console.log(todo._id + " has been updated from Asana")
				resolve(todo)
			})
		} else {
			console.log('There is no ID pass in updateAsanaInDatabase')
			resolve()
		}
	})
}

module.exports = {
	createTask: createTask,
	getStories: getStories,
	pullWorkspaces: pullWorkspaces,
	pullTasksMyTasks: pullTasksMyTasks,
	processDownloadedTask: processDownloadedTask,
	completeTask: completeTask,
	updateTask: updateTask,
	pullIncompleteTasks: pullIncompleteTasks,
	Task: Task,
	pullTasks: pullTasks
}