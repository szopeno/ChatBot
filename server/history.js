const fs = require("fs")
const { profile, profileDir } = require("./profile.js")
function ensureHistoryExists() {
    let dbName = profileDir() + profile().name + ".history.json"
    if (!fs.existsSync(dbName)) {
	return resetHistory();
    }
}


function resetHistory(){
    let dbName = profileDir() + profile().name + ".history.json"
    try {
	let obj = []
	fs.writeFileSync(dbName, JSON.stringify(obj, null, 2));
	return console.log(`${dbName} file reset successfully`);
    } catch (e) {
        return console.log(`Error creating ${dbName} file:`, e);
    }
}

function readHistory(){
    let dbName = profileDir()+profile().name + ".history.json"
    ensureHistoryExists()
    const data = fs.readFileSync(dbName, "utf-8")
    return JSON.parse(data)
}
function lastInteractions(howMany, dbName = "default") {
    let last = []
    howMany =profile().howManyInteractions
    console.log("HOWMANY "+ howMany )
    readHistory().slice(-howMany).forEach( (item, index) => {
	if (item.message.type === 'bot')
	//    last.push( `${profile().bot}: ${item.message.text}`)
	      last.push( { role: "assistant", content: `${item.message.text}`})
	else
	//    last.push( `${profile().user}: ${item.message.text}`)
	      last.push( { role: "user", content: `${item.message.text}`})
    })
    console.log( "HISTORY SIZE:" + last.length )
    return last
    //return last.join("\n")
}

function deleteLastFromHistory(){
    let dbName = profileDir()+ profile().name + ".history.json"
    try {
        let history = readHistory()
	if (history.length==0)
	    return console.log("history already empty")
	obj = history.pop();
	if ( obj.message.type=="bot"){
	    if (history.length>0)
		history.pop();
	}
        fs.writeFileSync(dbName, JSON.stringify(history, null, 2));
        return console.log("delete last succesful")
    } catch (e) {
        return console.log("Save failed! with the following errror:", e)
    }
}

function trimHistory(keepHowManyEntries=100) {
    let dbName = profileDir()+ profile().name + ".history.json"
    try {
        let history = readHistory()
	if ( history.length>keepHowManyEntries) {
	    history.splice(0,history.length-keepHowManyEntries);
	    if (history[0].message.type=="bot")
		history.shift()
	    fs.writeFileSync(dbName, JSON.stringify(history, null, 2));
	}
    } catch (e) {
        return console.log("Save failed! with the following errror:", e)
    }
}

function writeHistory(type, text) {
    let dbName = profileDir() + profile().name + ".history.json"
    try {
        let history = readHistory()
	let obj = { message: { type: type, text: text }, embedding: [] }
	history.push(obj)
        fs.writeFileSync(dbName, JSON.stringify(history, null, 2));
        return console.log("Save succesful")
    } catch (e) {
        return console.log("Save failed! with the following errror:", e)
    }
}

module.exports = { writeHistory, readHistory, deleteLastFromHistory, resetHistory, trimHistory, lastInteractions }
