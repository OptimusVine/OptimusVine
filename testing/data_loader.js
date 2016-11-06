var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose')
var Route = mongoose.model('Route')
var Site = mongoose.model('Site')
var People = mongoose.model('People')
var Todo = mongoose.model('ToDo')
var Item = mongoose.model('Item')
var Process = mongoose.model('Process')
var Production = mongoose.model('Production')
var Work = mongoose.model('Work')

// Route.collection.drop()
// Site.collection.drop()
// People.collection.drop()
// Todo.collection.drop()
// Item.collection.drop()
// Process.collection.drop()
// Production.collection.drop()

var work = require('./helpers/work')

var newWine = new Item({
            type: 'Wine',
            description: 'Optimus Vine',
            plmItem: {
                details: {
                    workflowState: {
                        stateName: "Concept"
                    }
                }
            }
        })
        newWine.save(function(err, item){
        })
 
var newWork = new Work({
           title: "Work Title",
           description: "Work Descripton",          
        })
        newWork.save(function(err, work){
    })



 