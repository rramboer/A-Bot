## A-Bot
### Overview
A-Bot is a simple discord bot

__Features__
A-Bot features a number of features that are quite unique! These include:
&nbsp;&nbsp;&nbsp;• Server management
&nbsp;&nbsp;&nbsp;• BotCasino and other entertainment features
&nbsp;&nbsp;&nbsp;• Whatever other random commands you'd probably expect a general-purpose bot to do
### Functionality and setup
A-Bot runs using a MongoDB database and can be hosted however you like. To set it up, you will need to set up your own mongoDB cluster and create a collection called "botCasino". Follow MongoDB's connection instructions and add your connection string to `config.json`.

### Commands List

See commands listed below:

__General Use__
`/help` *prints this list* 

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
`/roulette <bet_amount>`
`/guess <bet_amount>`

__Miscellanious__
`/gpr` *grass privileges revoked*