const fs = require("fs")
const crypto = require("crypto");

function encodeToSHA256(data) {
    const hash = crypto
      .createHash("sha256")
      .update(data)
      .digest("hex");
    return hash;
  }

function createDb(dbName = "db.json") {
    try {
        if (!fs.existsSync(dbName + ".json")) {
            fs.writeFileSync(dbName + ".json", JSON.stringify([], null, 2));
            return console.log(`${dbName + ".json"} file created successfully`);
        } else {
            return console.log(`${dbName + ".json"} file already exists`);
        }
    } catch (e) {
        return console.log(`Error creating ${dbName + ".json"} file:`, e);
    }
}


function readDb(dbName = "db.json") {
    const data = fs.readFileSync(dbName, "utf-8")
    return JSON.parse(data)
}

function deleteLast(dbName = "db.json") {
    try {
        let data = readDb(dbName);
        data.pop();
        fs.writeFileSync(dbName, JSON.stringify(data, null, 2));
        return console.log("delete last succesful")
    } catch (e) {
        return console.log("Save failed! with the following errror:", e)
    }
}

function deleteLastTwo(dbName = "db.json") {
    try {
        let data = readDb(dbName);
        data.pop();
        data.pop();
        fs.writeFileSync(dbName, JSON.stringify(data, null, 2));
        return console.log("delete last succesful")
    } catch (e) {
        return console.log("Save failed! with the following errror:", e)
    }
}
function writeFile(obj, dbName = "default.json") {
  let json = JSON.stringify( obj, null,2 )
  fs.writeFileSync(dbName,json,(err => {
      if (err) console.log(err);
      else {
      }
  })) 
}
function completePreviousDb(cmpl, dbName = "db.json") {
    console.log("Completed previous ")
    if (!cmpl) {return console.log("Please provide data to complete!")}
    try {
	let data = readDb(dbName);
    console.log("red Completed previous "+ data)
	let obj=data.pop()
    console.log("pop Completed previous  " + obj)
	obj.output= cmpl
    console.log("cmpl Completed previous ")
	data.push(obj)
        fs.writeFileSync(dbName, JSON.stringify(data, null, 2));
        return console.log("Completed previous succesful")
    } catch (e) {
        return console.log("Complete failed! with the following errror:", e)
    }
}

function writeDb(obj, dbName = "db.json") {
    if (!obj) {return console.log("Please provide data to save!")}
    try {
        let data = readDb(dbName);
        data.push(obj);
        fs.writeFileSync(dbName, JSON.stringify(data, null, 2));
        return console.log("Save succesful")
    } catch (e) {
        return console.log("Save failed! with the following errror:", e)
    }
}

function getCurrentDateTime() {
    const date = new Date();
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString();
    return `${dateString} ${timeString}`;
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

function clearJsonFile(filename) {
    let emptyData = JSON.stringify([]);
    fs.writeFileSync(filename, emptyData);
}

function getSimilarTextFromDb(inputEmbedding, dbName = "db.json") {

    let data = new Map(Object.entries(JSON.parse(fs.readFileSync(dbName, "utf-8"))))
    let result = [];
    data.forEach(embedding => {
        let similarity = cosineSimilarity(inputEmbedding, embedding.input.embedding);
        if (similarity > 0.8) {
            result.push({
                interaction: `${embedding.input.text} ${embedding.output.text}`,
                similarity: similarity
            });
        }
    });
    result.sort((a, b) => b.similarity - a.similarity);
    let topThree = result.slice(0, 4);

    // topThree.reverse()
    // console.log(`The top three most similar interactions are:`, topThree.map(r => r.interaction).join(""))
    return topThree.map(r => r.interaction).join("");
  }

module.exports = { completePreviousDb, readDb, writeFile, writeDb, deleteLast, deleteLastTwo, getSimilarTextFromDb, getCurrentDateTime, encodeToSHA256, cosineSimilarity, createDb, clearJsonFile }
