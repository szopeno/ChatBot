import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from "react-router-dom"
import '../index.css';
import"../App.css"

import sendicon from "../assets/sendicon.png";
import geticon from "../assets/icons8-downloading-updates-100.png";
import editicon from "../assets/icons8-upload-100.png";
import resendicon from "../assets/icons8-available-updates-100.png";
import backicon from "../assets/icons8-back-to-100.png";
import nexticon from "../assets/icons8-next-page-100.png";
import moreicon from "../assets/icons8-addc-100.png";
import rollbackicon from "../assets/icons8-undo-100.png";
import clearChat from "../assets/deleteicon.png"
import Sidebar from './Sidebar';
import { ChatContext } from './ChatContext';



function Welcome() {

   // const [bot, setBot] = useState(JSON.parse(localStorage.getItem('bot')));
   // const [disableBackResponse, setDisableBackReponse] = useState(true);
  const {
    input,
    setInput,
    scrollDown,
    handleClear,
    handleRegenerate,
    handleRollback,
    handleSubmit,
    handleEdit,
    handleChatEdit,
    handleGet,
    handleBack,
    handleNext,
    handleMoreResponses,
    loading,
    bot,
    disableBackResponse,
    // loadingCustomization,
    open,
    setOpen,
    // setCustomizedPrompt,
    // customizedInput,
    // setCustomizedInput,
    // handleCustomization,
    chatMessages
} = useContext(ChatContext)

  return (
    <div className="responsive px-4 pb-4 flex justify-center">
      {/* <Sidebar
        open={open}
        setOpen={setOpen}
        // handleCustomization={handleCustomization}
        loading={loading}
        // loadingCustomization={loadingCustomization}
        // customizedInput={customizedInput}
        // setCustomizedInput={setCustomizedInput}
        // setCustomizedPrompt={setCustomizedPrompt}
        classNames={` ${
          open ? "w-[30%] sidebar h-[100%] mr-8 overflow-y-scroll scrollable transition duration-600" : "hidden"
        } h-screen p-4 pt-4 relative transition duration-300 hidden-mobile`}
        fontSize={22}
      />
      <Sidebar
        open={open}
        setOpen={setOpen}
        // handleCustomization={handleCustomization}
        loading={loading}
        // loadingCustomization={loadingCustomization}
        // customizedInput={customizedInput}
        // setCustomizedInput={setCustomizedInput}
        // setCustomizedPrompt={setCustomizedPrompt}
        classNames={` ${
          open ? "w-full h-screen sidebar-mobile mr-8 z-10 fixed -top-0 left-0" : "hidden"
        } p-4 pt-4 duration-300 hidden-lg h-[screen]`}
        fontSize={20} <!--// message.type==bot poniżej było-->

            {chatMessages.map((message, index) => (
            <div key={index} className={`my-2 ${message.type === 'user' ? 'text-gray-900' : 'text-gray-700'}`}> 
              <p className="font-bold text-gray-600">{message.type === 'user' ? 'You' : bot}</p>
              <p ref={scrollDown} className='text-white'>{message.text}</p>
            </div>  
          ))}

            {chatMessages.map((message, index) => {
		if (index<chatMessages.size || (message.type === 'user')) {(
		    <div key={index} className={`my-2 ${message.type === 'user' ? 'text-gray-900' : 'text-gray-700'}`}> 
		      <p className="font-bold text-gray-600">{message.type === 'user' ? 'You' : bot} : {index}</p>
		      <p ref={scrollDown} className='text-white'>{message.text}</p>
		    </div>  
		)}else {(
		    <div key={index} className={`my-2 ${message.type === 'user' ? 'text-gray-900' : 'text-gray-700'}`}> 
		      <p className="font-bold text-gray-600">{message.type === 'user' ? 'You' : bot} : {index}</p>
		      <p ref={scrollDown} contentEditable="true" className='text-white'>LAST: {message.text}</p>
		    </div>  
		)}
	        }
          )}

		 <button
              className="cursor-pointer inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
              onClick={handleRegenerate}
              disabled={loading}
              >
              <img className="w-7" src={resendicon} alt="resend icon" />
		</button>

          <span className="absolute left-4 bottom-0 flex items-center">
            <button
              className="cursor-pointer inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
              onClick={handleRollback}
              disabled={loading}
            >
              <img className="w-5" src={rollbackicon} alt="rollback icon" />
            </button>
          </span>

          <span className="absolute -left-4 top-0 flex items-center">
            <button
              className="cursor-pointer inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
              onClick={handleRegenerate}
              disabled={loading}
            >
              <img className="w-7" src={resendicon} alt="resend icon" />
            </button>
          </span>

          <span className="absolute left-4 top-0 flex items-center">
            <button
              className="cursor-pointer inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
              onClick={handleGet}
              disabled={loading}
            >
              <img className="w-7" src={geticon} alt="geticon icon" />
            </button>
          </span>
      /> */} 
      <div className="scrollable rounded-lg h-[100%] shadow-md p-6 blue-glassmorphism w-full overflow-y-scroll">
          <div className="flex flex-col items-start flex-grow mb-6 min-h-[90%]">
            {chatMessages.map((message, index) => (
            <div key={index} className={`my-2 ${message.type === 'user' ? 'text-gray-900' : 'text-gray-700'}`}> 
              <p className="font-bold text-gray-600">{message.type === 'user' ? 'You' : bot}</p>
              <p ref={scrollDown} contentEditable={(index == chatMessages.length-1) ? "true" : "false"} className='text-white' {...((index== chatMessages.length-1)? {onBlur: handleChatEdit}:{})} suppressContentEditableWarning={true}>{message.text}</p>
             { (index==chatMessages.length-1 && message.type === "bot") && ( <div>
		 <button
              className="cursor-pointer inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
              onClick={handleBack}
              disabled={(loading || (disableBackResponse))}
              >
              <img className="w-12" src={backicon} alt="back icon" />
		</button>
		 <button
              className="cursor-pointer inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
              onClick={handleNext}
              disabled={(loading)}
              >
              <img className="w-12" src={nexticon} alt="next icon" />
		</button>

		 <button
              className="cursor-pointer inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
              onClick={handleMoreResponses}
              disabled={(loading)}
              >
              <img className="w-12" src={moreicon} alt="more icon" />
		</button>

		 </div>
	      )
	     }
             { (index==chatMessages.length-2 && message.type==='user') && ( <div>
		 <button
              className="cursor-pointer inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
              onClick={handleRollback}
              >
              <img className="w-7" src={rollbackicon} alt="rollback icon" />
		</button>


		 </div>
	      )
	     }
            </div>  
          ))}
          {loading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"/>
          )}
          </div>
        <div className="mt-4 relative bottom-0 left-0 w-full">
        <span className="absolute -left-4 bottom-0 flex items-center"> 
            <button
              className="cursor-pointer inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-red-500 hover:bg-gray-300"
              onClick={handleClear}
              disabled={loading}
            >
              <img className="w-7" src={clearChat} alt="clear icon" />
            </button>
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center">
            <button
              className="cursor-pointer inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
              onClick={handleSubmit}
              disabled={loading}
            >
              <img className="w-7" src={sendicon} alt="send icon" />
            </button>
          </span>
          <textarea
            className="rounded-full py-2 pl-12 pr-12 block w-full appearance-none text-white leading-normal white-glassmorphism outline-none"
            type="text"
            placeholder="Write something"
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
            }}
            onKeyUp={(e) => {
              if(loading === true) return;
              if(e.key === "Enter" && ! event.shiftKey) {
                handleSubmit()
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Welcome;
