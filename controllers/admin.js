var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose')

var Workspace = mongoose.model('Workspace')

var itemController = require('./item')
var plm = require('../middlewares/fusion_lifecycle/workspaces')

var reloadData = function(req, res){
    var r = {
        message: 'Reload Data',
        workspaces: []
    }
    console.log(r)
    res.send(r)
}



var pullAllItems = function(){
    itemController.updateWorkspaces() // update all workspaces from plm
    .then(function(){  // Then 
        Workspace.find(function(err, results){ // Pull all workspaces from Database
            results.forEach(function(w){ // For each worksapce
                itemController.pullFromPLMbyItemType(w.label) // Pull the full set of records from PLM
            })
        })
    })
}

module.exports = {
    reloadData: reloadData
}