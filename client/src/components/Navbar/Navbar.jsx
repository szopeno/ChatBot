import { HiMenu } from "react-icons/hi";

import { AiOutlineClose } from "react-icons/ai";
import { useContext } from "react";
import { ChatContext } from "../ChatContext";
import OpenIcon from "../OpenIcon";
import { createOrFetchUser }from "../../assets/functions"
import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode'; 
import useStyles from './styles';
import { CONNECT, CLEAR_CACHE, CLEAR_FACTS } from '../../constants/actionTypes';
import { MdDelete, MdLogin, MdRefresh } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

// import memories from '../../images/memories.png';
// import * as actionType from '../../constants/actionTypes';
// import useStyles from './styles';

const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
  );
  
  const Navbar = () => {
    const [toggleMobile, setToggleMobile] = useState(false);
    const [loading, setLoading] = useState(false);
    //const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    //const [bot, setBot] = useState(JSON.parse(localStorage.getItem('bot')));
    //const [profileName, setProfileName] = useState(JSON.parse(localStorage.getItem('profileName')));
    const { open } = useContext(ChatContext)
    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();
    const implemented = false;
    
  const {
    //loading,
    bot,
    user,
    profileName,
    connected, setConnected,
    handleSwitchProfile,
    handleUpdateUserName,
    handleUpdateBotName,
    handleGetProfile,
    handleRefreshProfile,
} = useContext(ChatContext)
    
    useEffect(() => {
    // const token = user?.token;
    //setUser(JSON.parse(localStorage.getItem('user')));
    }, [location])

  const logout = () => {
    dispatch({ type: LOGOUT });

    // history.push('/auth');

    setUser(null);
    window.location.reload();

    if(toggleMobile) {
      setToggleMobile(false);
    }
  };

  const clearCache = () => {
    setLoading(true)
    dispatch({ type: CLEAR_CACHE, data: { file: user?.result?.email + ".json" } });
    setLoading(false)
  }

  const clearFacts = () => {
    setLoading(true)
    dispatch({ type: CLEAR_FACTS, data: { file: user?.result?.email + ".json" } });
    setLoading(false)
    
  }



  const connect = () => {
    setLoading(true)
    handleGetProfile()
    setConnected(true)
    setLoading(false)
    
  }

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4 gap-4">
      <div className="md:flex-[0.49] flex-initial justify-center items-center">
        {(
	  <div>
	      <Button startIcon={<MdRefresh />} variant="contained" className={classes.clearButton} disabled={loading} onClick={connect}>{ connected ? "Reconnect" :"Connect"}</Button>
	  </div>
        )}
      </div>
      <div className="md:flex-[0.49] flex-initial justify-center items-center">
        {connected && (
	  <div className="flex flex-col gap-4">
	      <Button startIcon={<MdDelete />} variant="contained" className={classes.clearButton} disabled={loading} onClick={clearCache}>Clear History</Button>
	      <Button startIcon={<MdDelete />} variant="contained" className={classes.clearButton} disabled={loading} onClick={clearFacts}>Clear Facts</Button>
	  </div>
        )}
      </div>
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <h1 className="text-[40px] font-serif text-white cursor-pointer">{`NISIDA`}</h1>
	<Typography className={`flex items-center text-white`} variant="h6">Modified for RPG chats</Typography>
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {[""].map((item, index) => (
          <NavBarItem key={item + index} title={item} />
          ))}
        {implemented && (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user?.result.name.charAt(0)} src={user?.result.picture}>{user?.result.name.charAt(0)}</Avatar> 
            <Button startIcon={<FiLogOut />} variant="contained"  className={classes.logout} onClick={logout}>Logout</Button>
          </div>
        )}  
        {connected && (
          <div className={classes.profile}>
	     <div>
	      <Typography className={`flex items-center text-white`} variant="h6">Profile:</Typography>
	      <Typography className={`flex items-center text-white`} variant="h6" contentEditable="true" suppressContentEditableWarning={true}
		onBlur={handleSwitchProfile}
		onKeyDown={(e) => {
		  if(e.key === "Enter" && ! event.shiftKey) {
		    blur()
		      e.preventDefault()
		  }
		}}
	      > {profileName}</Typography>
	    </div>
	     <div>
	      <Typography className={`flex items-center text-white`} variant="h6">You:</Typography>
	      <Typography className={`flex items-center text-white`} variant="h6" contentEditable="true" suppressContentEditableWarning={true}
	      onBlur={handleUpdateUserName}
		onKeyDown={(e) => {
		  if(e.key === "Enter" && ! event.shiftKey) {
		    blur()
		      e.preventDefault()
		  }
		}}
	      > {user}</Typography>
	    </div>
	     <div>
	      <Typography className={`flex items-center text-white`} variant="h6">Ai Character:</Typography>
	      <Typography className={`flex items-center text-white`} variant="h6" contentEditable="true" suppressContentEditableWarning={true}
	      onBlur={handleUpdateBotName}
		onKeyDown={(e) => {
		  if(e.key === "Enter" && ! event.shiftKey) {
		    blur()
		      e.preventDefault()
		  }
		}}
	      > {bot}</Typography>
	    </div>
	  </div>
	)}
        {connected && (
          <Link to="/profile" className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
            Profile
          </Link>
        )}
      </ul>
      <div className=""> /* // no support for mobile devices 
        {!toggleMobile && (
          <HiMenu fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMobile(true)} />
        )}
        {toggleMobile && (
          <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMobile(false)} />
        )}
        {toggleMobile && (
          <ul className="z-10 fixed -top-0 -right-2 p-3 w-[50vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-center rounded-md blue-glassmorphism text-white animate-slide-in">
          <li className="text-xl w-full my-2">
            <AiOutlineClose className="cursor-pointer" onClick={() => setToggleMobile(false)} />
          </li>
          <div className="flex flex-col items-center justify-center space-y-4 mt-4">
            {user?.result ? (
              <>
                <Avatar
                  className={""}
                  alt={user?.result.name.charAt(0)}
                  src={user?.result.picture}
                >
                  {user?.result.name.charAt(0)}
                </Avatar>
                  <p className="text-gray-200 mb-">{user?.result.name}</p>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Button
                    startIcon={<FiLogOut />}
                    variant="contained"
                    className={classes.logoutMobile}
                    onClick={logout}
                  >
                    Logout
                  </Button>
                  {user && (
                    <Button
                      startIcon={<MdDelete />}
                      variant="contained"
                      className={classes.clearButtonMobile}
                      disabled={!user}
                      onClick={clearCache}
                    >
                      Clear Cache
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <Link 
                to="/oauth"
                className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]" 
                onClick={() => {if(toggleMobile) {setToggleMobile(false)}}}
              >
                Login
              </Link>
              )}
          </div>
        </ul>
        
        )} */
      </div>
    </nav>
  );
};

export default Navbar;
