require('dotenv').config()
const fs = require("fs")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { embedInput, requestCompletion, fakerequestCompletion } = require("./openAiReqs.js")
const { writeHistory, resetHistory, readHistory, lastInteractions, deleteLastFromHistory } = require("./history.js")
const { Configuration, OpenAIApi } = require("openai");
const { completePreviousDb, writeDb, writeFile, createDb, deleteLast, deleteLastTwo, getCurrentDateTime, getSimilarTextFromDb, clearJsonFile, readDb } = require("./dbFunctions")

const { extractFacts, getSimilarFacts, writeFact, replaceFact, readAllFacts, createFacts, deleteFact, resetFacts } = require("./facts.js")
const { switchProfile, makeProfileResponse, writeProfile, readProfile, deleteProfile, resetProfile, ensureProfileExists } = require("./profileUtils.js")
const { profile } = require("./profile.js")
const { replaceVars, replaceVarsInString } = require("./utils.js")


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});


// Express API 
const app = express()
const port = 3000
// remembering submit and responses
//let responses = []
//let responseIndex = 0
let inputText = ""
let context = []
let defaultCfg = { profile: "island" }

const cfg = "config"

if (!fs.existsSync(cfg)) {
    fs.writeFileSync(cfg, JSON.stringify(defaultCfg, null, 2));
}

{
let { profile } = JSON.parse(fs.readFileSync(cfg, "utf-8"))
    console.log( "profile: " + profile )
    switchProfile(profile)
}


console.log( "Profile: " + profile().name )


//console.log( replaceVars(profileData.messages) )

app.use(bodyParser.json())

app.use(cors());
app.get("/api/facts", async (req, res) => {
    console.log("Getting facts")
      let facts = readAllFacts()
      let string = "Facts:\n"
      facts.forEach( (value,name ) => {
	  string += "Name:" + name + ", Fact: "+value.text + "\n" 

      })
     console.log(string)
      res.json({
	facts: string,
	status: "success"
      })
})

app.delete("/api/facts", async (req, res) => {
    console.log("Setting fact")
    console.log ( req.body )

    const { name } = req.body
    deleteFact( name )
      res.json({
	status: "success"
      })
})
app.post("/api/facts", async (req, res) => {
    console.log("Setting fact")
    console.log ( req.body )

    const { name, value } = req.body
    writeFact( name, value )
      res.json({
	status: "success"
      })
})

app.post("/api/sync", async (req, res) => {
    console.log("Syncing profile")
      writeDb(profileData, profileData.profile+".json")
      res.json({
	status: "success"
      })
})

app.get("/api/profile", async (req, res) => {
  console.log("Profile sent")
    console.log(JSON.stringify(readHistory().slice(-1)))

    let lastHistory = readHistory().slice(-1);
    if (lastHistory.length==1)
	if ((lastHistory[0].message.type == "user") && (profile().responses.length ==0)) {
	    console.log("Getting more responses")
	      let msg = [...profile().messages, 
		    {role: "user", content: `\n ${getSimilarFacts(lastHistory[0].message.text)} \n`},
		    {role: "user", content: `\n${lastInteractions}\n{{user}}:${lastHistory[0].message.text}\n{{char}}:`}
	      ]
	    output = await requestCompletion( msg, profile() );
	    writeProfile()
	}
  res.json( makeProfileResponse() )
    console.log( JSON.stringify( makeProfileResponse(),"",2) )

})
app.post("/api/profile/name", async (req, res) => {
      console.log("Profile switched")
      const { profileName } = req.body
      switchProfile( profileName ) 
	let lastHistory = readHistory().slice(-1);
	if (lastHistory.length==1)
	    if ((lastHistory[0].message.type == "user") && (profile().responses.length ==0)) {
		console.log("Getting more responses")
		  let msg = [...profile().messages, 
			{role: "user", content: `\n ${context} \n`},
			{role: "user", content: `\n${lastInteractions}\n{{user}}:${lastHistory[0].message.text}\n{{char}}:`}
		  ]
		output = await requestCompletion( msg, profile() );
		writeProfile()
	    }
      res.json(
	  makeProfileResponse()
      )
})
app.post("/api/profile/user", async (req, res) => {
    console.log("Profile user name changed")
    const { user } = req.body
    profile().user = user
    writeProfile()
    res.json(
        makeProfileResponse()
    )
})
app.post("/api/profile/bot", async (req, res) => {
    console.log("Profile bot name changed")
    const { bot } = req.body
    profile().bot = bot
    writeProfile()
    res.json(
      makeProfileResponse()
    )
})

app.post("/api/profile", async (req, res) => {
  console.log("Profile posted")
  if(req.method === "POST") {
    const {request} = req.body

    console.log("Profile modified")
    console.log(req.body)
    const { update, name, bot, user, howManyInteractions,
            system, rpg, longDesc, msgOne, msgTwo } = req.body
    //console.log(profile)
    ensureProfileExists(name)
    if (name != profile().name) {
	switchProfile( name )
    }
      console.log("reading profile")
    readProfile()
      console.log("making a"+profile().name)
    profile().bot = bot 
    profile().user = user
    profile().name = name
    profile().howManyInteractions = howManyInteractions

    profile().messages = []
    profile().messages.push( {role: "system", content: system}) // messages[0]
    profile().messages.push( {role: "user", content: rpg})
    profile().messages.push( {role: "user", content: longDesc})
    profile().messages.push( {role: "user", content: msgOne})
    profile().messages.push( {role: "user", content: msgTwo})
    writeProfile()
    console.log("sending back response")
    res.json(
      makeProfileResponse()
    )
  }
})

