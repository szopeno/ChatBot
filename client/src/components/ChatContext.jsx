import React, { useState, createContext, useRef, useEffect } from "react";


const ChatContext = createContext();

const ChatProvider = ({children}) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState("");
  const [old, setOld] = useState("");
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

    fetchProfile()
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
    setDisableBackReponse( false )
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
	    else if (inputText.startsWith("/sync"))
		return handleSync()
	    else if (inputText.startsWith("/set "))
		return handleSetVariables()
	    else if (inputText.startsWith("/system "))
		return handleSystem()
	    else if (inputText.startsWith("/addmsg "))
		return handleAddMsg()
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
	previous: chatLog.slice(-2,-1)[0]?.text,
        lastThreeInteractions: getLastThreeInteractions(),
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

  const handleSystem = async () => {
    setLoading(true)
    let words = `${input}`.trim().split(' ')
  }
  const handleAddMsg = async () => {
    setLoading(true)
    let words = `${input}`.trim().split(' ')
  }

  const handleProfile = async () => {
    setLoading(true)
    let words = `${input}`.trim().split(' ')
    let pName = "default"
    let uName = "user"
    let bName = "bot"
    if (words[1] ) pName = words[1]
    if (words[2] ) uName = words[2]
    if (words[3] ) bName = words[3]
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
	  profile: pName, botName: bName, userName: uName, howManyInteractions: howManyInteractions, 
	  longDesc: longDesc, rpg: rpg, system: systemStr, msgOne: msgOne, msgTwo: msgTwo,
	  update: false
      })

      })

    const data = await response.json()
    
    dataToProfile(data);  

      } catch (e) {
	  alert(e)
      }

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
    let chatLog = chatMessages.slice(0,-2); // wysyłamy tę samą wiadomość
    setChatMessages(chatLog);

    if(!user) {
      return alert('To initiate a conversation with the bot, please log in first.');
    }
      
    if(chatMessages.length > 0) {
      if (scrollDown.current)	
	  scrollDown.current.scrollIntoView({ behavior: "smooth"});
    }

   // scrollDown.current.scrollIntoView({ behavior: "smooth" });
    const response = await fetch("http://localhost:3000/rollback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
      },
      body: JSON.stringify({
        //dbName: user?.result?.email,
      })
    })
    const data = await response.json()
    
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
      input, setInput, old, setOld, loading, setLoading, open, setOpen, scrollDown, handleClear, handleSubmit, handleRegenerate, handleRollback, handleEdit, handleGet, handleChatEdit, handleBack, handleNext, handleMoreResponses, chatMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
}




export { ChatContext, ChatProvider };
