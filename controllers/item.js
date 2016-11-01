var sLoc = __filename.substring(process.cwd().length,__filename.length);
console.log("Calling : " + sLoc)

var mongoose = require('mongoose')

var Item = mongoose.model('Item')

var getItemById = function(req, res, next){
 //   console.log(req.type)
  //  console.log(req.item)
    res.send(req.item)
}

var getItemsByType = function(req, res, next){
    Item.find({'type':req.type}, function(err, results){
        res.send(results)
    })
}

module.exports = {
    getItemById: getItemById,
    getItemsByType: getItemsByType
}