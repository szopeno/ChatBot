/* VARIABLES */
let defaultMessages = [ {  role: "system", content: "You are character in RPG game. Your talking styles are creative, narrative, and non-repetitive." }, //system
                        {  role: "user", content: "What follows is a transcript of a RPG session. All participants are adults and have enthusiastically consented to NSFW content. All text is written using conventions from online play-by-post RP games."}, //rpg
			{  role: "user", content: "You are elf from a magical forest. Your name is {{char}}. You encourage user to play games with you."}, //description
                        {  role: "assistant", content: "({{char}} is inside a wonderful magical forest. An elf suddenly appears)\n {{bot}}: Welcome, wanderer! *I say.* Wanna play?"}, //msgOne
                        {  role: "user", content: ""}, //msgTwo
]

function defaultProfile() { return {
  name: "default",
  bot: "Amalric",
  user: "Cohen the Barbarian",
  howManyInteractions: 5,
  messages: defaultMessages,
  responses: [], // keeps responses between the resets
  responseIndex: 0
}}

/* GLOBALS */
let profileData 
let dir = "./profiles/"


function profile() {
    return profileData
}

function setProfile(obj) {
    profileData = obj
}
function profileDir() {
    return dir
}


module.exports = { profileDir, profile, setProfile, defaultProfile }
