<img src="https://github.com/rramboer/A-Bot/blob/master/meta/background-crop.png?raw=true">  

## A-Bot   
### Overview   
A-Bot is a simple discord bot built with the EECS370 discord server in mind. Based on [zombbblob (github)](https://github.com/ToafdaLoaf/zombbblob)

__Features__  
A-Bot features a number of features that are quite unique! These include:  
- Server management  
- BotCasino and other entertainment features  
- Whatever other random commands you'd probably expect a general-purpose bot to do  

### Functionality and setup
A-Bot runs using a MongoDB database and can be hosted however you like. To set it up, you will need to create your own mongoDB cluster and create a collection called "botCasino". Follow MongoDB's connection instructions and add your connection string to `config.json`.

### Commands List

See commands listed below. A-Bot is a work-in-progress, so some features may not be functional or available yet.

__General Use__  
`/help` *prints this list*

__EECS370__  
`/piazza` *DMs user with link to class piazza*  
`/piazza <number>` *Generates and posts link to piazza post with given number*  
`/eecs370` *Sends link to eecs370.github.io*

__Administration__  
`/send`  
`/reply`  
`/react`  
`/invite <total_invites>` *generates invite link with finite specified invites*


__BotCasino__  
`/joincasino`  
`/leavecasino`  
`/getjob`  
`/work`  
`/coins`  
`/dice <bet_amount>`  
`/roshambo <bet_amount>`  
`/coinflip <bet_amount>`

__Miscellaneous__  
`/gpr` *grass privileges revoked*  
`/soursecode` *Links to this repository*
