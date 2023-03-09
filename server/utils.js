const { profile } = require("./profile.js")
function replaceVarsInString( str ){
    str=str.replace('{{char}}', profile().bot)
    str=str.replace('{{bot}}', profile().bot)
    str=str.replace('{{user}}', profile().user)
    return str
}

function replaceVars( obj ) { /* Array which has strings in .content field */
    let msgs = obj
    obj.forEach( item => {
	item.content=replaceVarsInString( item.content )
    })
    return msgs
}
module.exports = { replaceVars, replaceVarsInString }
