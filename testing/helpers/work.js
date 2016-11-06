var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var fs = require('fs')
var path = require('path')
var csv = require('csv-to-array')

var workControlller = require('../../controllers/sites')

var mongoose = require('mongoose')
var Work = mongoose.model('Work')

Work.collection.drop()

// Loads in a small number of WORK as pulled from a hard file
Work.find(function(err, works){
    
        if(works.length < 1){
            loadWork()
        }
})

loadWork = function(){
    var c = ['Name', 'Description', 'Number']

    var filepath = path.join(__dirname, '/files/work.txt');
    console.log(__dirname)
    return new Promise(function(resolve, reject){
        csv({
            file: filepath,
            columns: c
        }, function(err, array){
            console.log(err || array)
        })
    // fs.readFile(filepath, 'utf8', function (err,data) {
    //         if (err) {
    //         return console.log(err);
    //         }
    //         console.log(data);
    //     });
    resolve()
    })
}

module.exports = {
    loadWork: loadWork
}