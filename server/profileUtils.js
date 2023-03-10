const fs = require("fs")
const { readHistory} = require("./history.js")
const { setProfile, profile, profileDir, defaultProfile, cfg } = require("./profile.js")


function switchProfile( profileName ) {
    fs.writeFileSync(cfg(), JSON.stringify({ profile: profileName}, null, 2));
    profile().name = profileName
    ensureProfileExists()
    readProfile()
    console.log(`Switched profile to ${profileName}`)
}

function ensureProfileExists() {
    let dbName = profileDir()+profile().name + ".profile.json"
    try {
        if (!fs.existsSync(profileDir()+profile().name+".profile.json")) {
	    /* if (dbName=="current") {
		console.log(`${dbName} coś kurwa nie istnieje, ciekawe nie?`)
		ensureProfileExists("default");
		fs.symlinkSync("default.profile.json",profileDir()+"current.profile.json", (err => {
		      if (err) console.log(err);
		      else {
		      }
		    }))
		return console.log("Linked current to default.profile.json");
	    } */
            return resetProfile()
        } else {
            return console.log(`${dbName} file already exists`);
        }
    } catch (e) {
        return console.log(`Error creating ${dbName} file:`, e);
    }
}

function resetProfile() {
    let dbName = profileDir()+profile().name + ".profile.json"
    try {
	let obj = defaultProfile()
	if (dbName != "current") obj.profile = profile().name
	fs.writeFileSync(dbName, JSON.stringify(obj, null, 2));
	return console.log(`${dbName} file reset successfully`);
    } catch (e) {
        return console.log(`Error creating ${dbName} file:`, e);
    }
}

function readProfile() {
    try {
	//ensureProfileExists(dbName)
	let dbName = profileDir()+profile().name + ".profile.json"
	const data = fs.readFileSync(dbName, "utf-8")
	return setProfile( JSON.parse(data))
    } catch (e) {
        return console.log("Read failed! with the following errror:", e)
    }
}

function deleteProfile() {
    let dbName = profileDir()+profile().name + ".profile.json"
    try {
        fs.unlinkSync(dbName)
        return console.log("delete succesful")
    } catch (e) {
        return console.log("Delete failed! with the following errror:", e)
    }
}

function writeProfile() {
    let dbName = profileDir()+profile().name + ".profile.json"
    try {
        fs.writeFileSync(dbName, JSON.stringify(profile(), null, 2));
        return console.log("Save succesful")
    } catch (e) {
        return console.log("Save failed! with the following errror:", e)
    }
}


function makeProfileResponse() {
    return {
	profileName: profile().name,
	botName: profile().bot,
	userName: profile().user,
	howManyInteractions: profile().howManyInteractions,
	system: profile().messages[0] ? profile().messages[0].content : "",
	rpg: profile().messages[1] ? profile().messages[1].content : "",
	longDesc: profile().messages[2] ? profile().messages[2].content : "",
	msgOne: profile().messages[3] ? profile().messages[3].content : "",
	msgTwo: profile().messages[4] ? profile().messages[4].content : "",
	responses: profile().responses,
	history: readHistory( profile().profile ).slice( -20),
	status: "success"
      }
}

module.exports = { switchProfile, makeProfileResponse, writeProfile, readProfile, deleteProfile, resetProfile, ensureProfileExists }
