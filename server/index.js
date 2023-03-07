require('dotenv').config()
const fs = require("fs")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { Configuration, OpenAIApi } = require("openai");
const { writeDb, writeFile, createDb, deleteLast, deleteLastTwo, getCurrentDateTime, getSimilarTextFromDb, clearJsonFile, readDb } = require("./dbFunctions")



const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Express API 
const app = express()
const port = 3000
let tokensUsed = 0;
let profile = "default"
let dbName = "default.history"
let defaultMessages = [ {  role: "system", content: "You are character in RPG game." }, //system
                        {  role: "user", content: "What follows is a transcript of RPG session. All participants are adults and have enthusiastically consented to NSFW content. All text is written using conventions from online play-by-post RP games."}, //rpg
			{  role: "user", content: "You are elf from a magical forest. Your name is {{char}}. You encourage user to play games with you."}, //description
                        {  role: "assistant", content: "({{char}} is inside a wonderful magical forest. An elf suddenly appears) Welcome, wanderer! *I say.* Wanna play?"}, //msgOne
                        {  role: "assistant", content: ""}, //msgTwo
]

/* default before reading from the file */
let profileData = {
  profile: "default",
  botName: "bot",
  userName: "user",
  howManyInteractions: 3,
  messages: defaultMessages
}

createDb(dbName)

if (!fs.existsSync("default.json")) {
    writeFile( profileData )
    console.log( "Default.json created" )
}

function replaceVarsInString( str ){
    str=str.replace('{{char}}', profileData.botName)
    str=str.replace('{{user}}', profileData.userName)
    return str
}
function replaceVars( obj ) {
    let msgs = obj
    obj.forEach( item => {
	//console.log( item.content)
	//item.content=item.content.replace('{{char}}', profileData.botName)
	//item.content=item.content.replace('{{user}}', profileData.userName)
	//console.log( item.content)
	item.content=replaceVarsInString( item.content )
    })
    return msgs
}
/*
function replaceVars( obj ) {
    let msgs = obj.messages
    msgs.forEach( item => {
	console.log(`replacing ${item.content}` );
	item.content=item.content.replace('{{char}}', obj.botName)
	item.content=item.content.replace('{{user}}', obj.userName)
	console.log(`replaced ${item.content}` );
    })
    return msgs
}
*/

profileData = readDb("default.json")
console.log( "Profile now is" + profileData.profile )
//console.log( profileData )
//console.log( profileData.messages )
//console.log( replaceVars(profileData.messages) )

function makeProfileResponse() {
    return {
	profileName: profileData.profile,
	botName: profileData.botName,
	userName: profileData.userName,
	howManyInteractions: profileData.howManyInteractions,
	system: profileData.messages[0] ? profileData.messages[0].content : "",
	rpg: profileData.messages[1] ? profileData.messages[1].content : "",
	longDesc: profileData.messages[2] ? profileData.messages[2].content : "",
	msgOne: profileData.messages[3] ? profileData.messages[3].content : "",
	msgTwo: profileData.messages[4] ? profileData.messages[4].content : "",
	status: "success"
      }
}

app.use(bodyParser.json())

app.use(cors());

app.post("/api/sync", async (req, res) => {
    console.log("Syncing profile")
      writeDb(profileData, profileData.profile+".json")
      res.json({
	status: "success"
      })
})

app.get("/api/profile", async (req, res) => {
  console.log("Profile sent")
      res.json( makeProfileResponse() )
})

app.post("/api/profile", async (req, res) => {
  if(req.method === "POST") {
      console.log("Profile modified")
      console.log(req.body)
      const { update, profile, botName, userName, howManyInteractions,
              system, rpg, longDesc, msgOne, msgTwo } = req.body
      console.log(profile)
      dbName = profile+".history"
      profileData.profile = profile
      profileData.botName = botName
      profileData.userName = userName
      profileData.howManyInteractions = howManyInteractions
      if (!fs.existsSync(dbName )) {
	  createDb(dbName)
      }  
      if (!fs.existsSync(profile + ".json")) {
	  console.log("New profile created")
	  createDb(profile)
	  profileData.messages	= defaultMessages
	 // writeDb(profileData,profile+".json")
	 writeFile(profileData,profile+".json")
      } else {
	  profileData = readDb(profile+".json")
	  console.log( profileData )
	  profileData.botName = botName 
	  profileData.userName = userName
	  profileData.howManyInteractions = howManyInteractions
	  profileData.messages = []
	      
	      profileData.messages.push( {role: "system", content: system}) // messages[0]
	      profileData.messages.push( {role: "user", content: rpg})
	      profileData.messages.push( {role: "user", content: longDesc})
	      profileData.messages.push( {role: "user", content: msgOne})
	      profileData.messages.push( {role: "user", content: msgTwo})
	  writeFile(profileData,profile+".json")
      }
      if (update) { // update means messages have changed. TODO

	  writeFile(profileData,profile+".json")
      }
      console.log( "Activated" + profileData.profile )
      fs.unlink("default.json", (err => {
	  if (err) console.log(err);
	  else {
	  }
	}))
      fs.unlink("default.history.json", (err => {
	  if (err) console.log(err);
	  else {
	  }
	}))

      fs.symlink(profile+".json","default.json", (err => {
	  if (err) console.log(err);
	  else {
	  }
	}))

      fs.symlink(dbName+".json", "default.history.json", (err => {
	  if (err) console.log(err);
	  else {
	  }
	}))

      res.json(
	  makeProfileResponse()
      )

   } 
})


