import React, { useState } from 'react';
import { useContext } from "react";
import { ChatContext } from "../ChatContext";
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Typography, Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link, useLocation } from 'react-router-dom';
import { SAVE_PROFILE } from '../../constants/actionTypes';
import useStyles from './styles';
import jwt_decode from "jwt-decode";
import saveButton from "../../assets/icons8-upload-100.png"


const Profile = () => {
  const {
    //loading,
    bot, setBot,
    user, setUser,
    profileName, setProfileName,
    handleProfile, handleSaveProfile
} = useContext(ChatContext)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
//const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
//const [bot, setBot] = useState(JSON.parse(localStorage.getItem('bot')));
//const [profileName, setProfileName] = useState(JSON.parse(localStorage.getItem('profileName')));
  const [howManyInteractions, setHowManyInteractions] = useState(JSON.parse(localStorage.getItem('howManyInteractions')));

  const [systemStr, setSystemStr] = useState(JSON.parse(localStorage.getItem('systemStr')));
  const [rpg, setRpg] = useState(JSON.parse(localStorage.getItem('rpg')));
  const [longDesc, setLongDesc] = useState(JSON.parse(localStorage.getItem('longDesc')));
  const [msgOne, setMsgOne] = useState(JSON.parse(localStorage.getItem('msgOne')));
  const [msgTwo, setMsgTwo] = useState(JSON.parse(localStorage.getItem('msgTwo')));

  const saveProfile = (event) => {
      handleSaveProfile(event)
    /*
    setProfileName( event.target.profile.value )
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
    localStorage.setItem( "msgTwo", JSON.stringify( event.target.msgtwo.value ))*/

    /*dispatch({ type: SAVE_PROFILE, data: { 
	  name: profileName, bot: bot, user: user, howManyInteractions: howManyInteractions, 
	  longDesc: longDesc, rpg: rpg, system: systemStr, msgOne: msgOne, msgTwo: msgTwo,
	  update: true
    }}) */
    navigate("/")
  }

  let state = user
          //<div className={classes.profile}>
	    //<div class="grid grid-cols-3 gap-4">
      //<Paper className={classes.paper} elevation={3}>
  return (
    <Container component="main"  className='h-screen'>
      <Paper className={classes.paper} elevation={3}>
        <Typography className="self-center bold" component="h1" variant="button">{ 'Profile' }</Typography>
        
        {(
	    <form className="space-x-4" onSubmit={saveProfile}>
	        <div className="flex flex-row gap-4 basis-0">
		<div className="basis-1/5">
		    <label htmlFor="profile" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile</label>
		    <input type="text" id="profile" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={profileName}/>
		    <label htmlFor="user" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User</label>
		    <input type="textarea" id="user" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={user}/>
		    <label htmlFor="bot" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">AI character name</label>
		    <input type="text" id="bot" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 enabled" defaultValue={bot}/>
		    <label htmlFor="howmany" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last interactions</label>
		    <input type="number" id="howmany" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 enabled" defaultValue={howManyInteractions}/>
		</div>
		<div className="basis-2/5">
		    <label htmlFor="system" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">System</label>
		    <textarea id="system" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" rows="3" defaultValue={systemStr}/>
		    <label htmlFor="rpg" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">RPG Setup</label>
		    <textarea id="rpg" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" rows="2" defaultValue={rpg}/>
		    <label htmlFor="longDesc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Long description</label>
		    <textarea id="longDesc" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" rows="3" defaultValue={longDesc}/>
		</div>
		<div className="basis-2/5">
		    <label htmlFor="msgone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Message 1</label>
		    <textarea id="msgone" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" rows="3" defaultValue={msgOne} />
		    <label htmlFor="msgtwo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Message 2</label>
		    <textarea id="msgtwo" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" rows="3" defaultValue={msgTwo} />
		</div>
		</div>
	        <div className="flex flex-column gap-4 mt-4">
	      <Link to="/" className="self-center bg-[#2952e3] py-2 px-7 mx-4 h-10 rounded-full cursor-pointer hover:bg-[#2546bd]">
		Back
	      </Link>
	        <input type="submit" value="Save Profile" className="bg-[#2952e3] h-10 py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]"/> 
		</div>
	    </form>
        )}
        {(
	    <div>
	    </div>
        )}

      </Paper>
    </Container>
  );
};

export default Profile;
