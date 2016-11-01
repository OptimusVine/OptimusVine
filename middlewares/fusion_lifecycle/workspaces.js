var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var auth = require('./auth')

var request = require('request')
var mongoose = require('mongoose')

var Workspace = mongoose.model('Workspace')
var Sourcing = mongoose.model('Sourcing')
var Wine = mongoose.model('ToDo')
var Production = mongoose.model('Production')
var Item = mongoose.model('Item')

var processController = require('../../controllers/process')

var listOfWorkspaces = [92, // Sourcing
						98, 
						93]

var workspaceMapping = [];

// Is the Generic API call to PLM 
// Requires AUTH to already have the access Cookie
// the target fed in the changing part based on true goal
var setOptions = function(target){
	o = {
    "method":"GET",
    "url": "https://clubw.autodeskplm360.net/api/rest/v1/",
    "headers": {
        "Accept": "application/json"
    ,   "Cookie": auth.Cookie()
    }}
    o.url += target
    return o;
}

// Pull items by WorkspaceID from PLM
exports.getItems = function(id){
	return new Promise(function(resolve, reject){
	Workspace.find({"id":id}, function(err, res){
		o = {
    "method":"GET",
    "url": res[0].uri + "?page=1&size=100",
    "headers": {
        "Accept": "application/json"
    ,   "Cookie": auth.Cookie()
    	}}
 //    	console.log(o) 
    	request(o ,function(err, response){
    		if(err){console.log(err)}
    		else if(response.statusCode ==500){
				console.log("Error 500 - Possible AUTH issue - please try again")
				auth.getAuth()
				reject()
		}
    		else{
			   	//  console.log("Request Received")
			   	var resBody = JSON.parse(response.body)
				   console.log(resBody)
			   	//	console.log(resBody.list.item[0].details)
				   	console.log(resBody.list.item.length)
	    			processDownloadedItems(resBody.list.item, id)
					resolve()
    			}
    		})
		})
	})
}

// Pulls workspaces into memory
// Is called at the bottom of this page
var fillWorkspaceMapping = function(){
	Workspace.find(function(err, results){
		results.forEach(function(w){
			workspaceMapping.push(w)
		})
	//	console.log(workspaceMapping)
	})
}

// Is fed an item, it does a search to see if it exists
// If it does not exists, it adds it to database
// If it does exist, it currently does nothing
//		Needs to be updated to allow for changes and updates
var updateItemToDatabase = function(item){
	var type;
	for(k=0;k<workspaceMapping.length;k++){
			if (workspaceMapping[k].id === item.details.workspaceID) {
				type = workspaceMapping[k].label
			};
		}

	Item.find({"id":item.id, "type": type}, function(err, res){
			if(res.length > 0 ){
			//	console.log(res)
				console.log("Id " + item.id + " Already exists")
			} else if (!res){
			} else if (item.details.deleted == true){
				console.log("Deleted them, doing nothing. ")
				// If deleted, do nothing
			} else {
			//	console.log(res)
				s = new Item(item)
				s.type = type
				s.plmItem = item
			//	console.log(s)
				s.save(function(err, result){
				//	console.log(result)
					console.log(result.type + " obj saved: " + result.id + " deleted : " + result.plmItem.details.deleted)
				})
			}
		})
}

// Cycle through lists of items pulled from PLM 
// Passes to a function to add / update to database
var processDownloadedItems = function(list, id){
	Workspace.findOne({"id":id}, function(err, res){
		if (err){console.log(err)}
		else {
			for(i=0;i<list.length;i++){
				updateItemToDatabase(list[i]) // This function does the actual update
			}
		} 
	})}

// Pulls all workspaces from DB and passes up via promise
// probably doesn't need to be in this file
exports.getWorkspaces = function(){
	return new Promise(function(resolve, reject){
		Workspace.find(function(err, response){
		//	console.log(response)
		//	return response
			if(err){reject(err)}
			if(response){resolve(response)}
		})
	})
}

// Pulls a list of all workspaces in PLM
// 		Then calls a different function to process them in
exports.receiveWorkspaces = function(cookieString){
	console.log(' : Requesting PLM workspaces \n -------------------------')
	// Define URL via setOptions
	var o = setOptions("workspaces")
	if (o.headers.Cookie == ""){console.log("Cookie is Blank")} else {
	request(o, function(err, response){
		if(err){
			console.log(err);
		} else if (response.statusCode == 500) {
			console.log('Response Status Code: ' + response.statusCode + ' Internal Error')
		} else {
		console.log('Status Code: ' + response.statusCode)
		var resBody = JSON.parse(response.body);
	//	console.log("Repsonse with Category: " + resBody.list.data[0].data.category)
	//	console.log(resBody.list.data[0]);
		processDownloadedWorkspaces(resBody.list.data)
		}
	});
	} // else
}

// Takes the list of workspaces from PLM 
// If it exists in the hardcoded list from above
// 		calls a function to add WS to DB
var processDownloadedWorkspaces = function(list){
	for(i=0;i<list.length;i++){
		if(list[i].data.label.substring(0,3)=="zz_"){
		//	console.log("Rejected for having zz_")
		} else if(listOfWorkspaces.indexOf(list[i].data.id) > -1){
			updateWorkspaceToDatabase(list[i])
		} else {
			// console.log(list[i].data.label + list[i].data.id)
		}
	}
}

// Adds a workspace to the database
//		Needs to be updated to update any changes
var updateWorkspaceToDatabase = function(item){
	Workspace.find({"id":item.data.id}, function(err, res){
		if(res.length<1){
			item.id = item.data.id
			item.label = item.data.label
			item.category = item.data.category
			var w = new Workspace(item)
			w.save(function(err, result){
				console.log(result)
			})
		} else {
		}
	})
}

fillWorkspaceMapping();