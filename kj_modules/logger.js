// Ability to set level of logging for troubleshoot purposes
var level = 1

var result = function(title, object, options){

    if(!options || options.level <= level){

        console.log()
        console.log('Event: ' + title)
        if (object && isArray(object)){
            if(options && options.eachItem == true){
                for(i=0;i<object.length;i++){
                    if(options.fieldName){
                        console.log(object[i][options.fieldName])
                    } else {
                        console.log(object[i])
                    }
                }
            } else {
                console.log(object.length + ' objects returned. Here is position [0]: ')
                console.log(object[0])     
            }
            
        } else {
            if (!object){
                console.log("null or undefined object ")
            } else {
                console.log(object)     
            }
        }

    } // level brace
}

function isArray(obj) {
    return Array.isArray(obj);
}



var event = function(text, options){
    if(!options || options.level <= level){
    console.log("Event: " + text)
    }
}

module.exports = {
    result: result,
    event: event,
    level: level
}