import * as actionType from '../constants/actionTypes';
import { useContext } from "react";
import { ChatContext } from "../components/ChatContext";


const authReducer = async (state = { authData: null }, action) => {
  switch (action.type) {
    case actionType.AUTH: // will be killed
    localStorage.setItem('user', JSON.stringify({...action?.data}));
    return {...state, authData: action?.data};

    
    case actionType.LOGOUT: // will be killed
      localStorage.clear();

      return { ...state, authData: null, loading: false, errors: null };

    case actionType.CONNECT:
	  try {
	     localStorage.clear();
	     localStorage.setItem('connected', JSON.stringify(true));
	     setConnected("true")
	     let str = action?.data 
	     const response = await fetch("http://localhost:3000/api/profile", { // GET
	      headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
	      },
	      }) 

	    const data = await response.json() 
	      // update profile?!

      } catch (e) {
	  alert(e)
      };
	return {...state, authData: null, errors: null }

    case actionType.SAVE_PROFILE:
	  try {
	     let str = action?.data 
	     const response = await fetch("http://localhost:3000/api/profile", {
	      method: "POST",
	      headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${import.meta.env.VITE_Api_Key}`
	      },
	      body: JSON.stringify(
		  str
	      )

	      }) 

	    const data = await response.json() 

      } catch (e) {
	  alert(e)
      };
	return {...state, authData: null, errors: null }

    case actionType.CLEAR_CACHE:
      const clearCache = await fetch("http://localhost:3000/api/reset_history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {request: "delete", file: action?.data?.file},
        })
      })
      const data = await clearCache.json()
      if(data?.error) {
        return alert("There was an error while processing your request. Please try to refresh the page, if the error persists clear the chat and/or the cache. Finally if the erorr is still present try again later.")
      }
      console.log(data.error)

      if(data.status === "File already cleared") {
        alert("Cache already cleared")
      }  else {
        alert("History of conversation have been cleared, and now the cache is cleaned")
      }
	  break;

    case actionType.CLEAR_FACTS:
      const clearFacts = await fetch("http://localhost:3000/api/reset_facts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {request: "delete", file: action?.data?.file},
        })
      })
      const dataF = await clearFacts.json()
      if(dataF?.error) {
        return alert("There was an error while processing your request. Please try to refresh the page, if the error persists clear the chat and/or the cache. Finally if the erorr is still present try again later.")
      }
      console.log(dataF.error)

      if(dataF.status === "File already cleared") {
        alert("Cache already cleared")
      }  else {
        alert("All the facts have been cleared, and now the cache is cleaned")
      }

    default:
        return state;
    }
};

export default authReducer;