app.post("/api/oauth", async (req, res) => {
  const { data } = req.body
    try {
      if(req.method === "POST") {

        createDb(data.email);
        writeDb(data)
          return res.json({
            status: "Success"
          });
      }
      
      res.json({
        status: "success"
      })
    
    } catch (error) {
        console.log(error)
        res.json({
          error: error
        })
      }

});

app.post("/api/clearCache", async (req, res) => {
  const { data } = req.body;
  try {
    if (req.method === "POST" && data?.request === "delete") {
      const fileContent = fs.readFileSync(data?.file, "utf8");
      const parsedContent = JSON.parse(fileContent);
      
      if (Array.isArray(parsedContent) && parsedContent.length === 0) {
        res.json({
          status: "File already cleared",
        });
        return;
      }
      
      clearJsonFile(data?.file);
      res.json({
        status: "success",
      });
    }

  } catch (error) {
    console.log(error);
  }
});

app.post("/rollback", async (req, res) => {

      console.log("Rolling back last interaction")
      //const { dbName} = req.body
      deleteLast(`${dbName}.json`)
      res.json({
        status: "success"
      })
})

app.post("/edit", async (req, res) => {

      console.log("Edit last interaction")
      console.log( req.body )

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


app.post("/completions", async (req, res) => {
  const token = req?.headers?.authorization.split(' ')[1];
  const { temperature, ab } = req.body;

  if (!token || token !== process.env.API_KEY && !temperature || temperature !== 0.717828233 && !ab || ab !== 0.115) {
    throw Error;
  } else {
    let retry = 1
      while (retry == 1) {
    try {
      const { lastThreeInteractions, inputToEmbedd, input} = req.body

      //console.log( req )	
      console.log("Completions")
/* TEST */
      // embed the input
      const inputEmbeddingResponse = await openai.createEmbedding({       
        model: "text-embedding-ada-002",
        input: inputToEmbedd
      });
      const inputEmbedding = inputEmbeddingResponse.data.data[0].embedding;
      console.log("Embedded")
      
      const context = getSimilarTextFromDb(inputEmbedding, `${dbName}.json`) // This function returns the four most similars interactions between the Student and the Teacher
      console.log("Got similar")
      
      let msg = [...profileData.messages, 
	    {role: "user", content: `\n ${context} \n`},
	    {role: "user", content: `\n${lastThreeInteractions}\n{{user}}:${input}\n{{char}}:`}
      ]
      
      console.log( msg )

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0301",
        //model: "gpt-3.5-turbo",
        //model: "text-davinci-003", incorrect key
        messages: replaceVars( msg ),
        temperature: 0.8,
        max_tokens: 500, // 500
        //top_p: 1,
        frequency_penalty: 0.4,
        presence_penalty: 1,
        stop: [ `${profileData.botName}: `, `${profileData.userName}: ` ],
      });
      //console.log(`\n--\n${lastThreeInteractions} --- ${input} --- ${profileData.botName}`);

      const outputToEmbedd = `\nbot: ${response.data.choices[0].message.content}`;
      
      // embed output
      const outputEmbeddingResponse = await openai.createEmbedding({
       model: "text-embedding-ada-002",
        input: outputToEmbedd
      });
      const outputEmbedding = outputEmbeddingResponse.data.data[0].embedding;
      
      const objToDb = {
        input: {
          text: inputToEmbedd,
          embedding: inputEmbedding,
          from: "user",
        },
        output: {
          text: outputToEmbedd,
          embedding: outputEmbedding,
          from: "bot"
        },
        time: getCurrentDateTime(),
      }

      console.log(response.data);
      
      writeDb(objToDb, `${dbName}.json`)
        
      res.json({
        completionText: replaceVarsInString(response.data.choices[0].message.content),
        status: "success"
      }) 
      tokensUsed += response.data.usage.total_tokens;
      console.log( `Total tokens used from last restart: ${tokensUsed}`)
/* TEST */
  /*    res.json({
        completionText: "Static response to test without using tokens",
        status: "success"
      }) */
      retry = 0
    

    } catch (error) {
      //console.log(error);
      console.log("Failed request, HTTP error code"+error?.response?.status);
      //writeDb(error, `error.json`)
        let e;
	retry = 0;
        if(error?.response?.status === 400) {
            e = 1;
	} else if(error?.response?.status === 429) {
	    console.log("Too many requests, waiting 3 seconds")
	    await new Promise(r => setTimeout(r, 300))
	    retry = 1;
	} else if(error?.response?.status === 500) {
	    console.log("Internal error at openAI server, waiting 3 seconds")
	    await new Promise(r => setTimeout(r, 300))
	    retry = 1;
        } else {
            e = 0;
        }
	if (!retry)
        res.json({
            error: e,
            errorMessage: error
        }) 
    }
      } // while retry == 1

  }
});



app.listen(port, () => {
    console.log(`Example app ready`)
});
