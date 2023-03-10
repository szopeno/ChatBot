const fs = require("fs")
const crypto = require("crypto");
const { profile, profileDir} = require("./profile.js")
const { embedInput } = require("./openAiReqs.js")

function encodeToMD4(data) {
    const hash = crypto
      .createHash("md4")
      .update(data)
      .digest("hex");
    return hash;
  }

function ensureFactsExist() {
    let dbName = profileDir() + profile().name + ".facts.json"
    if (!fs.existsSync(dbName)) {
	return resetFacts(dbName);
    }
}

function createFacts(dbName = "default") {
    dbName = dbName + ".facts.json"
    try {
        if (!fs.existsSync(dbName)) {
	    let obj = new Map()
            fs.writeFileSync(dbName, JSON.stringify(obj, null, 2));
            return console.log(`${dbName} file created successfully`);
        } else {
            return console.log(`${dbName} file already exists`);
        }
    } catch (e) {
        return console.log(`Error creating ${dbName} file:`, e);
    }
}

function resetFacts(){
    let dbName = profileDir() + profile().name + ".facts.json"
    try {
	let obj = new Map()
	fs.writeFileSync(dbName, JSON.stringify(obj, null, 2));
	return console.log(`${dbName} file reset successfully`);
    } catch (e) {
        return console.log(`Error creating ${dbName} file:`, e);
    }
}

function readAllFacts() {
    ensureFactsExist()
    let dbName = profileDir() + profile().name + ".facts.json"
    let data = new Map(Object.entries(JSON.parse(fs.readFileSync(dbName, "utf-8"))))
    return data
}

function deleteFact(name) {
    ensureFactsExist()
    let dbName = profileDir() + profile().name + ".facts.json"
    try {
        let data = new Map(Object.entries(JSON.parse(fs.readFileSync(dbName, "utf-8"))))
        data.delete(name);
        fs.writeFileSync(dbName, JSON.stringify(Object.fromEntries(data), null, 2));
        return console.log("delete last succesful")
    } catch (e) {
        return console.log("Save failed! with the following errror:", e)
    }
}
async function writeFact(name,value) {
    ensureFactsExist()
    let dbName = profileDir() + profile().name + ".facts.json"
    if (value==="") return console.log("Empty values not supported")
    try {
	const emb = await embedInput( value )
	//console.log( "WRITE"+ JSON.stringify(emb.output))
	let obj = { text: value, embedding: emb.output }
	//console.log( JSON.stringify( obj ) )

        let data = new Map(Object.entries(JSON.parse(fs.readFileSync(dbName, "utf-8"))))
	if (name === "") data.set(encodeToMD4(value), obj)
	else data.set(name, obj)
        fs.writeFileSync(dbName, JSON.stringify(Object.fromEntries(data), null, 2));
        return console.log("Save succesful")
    } catch (e) {
        return console.log("Save failed! with the following errror:", e)
    }
}

function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += Math.pow(vecA[i], 2);
        normB += Math.pow(vecB[i], 2);
    }
    // console.log(dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)))
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function getSimilarFacts(input) {

    ensureFactsExist()
    let dbName = profileDir() + profile().name + ".facts.json"
    console.log("PROFIL:"+ profile().name )
    let data = new Map(Object.entries(JSON.parse(fs.readFileSync(dbName, "utf-8"))))
    let result = [];
    let coma =""
    data.forEach(fact => {
        let similarity = cosineSimilarity(input, fact.embedding);
	console.log(`${fact.text} : ${similarity}`)
        if (similarity > 0.75) {
            result.push({
                fact: `${coma} ${fact.text}`,
                similarity: similarity
            });
	    coma=";"
        }
    });
    result.sort((a, b) => b.similarity - a.similarity);
    let topBest = result.slice(0, 5); /// name is left from the past, it's actuall
    console.log( JSON.stringify( topBest ))

    // topThree.reverse()
    // console.log(`The top three most similar interactions are:`, topThree.map(r => r.interaction).join(""))
    return "(Facts to remember: "+ topBest.map(r => r.fact).join(" ") + ")";
  }

function extractFacts(msg){
    //const string = 'hej [[ty: wuju jeden]] [[tak]] [[ano: atak]] ]]';

    // Find all numbers in the string
    let regexp = /\[\[[^\[\]]*\]\]/g;
    let name =""
    let value =""
    for (const match of msg.matchAll(regexp)) {
       let str=match[0].substring(2,match[0].length-2);
       let mid = str.indexOf(":")
       if (mid>=0) {
	   name=str.substr(0,mid)
	   value=str.substr(mid+1)
       } else {
	   value=`%{profile().user} once said that ${str}`
       }
       console.log("NAME (" + name + ") VALUE " +value)
	  
    }
}

module.exports = { writeFact, readAllFacts, createFacts, deleteFact, resetFacts, getSimilarFacts, extractFacts }
