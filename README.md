## A-Bot
### Overview
A-Bot is a simple discord bot

__Features__<br>
A-Bot features a number of features that are quite unique! These include:<br>
&nbsp;&nbsp;&nbsp;• Server management<br>
&nbsp;&nbsp;&nbsp;• BotCasino and other entertainment features<br>
&nbsp;&nbsp;&nbsp;• Whatever other random commands you'd probably expect a general-purpose bot to do<br>
### Functionality and setup
A-Bot runs using a MongoDB database and can be hosted however you like. To set it up, you will need to set up your own mongoDB cluster and create a collection called "botCasino". Follow MongoDB's connection instructions and add your connection string to `config.json`.

### Commands List

See commands listed below:

__General Use__<br>
`/help` *prints this list*

__Administration__<br>
`/send`<br>
`/reply`<br>
`/react`<br>
`/invite <total_invites>` *generates invite link with finite specified invites*

__BotCasino__<br>
`/joincasino`<br>
`/leavecasino`<br>
`/getjob`<br>
`/work`<br>
`/coins`<br>
`/dice <bet_amount>`<br>
`/roshambo <bet_amount>`<br>
`/roulette <bet_amount>`<br>
`/guess <bet_amount>`

__Miscellanious__<br>
`/gpr` *grass privileges revoked*