app.post("/api/reset_facts", async (req, res) => {
  const { data } = req.body;
  try {
    if (req.method === "POST" && data?.request === "delete") {
      
      resetFacts()
      res.json({
        status: "success",
      });
    }

  } catch (error) {
    console.log(error);
  }
});

app.post("/api/reset_history", async (req, res) => {
  const { data } = req.body;
  try {
    if (req.method === "POST" && data?.request === "delete") {
      
      resetHistory()
      profile().responses = []
      profile().responseIndex = 0
      res.json({
        status: "success",
      });
    }

  } catch (error) {
    console.log(error);
  }
});

/* TODO */
app.post("/rollback", async (req, res) => {
      console.log("Rolling back last interaction")
      console.log(req.body)

      deleteLastFromHistory()
      profile().responses = []
      profile().responseIndex = 0
      writeProfile()
      res.json({
        status: "success"
      })
})

/*

app.post("/edit", async (req, res) => {

      console.log("Edit last interaction")
      //console.log( req.body )

      const { input, output} = req.body //, dbName}
      deleteLast(`${dbName}.json`)

      const inputEmbeddingResponse = await openai.createEmbedding({
       model: "text-embedding-ada-002",
        input: input
      });
      const inputEmbedding = inputEmbeddingResponse.data.data[0].embedding;
      const outputEmbeddingResponse = await openai.createEmbedding({
       model: "text-embedding-ada-002",
        input: output
      });
      const outputEmbedding = outputEmbeddingResponse.data.data[0].embedding;
      const objToDb = {
        input: {
          text: input,
          embedding: inputEmbedding,
          from: "user",
        },
        output: {
          text: output,
          embedding: outputEmbedding,
          from: "bot"
        },
        time: getCurrentDateTime(),
      }
      writeDb(objToDb, `${dbName}.json`)
      res.json({
        status: "success"
      })
})
*/


app.post("/completions", async (req, res) => {
  let { input } = req.body
    
    /*TODO      gather facts to history  */
  console.log( "completions" )
  console.log( req.body )	

  
  //context = getSimilarTextFromDb(inputEmbedding, `${dbName}.json`) 
  extractFacts(input)
  input = input.replace("[[","")
  input = input.replace("]]","")
  const obj = await embedInput( input )
  let inputEmbedding = obj.output
    //console.log( "embedding is " + obj.output)
  

 // context = getSimilarFacts("Location")
//  context += getSimilarFacts("Time")
  context= getSimilarFacts(inputEmbedding)
  console.log( "CONTEXT" + context )
  const { previous }  = req.body
  
  /*if ( profile().responses.length > 0 )
    writeHistory( "bot", profile().responses[ profile().responseIndex ] )*/
  if ( !previous == "" ) 
    writeHistory( "bot", previous )

  writeHistory( "user", input )
  let msg = [...profile().messages, 
	{role: "user", content: `\n ${context} \n`},
	{role: "user", content: `\n${lastInteractions()}\n{{user}}:${input}\n{{char}}:`}
  ]
    console.log( JSON.stringify( msg, null, 2 ))
    console.log( "Sending!" )
  
  inputText=input
  profile().responses = []
  profile().responseIndex = 0
  //output = requestCompletion( msg, profile() );

  output = await requestCompletion( msg, profile() );
  console.log("Sending" + JSON.stringify(output) )
  writeProfile()

  retry = 0
  res.json({
    //completionText: replaceVarsInString(response.data.choices[0].message.content),
    completionText: replaceVarsInString(output.completionText),
    status: "success"
  }) 
});

app.post("/next_response", async (req, res) => { // post because it may get new responses from openAI
    if ( profile().responseIndex>= profile().responses.length-1)
	profile().responseIndex=0;
    else
	profile().responseIndex++;
    console.log(`Sending next response ${profile().responseIndex}`)    
      res.json({
        completionText: replaceVarsInString(profile().responses[profile().responseIndex]),
        //completionText: "Next Static response to test without using tokens",
        status: "success"
      }) 
})

app.post("/previous_response", async (req, res) => {
    if ( profile().responseIndex>0) profile().responseIndex--
    else profile().responseIndex = profile().responses.length-1
   
    console.log(`Sending previous response ${profile().responseIndex}`)    
      res.json({
 //       completionText: "Prev Static response to test without using tokens",
        completionText: replaceVarsInString(profile().responses[profile().responseIndex]),
	//isThisFirst: ( responseIndex == 0)?"true":"false",
	isThisFirst: "false",
        status: "success"
      }) 
})

app.post("/more_responses", async (req, res) => { // post because it may get new responses from openAI

    console.log("Getting more responses")
      let msg = [...profile().messages, 
	    {role: "user", content: `\n ${context} \n`},
	    {role: "user", content: `\n${lastInteractions}\n{{user}}:${inputText}\n{{char}}:`}
      ]
      
      
    output = await requestCompletion( msg, profile() );
    console.log("Sending" + JSON.stringify(output) )
    writeProfile()

    retry = 0
    res.json({
	completionText: replaceVarsInString(output.completionText),
        status: "success"
      }) 
})



app.listen(port, () => {
    console.log(`Example app ready`)
});
