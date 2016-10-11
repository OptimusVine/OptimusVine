var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var request = require('request')
var events = require('events')
var mongoose = require('mongoose')

var ToDo = mongoose.model('ToDo')

var env = process.env.NODE_ENV

if(env == "development"){
	var token = require('../../private/keys').asana.token
} else {
	var token = process.env.asana_token_kjiel
}

//var keys = require('../../private/keys.js')

//var token = keys.asana.token

if (token){console.log("\n ----- Asana Token: ***HIDDEN*** ----- \n" )}


var projectId = 88419022206391

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
exports.pullIncompleteTasks = function(projectId){
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

	console.log("Pulling Incomplete Tasks for : " + projectId)
	return new Promise(function(resolve, reject){
		request(options, function(err, response){
			if(err){console.log(err)}
		//	console.log(response.body.data)
			resolve(response.body.data)
		})
	})
}

// Name, Summary and Assignee are sent via API and loaded into Asana
// This should be returned to the controller to enter into the DB
exports.createTask = function(task){
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
exports.pullTasks = function(req, res){
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
exports.processDownloadedTask = function(asanaRecord){
	return new Promise(function(reject, resolve){
		if(asanaRecord.name.slice(-1) == ":"){
			reject("This is a section")
			} else {
				query = ToDo.findOne({'asana_id': asanaRecord.id})
				query.exec(function(err, todo){
					if(!todo){
					//	console.log('No ToDo found with Asana id : ' + asanaRecord.id)
						t = new ToDo({
							name: asanaRecord.name,
							asana_id:asanaRecord.id,
						//	summary:asanaRecord.notes,
						// 	assignee:asanaRecord.assignee
						})
						t.save(function(err, tNew){
							pullTask(tNew).then(function(todo){
								resolve(todo);
							})

						})

					} else {
					//	console.log("Todo already exists : " + asanaRecord.id)
						pullTask(todo).then(function(todo){
							resolve(todo)
						})

					}
				})
			}
	})
}

// A Todo is send via a reqeust, it then pulls from Asana --- loaded to DB and send full todo back
exports.Task = function(req, res){
	t = req.todo
	pullTask(t).then(function(todo){
		res.send(todo)
	})

}

// exported function to pass a Todo that needs to be updated 
exports.updateTask = function(t){
	return new Promise(function(resolve, reject){ 
		pullTask(t).then(function(todo){
			resolve(todo)
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
					console.log('Response Status Code: ' + response.statusCode)
					reject(new Error("Bad Status Code"))
				} else {
			//		console.log('Status Code: ' + response.statusCode)
					var data = JSON.parse(response.body).data;
				//	console.log(data)
					updateAsanaInDatabase(data).then(function(todo){
				//		console.log(todo)
						resolve(todo)
					})
				}
		})
	})
}

// Complete a task into Asana
exports.completeTask = function(req){
	resetOptionsTask(req.todo);
		options.method = "PUT"		
		options.json = {}
		options.json.data = {
		'completed': true
	}
	return new Promise(function(resolve){
		request(options, function(err, response){
			d = response.body.data
	//		console.log(d)
			updateAsanaInDatabase(d).then(function(todo){
				resolve(todo)
			})
		})
	})
}


// Load full data pulled from the API into the DB
var updateAsanaInDatabase = function(asanaResult){
//	console.log(asanaResult.completed)
	return new Promise(function(resolve){
		if(asanaResult.id){
			conditions = { 'asana_id': asanaResult.id};
			update = {	name: asanaResult.name,
						summary: asanaResult.notes,
						complete: asanaResult.completed,
						dateDue: asanaResult.due_on,
						dateAdded: asanaResult.created_at,
						asana_assignee: asanaResult.assignee,
						projects: asanaResult.projects
					};
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