const { Configuration, OpenAIApi } = require("openai");
const { profile, switchProfile, makeProfileResponse, writeProfile, readProfile, deleteProfile, resetProfile, ensureProfileExists } = require("./profile.js")
const { replaceVars } = require("./utils.js")
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
let tokensUsed = 0;
let tokensEmbedUsed = 0;

async function embedInput(input) {
    let cont = 1
    let retry = 0
    while (cont) {
    try {
     const inputEmbeddingResponse = await openai.createEmbedding({
       model: "text-embedding-ada-002",
       input: input
     });
	cont = 0
     const inputEmbedding = inputEmbeddingResponse.data.data[0].embedding;

     tokensEmbedUsed += inputEmbeddingResponse.data.usage.total_tokens
     return { usage: inputEmbeddingResponse.data.usage.total_tokens,
	 output:inputEmbeddingResponse.data.data[0].embedding
     }
    } catch (error) {
      console.log("Failed request, HTTP error code"+error?.response?.status);
      //writeDb(error, `error.json`)
        //if(error?.response?.status === 400) {
        //    e = 1;}else
	if(error?.response?.status === 429) {
	    console.log("Too many requests, waiting 3 seconds")
	    await new Promise(r => setTimeout(r, 300))
	    retry++;
	} else if(error?.response?.status === 500) {
	    console.log("Internal error at openAI server, waiting 3 seconds")
	    await new Promise(r => setTimeout(r, 300))
	    retry++;
        } else {
            throw (error)
        }
	if (retry>3){
	    console.log( "Giving up after three retries ")
            throw (error)
        }
	cont = 1
    }}
}
function fakerequestCompletion(msg) {
      profile().responseIndex = profile().responses.length 
    //console.log(`Index now ${responseIndex} ${responses.length}`)    
      profile().responses.push( `OResponse ${profile().responseIndex}` )
      profile().responses.push( `AResponse ${profile().responseIndex+1}` )
      return {
        completionText: profile().responses[profile().responseIndex],
        //completionText: "Next Static response to test without using tokens",
        status: "success"
      }
}

async function requestCompletion(msg, res) {
    let retry = 0
    let cont = 1
    while (cont) {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0301",
        //model: "gpt-3.5-turbo",
        //model: "text-davinci-003", incorrect key
        messages: replaceVars( msg ),
        temperature: 0.8,
        max_tokens: 300, // 500
	n : 2,
        //top_p: 1,
        frequency_penalty: 0.4,
        presence_penalty: 1,
        stop: [ `${profile().bot}: `, `${profile().user}: ` ],
      });

      profile().responseIndex = profile().responses.length 
    //console.log(`Index now ${responseIndex} ${responses.length}`)    
      response.data.choices.forEach(( item, index) => {
	//  console.log("New response" + item.message.content)
          profile().responses.push( item.message.content )
      })
      tokensUsed += response.data.usage.total_tokens;
      let usedTotal = tokensUsed + tokensEmbedUsed;
      console.log( `Total tokens used from last restart: ${tokensUsed} text (turbo gpt chat) + ${tokensEmbedUsed} embeddings (ada) = ${usedTotal}`)

      cont = 0
      return {
        completionText: profile().responses[profile().responseIndex],
	usage: response.data.usage.total_tokens,
        status: "success"
      }
    } catch (error) {
      console.log("Failed request, HTTP error code"+error?.response?.status);
      //writeDb(error, `error.json`)
        //if(error?.response?.status === 400) {
        //    e = 1;}else
	if(error?.response?.status === 429) {
	    console.log("Too many requests, waiting 3 seconds")
	    await new Promise(r => setTimeout(r, 300))
	    retry++;
	} else if(error?.response?.status === 500) {
	    console.log("Internal error at openAI server, waiting 3 seconds")
	    await new Promise(r => setTimeout(r, 300))
	    retry++;
        } else {
            throw (error)
        }
	if (retry>3){
	    console.log( "Giving up after three retries ")
            throw (error)
        }
	cont = 1
    } //end try..catch
  }//end while
}

module.exports = { embedInput, requestCompletion, fakerequestCompletion }
