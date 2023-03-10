import React, { useState, createContext, useRef, useEffect } from "react";


const ChatContext = createContext();

const ChatProvider = ({children}) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState("");
  const [old, setOld] = useState("");
  const [connected, setConnected] = useState(JSON.parse(localStorage.getItem('connected')));
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [disableBackResponse, setDisableBackReponse] = useState(false);
  const scrollDown = useRef(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [bot, setBot] = useState(JSON.parse(localStorage.getItem('bot')));
  const [profileName, setProfileName] = useState(JSON.parse(localStorage.getItem('profileName')));

  const [howManyInteractions, setHowManyInteractions] = useState(JSON.parse(localStorage.getItem('howManyInteractions')));

  const [systemStr, setSystemStr] = useState(JSON.parse(localStorage.getItem('systemStr')));
  const [rpg, setRpg] = useState(JSON.parse(localStorage.getItem('rpg')));
  const [longDesc, setLongDesc] = useState(JSON.parse(localStorage.getItem('longDesc')));
  const [msgOne, setMsgOne] = useState(JSON.parse(localStorage.getItem('msgOne')));
  const [msgTwo, setMsgTwo] = useState(JSON.parse(localStorage.getItem('msgTwo')));

  const handleSaveProfile = async (event) => {
    /* setProfileName( event.target.profile.value )
    localStorage.setItem( "profileName", JSON.stringify( event.target.profile.value ))
    setUser( event.target.user.value )
    localStorage.setItem( "user", JSON.stringify( event.target.user.value ))

    setBot( event.target.bot.value )
    localStorage.setItem( "bot", JSON.stringify( event.target.bot.value ))
    setHowManyInteractions( event.target.howmany.value )
    localStorage.setItem( "howManyInteractions", JSON.stringify( event.target.howmany.value ))

    setSystemStr( event.target.system.value )
    localStorage.setItem( "systemStr", JSON.stringify( event.target.system.value ))
    setRpg( event.target.rpg.value )
    localStorage.setItem( "rpg", JSON.stringify( event.target.rpg.value ))
    setLongDesc( event.target.longDesc.value )
    localStorage.setItem( "longDesc", JSON.stringify( event.target.longDesc.value ))

    setMsgOne( event.target.msgone.value )
    localStorage.setItem( "msgOne", JSON.stringify( event.target.msgone.value ))
    setMsgTwo( event.target.msgtwo.value )
    localStorage.setItem( "msgTwo", JSON.stringify( event.target.msgtwo.value )) */

    setLoading(true)
    setInput("<Wait for directive to take effect>")
      try {
    //const response = await fetch("http://localhost:3000/api/profile" )
     const response = await fetch("http://localhost:3000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
	  name: event.target.profile.value, bot: event.target.bot.value, 
	  user: event.target.user.value, howManyInteractions: event.target.howmany.value,
	  longDesc: event.target.longDesc.value, rpg: event.target.rpg.value, system: event.target.system.value, 
	  msgOne: event.target.msgone.value, msgTwo: event.target.msgtwo.value,
	  update: true
      })

      })

    const data = await response.json()
    
    dataToProfile(data);  

      } catch (e) {
	  alert(e)
      }

    setLoading(false)
  }

  
  function dataToProfile(data) {
	setUser( `${data.userName}`)
	setBot( `${data.botName}`)
	setProfileName( `${data.profileName}`)
      // messages 
	setSystemStr( `${data.system}`)
	setRpg( `${data.rpg}`)
	setLongDesc( `${data.longDesc}`)
	setMsgOne( `${data.msgOne}`)
	setMsgTwo( `${data.msgTwo}`)
	setHowManyInteractions( `${data.howManyInteractions}`)
	//setProfileMessages( `${data.messages}`)
	localStorage.setItem( "user", JSON.stringify( `${data.userName}`))
	//localStorage.setItem( "user", JSON.stringify(user))
	localStorage.setItem( "bot", JSON.stringify( `${data.botName}`))
	localStorage.setItem( "profileName", JSON.stringify( `${data.profileName}`))
	//localStorage.setItem( "messages", JSON.stringify( `${data.messages}`))

	localStorage.setItem( "systemStr", JSON.stringify( `${data.system}`))
	localStorage.setItem( "rpg", JSON.stringify( `${data.rpg}`))
	localStorage.setItem( "longDesc", JSON.stringify( `${data.longDesc}`))
	localStorage.setItem( "msgOne", JSON.stringify( `${data.msgOne}`))
	localStorage.setItem( "msgTwo", JSON.stringify( `${data.msgTwo}`))
	localStorage.setItem( "howManyInteractions", JSON.stringify( `${data.howManyInteractions}`))
      // TODO setChatMessages, set last response
         
      setChatMessages([])
         let historia = []
         data.history.forEach( (value, index) => {
	     historia.push( value.message )
	 })
      if (data.responses.length > 0 )
	  setChatMessages([...historia, { type: "bot", text: `${data.responses[0]}` }])
      else
	  setChatMessages([...historia])
        
  }

  const handleUpdateBotName = async (e) => {
    setLoading(true)
    let pName = e.currentTarget.textContent.trim();
    setInput("<Wait for directive to take effect>")
      try {
    //const response = await fetch("http://localhost:3000/api/profile" )
     const response = await fetch("http://localhost:3000/api/profile/bot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
	  bot: pName, request: "botname",
      })

      })

    const data = await response.json()
    
    dataToProfile(data);  

      } catch (e) {
	  alert(e)
      }

    setLoading(false)
  }
  const handleUpdateUserName = async (e) => {
    setLoading(true)
    let pName = e.currentTarget.textContent.trim();
    setInput("<Wait for directive to take effect>")
      try {
    //const response = await fetch("http://localhost:3000/api/profile/user" )
     const response = await fetch("http://localhost:3000/api/profile/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
	  user: pName, request: "username",
      })

      })

    const data = await response.json()
    
    dataToProfile(data);  

      } catch (e) {
	  alert(e)
      }

    setLoading(false)
  }

  const handleSwitchProfile = async (e) => {
    setLoading(true)
    let pName = e.currentTarget.textContent.trim();
    setInput("<Wait for directive to take effect>")
      try {
    //const response = await fetch("http://localhost:3000/api/profile" )
     const response = await fetch("http://localhost:3000/api/profile/name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
	  profileName: pName, request: "switch",
      })

      })

    const data = await response.json()
    setProfileName( pName )
    dataToProfile(data);  
    if (scrollDown.current)
	scrollDown.current.scrollIntoView({ behavior: "smooth" });
    setInput("")

      } catch (e) {
	  alert(e)
      }

    setLoading(false)
  }

 const handleRefreshProfile = async () => {
    setLoading(true)
     try {
    const response = await fetch("http://localhost:3000/api/refresh",{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      }
    })
    const data = await response.json()
    dataToProfile( data )
    
    if (scrollDown.current)
	scrollDown.current.scrollIntoView({ behavior: "smooth" });
      } catch (e) {
	  alert("Are you sure server is running?" + e)
      }
    setInput("")
    setLoading(false)
    //setInput(  JSON.stringify(user))
 }

 const handleGetProfile = async () => {
    setLoading(true)
     try {
    const response = await fetch("http://localhost:3000/api/profile",{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      }
    })
    const data = await response.json()
    dataToProfile( data )
    
    if (scrollDown.current)
	scrollDown.current.scrollIntoView({ behavior: "smooth" });
      } catch (e) {
	  alert("Are you sure server is running?" + e)
      }
    setInput("")
    setLoading(false)
    //setInput(  JSON.stringify(user))
 }

  useEffect( () => {
    setInput("<Starting>");

    async function fetchProfile() {
	const response = await fetch("http://localhost:3000/api/profile")
	const data = await response.json()
	dataToProfile( data )
	
	//setInput(  JSON.stringify(user))
	setInput("")
    }

    //fetchProfile()
    setInput("")
    //setUser(JSON.parse(localStorage.getItem('user')));
    
    }, [location])

  const handleClear = () => {
    setChatMessages([]);
  }
  const handleBack = async () => {
    const response = await fetch("http://localhost:3000/previous_response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
      })
    })
    const data = await response.json()

    setDisableBackReponse( data.isThisFirst === "true" ? true : false )
    let chatLog = chatMessages.slice(0,-1); 
    setChatMessages(chatLog);
    setChatMessages([...chatLog, {type: "bot", text: `${data.completionText}`}]) // bot
  }

  const handleNext = async () => {
    const response = await fetch("http://localhost:3000/next_response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
      })
    })
    const data = await response.json()
    let chatLog = chatMessages.slice(0,-1); 
    setChatMessages(chatLog);
    setChatMessages([...chatLog, {type: "bot", text: `${data.completionText}`}]) // bot
    //setDisableBackReponse( false )
  }

  const handleSubmit = async () => {
    if (!input) {
	return alert('empty input');
    } else { 
	let inputText = `${input}`
	if (inputText.startsWith("${bot}: "))
	    return handleEdit()
	else if (inputText.startsWith("/"))
	    if (inputText.startsWith("/profile "))
		return handleProfile()
	    else if (inputText.startsWith("/listfacts"))
		return handleListFacts()
	    else if (inputText.startsWith("/fact "))
		return handleFact()
	    else if (inputText.startsWith("/delfact "))
		return handleDelFact()
	    else if (inputText.startsWith("/help"))
		return handleHelp()
	    else 
		setInput("<error>");
	setOld(`${input}`);
    }
 /*   if(!user) {
      return alert('To initiate a conversation with the bot, please log in first.');
    }*/
    
    let chatLog = [...chatMessages, {type: "user", text: input}]
    setInput("");
    setChatMessages(chatLog)
      
    if(chatMessages.length > 0) {
      if (scrollDown.current) 
	  scrollDown.current.scrollIntoView({ behavior: "smooth"});
    }
    setLoading(true);

    function getLastThreeInteractions() {
      const parsedMessage = chatLog
        .slice(-howManyInteractions, -1) // około 100 tokenów na wypowiedź
        .map((message) => {
          const prefix = message.type === "user"
            ? `\n${user}: ${message.text}`
            : `\n${bot}: ${message.text}`;
          return prefix;
        })
        .join("");
      return parsedMessage;
    }
        
    const inputToEmbedd = `\n${user}: ${input}`;

    let x = -1;
    let candidate = ""
    let previous = ""
    do { // previous may be type == system
	previous = ""
	if (chatLog.slice(x-1, x).length == 0) break;
	candidate=chatLog.slice(x-1,x)[0]
	if (candidate.type =="system" || candidate.type=="user") {
	    x--;
	    continue
	}
	else{
	    previous = candidate.text
	    break;
        }
    } while ( x > -10)

    // handle completions
    const response = await fetch("http://localhost:3000/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
        inputToEmbedd: inputToEmbedd,
        input: input,
	previous: previous, //chatLog.slice(-2,-1)[0]?.text,
        //lastThreeInteractions: getLastThreeInteractions(),
        //   dbName: user?.result?.email,
        temperature: 0.717828233,
        ab: 0.115, 
      })
    })
    const data = await response.json()
    if(data?.errorMessage) {
	setLoading(false)
      return alert("There was an error while processing your request. Please try to refresh the page, if the error persists clear the chat and/or the cache.")
    }

    if(data.error === 1) {
      setChatMessages([...chatLog])
	setLoading(false)
      alert("There was an error while processing your request. Please try to refresh the page, if the error persists clear the chat and/or the cache.")
    } else {
      setChatMessages([...chatLog, {type: "bot", text: `${data.completionText}`}]) // bot
    }


    if (scrollDown.current)
	scrollDown.current.scrollIntoView({ behavior: "smooth" });
    
    setLoading(false);
    
  }

  const handleGet = async () => {
    let chatLog = chatMessages; // wysyłamy tę samą wiadomość
    //setInput( `${chatLog}`)
    function getLastInteraction() {
      const parsedMessage = chatLog
        .slice(-1) // około 100 tokenów na wypowiedź
        .map((message) => {
          const prefix = message.type === "user"
            ? `${user}: ${message.text}`
            : `${bot}: ${message.text}`;
          return prefix;
        })
        .join("");
      return parsedMessage;
    }
    let lastMsg = getLastInteraction()
    setInput( `${lastMsg}`)
   }

  const handleVariables = async () => {
    setLoading(true)
    let words = `${input}`.trim().split(' ')
  }

  const handleListFacts = async () => {
    setLoading(true)
    let words = `${input}`.trim().split(' ')
      try {
     const response = await fetch("http://localhost:3000/api/facts", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      }
      })

    const data = await response.json()

    let chatLog = [...chatMessages, 
	{type: "user", text: "/listfacts"}, 
	{type: "system", 
         text: `${data.facts}`
       }]
      setChatMessages( chatLog )

      } catch (e) {
	  alert(e)
      }
    setInput("")
    setLoading(false)
  }

  const handleDelFact = async () => {
    setLoading(true)
    let words = `${input}`.trim().split(' ')
     words.shift();
      let name = words.shift();
      try {
     const response = await fetch("http://localhost:3000/api/facts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
	  name: name
      })
     })

    const data = await response.json()

      } catch (e) {
	  alert(e)
      }
    setInput("")
    setLoading(false)
  }

  const handleFact = async () => {
    setLoading(true)
    let words = `${input}`.trim().split(' ')
     words.shift();
      let name = words.shift();
      let value = words.join(" ");
      try {
     const response = await fetch("http://localhost:3000/api/facts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
	  name: name, value: value
      })
     })

    const data = await response.json()

      } catch (e) {
	  alert(e)
      }
    setInput("")
    setLoading(false)
  }

  const handleHelp = async () => {
    let words = `${input}`.trim().split(' ')

    let chatLog = [...chatMessages, 
	{type: "user", text: "/help"}, 
	{type: "system", 
         text: "/profile name    : switches to new profile (creates it with default values if \"name\" does not exist\n"+
	       "/fact name value : sends new fact to the server to store\n"+
	       "/listfacts       : lists facts stored by  server\n" +
	       "/delfact name    : deletes fact\n" +
	       "you can use [[name:value]] to send more facts to server\n"
       }]
      setChatMessages( chatLog )
      setInput("")
  }
  const handleProfile = async () => {
    setLoading(true)
    let words = `${input}`.trim().split(' ')
    let pName = "default"
    if (words[1] ) pName = words[1]
    setInput("<Wait for directive to take effect>")
      try {
    //const response = await fetch("http://localhost:3000/api/profile" )
     const response = await fetch("http://localhost:3000/api/profile/name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
	  profile: pName 
      })

      })

    const data = await response.json()
    
    dataToProfile(data);  

      } catch (e) {
	  alert(e)
      }
    if (scrollDown.current)
	scrollDown.current.scrollIntoView({ behavior: "smooth" });
    setInput("")
    setLoading(false)
  }

  const handleSync = async () => {
    setLoading(true)
    setInput("<Wait for directive to take effect>")
      try {
     const response = await fetch("http://localhost:3000/api/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },

      })
    const data = await response.json()
      } catch (e) {
	  alert(e)
      }
    setInput("")
    setLoading(false)
  }

  const handleChatEdit = async (e) => {
    const inputToEmbedd = `\n${user}: ${old}`;
    let botMsg = e.currentTarget.textContent;
    setLoading(true)

    // handle completions
    setInput("<Wait for changes to take effect>")
    /*const response = await fetch("http://localhost:3000/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
        input: inputToEmbedd,
        output: `${bot} ${botMsg}`,
       // dbName: user?.result?.email,
      })
    })
    const data = await response.json() */

    let chatLog = [...chatMessages.slice(0,-1), {type: "bot", text: botMsg}]
    setChatMessages( chatLog );
    setLoading(false)
    setInput("")
  }

  const handleEdit = async () => {
    const inputToEmbedd = `\n${user}: ${old}`;
    setLoading(true)

    // handle completions
    setInput("<Wait for changes to take effect>")
    const response = await fetch("http://localhost:3000/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
        input: inputToEmbedd,
        output: `${input}`,
       // dbName: user?.result?.email,
      })
    })
    const data = await response.json()
    let inputText = `${input}`.slice(4)
    let chatLog = [...chatMessages.slice(0,-1), {type: "bot", text: inputText}]
    setChatMessages( chatLog );
    setLoading(false)
    setInput("")
   }

  const handleRollback = async () => {
    let last = chatMessages.slice(-1)[0]
    let chatLog = chatMessages.slice(0,-2); // wysyłamy tę samą wiadomość

    setChatMessages(chatLog);

    if(chatMessages.length > 0) {
      if (scrollDown.current)	
	  scrollDown.current.scrollIntoView({ behavior: "smooth"});
    }

   // scrollDown.current.scrollIntoView({ behavior: "smooth" });
    if (!(last.type ==="system")){
	const response = await fetch("http://localhost:3000/rollback", {
	  method: "POST",
	  headers: {
	    "Content-Type": "application/json",
	    "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
	  },
	  body: JSON.stringify({
	      last: last.type, value: `${last.text}`
	  })
	})
	const data = await response.json()
    }
    
  }

  const handleMoreResponses = async () => {
   setLoading(true)
    const response = await fetch("http://localhost:3000/more_responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
        temperature: 0.717828233,
        ab: 0.115, 
      })
    })
    const data = await response.json()
    if(data?.errorMessage) {
      setLoading(false)
      return alert("There was an error while processing your request. Please try to refresh the page, if the error persists clear the chat and/or the cache.")
    }
    let chatLog = chatMessages.slice(0,-1); 

    if(data.error === 1) {
      setChatMessages([...chatLog])
      setLoading(false)
      alert("There was an error while processing your request. Please try to refresh the page, if the error persists clear the chat and/or the cache.")
    } else {
      setChatMessages([...chatLog, {type: "bot", text: `${data.completionText}`}]) // bot
    }

    if (scrollDown.current)
	scrollDown.current.scrollIntoView({ behavior: "smooth" });
    
    setLoading(false);
  }

  const handleRegenerate = async () => {

    let chatLog = chatMessages.slice(0,-1); // wysyłamy tę samą wiadomość
    setChatMessages(chatLog);

      
   setLoading(true)
   // scrollDown.current.scrollIntoView({ behavior: "smooth" });
    const responseRollback = await fetch("http://localhost:3000/rollback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
        //dbName: user?.result?.email,
      })
    })
    const dataRollback = await responseRollback.json()
    // resend previous data
    function getLastThreeInteractions() {
      const parsedMessage = chatLog
        .slice(-howManyInteractions, -1) // około 100 tokenów na wypowiedź
        .map((message) => {
          const prefix = message.type === "user"
            ? `\n${user}: ${message.text}`
            : `\n${bot}: ${message.text}`;
          return prefix;
        })
        .join("");
      return parsedMessage;
    }
        
    const inputToEmbedd = `\n${user}: ${old}`;

    // handle completions
    const response = await fetch("http://localhost:3000/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
        inputToEmbedd: inputToEmbedd,
        input: old,
        lastThreeInteractions: getLastThreeInteractions(),
        //dbName: user?.result?.email,
        temperature: 0.717828233,
        ab: 0.115, 
      })
    })
    const data = await response.json()
    if(data?.errorMessage) {
      setLoading(false)
      return alert("There was an error while processing your request. Please try to refresh the page, if the error persists clear the chat and/or the cache.")
    }

    
    if(data.error === 1) {
      setChatMessages([...chatLog])
      setLoading(false)
      alert("There was an error while processing your request. Please try to refresh the page, if the error persists clear the chat and/or the cache.")
    } else {
      
      setChatMessages([...chatLog, {type: "bot", text: `${data.completionText}`}]) // bot
    }

    if (scrollDown.current)
	scrollDown.current.scrollIntoView({ behavior: "smooth" });
    
    setLoading(false);

    
  }

  return (
    <ChatContext.Provider value={{
      user, setUser, profileName, setProfileName, bot, setBot,
	    connected, setConnected, input, setInput, old, setOld, loading, setLoading, open, setOpen, scrollDown, handleClear, handleSubmit, handleRegenerate, handleRollback, handleEdit, handleGet, handleChatEdit, handleBack, handleNext, handleMoreResponses, handleGetProfile, chatMessages,
      handleSwitchProfile, handleUpdateBotName, handleUpdateUserName, handleSaveProfile, handleRefreshProfile
    }}>
      {children}
    </ChatContext.Provider>
  );
}




export { ChatContext, ChatProvider };
