const { CommandType } = require("wokcommands");
const { mongoClient } = require("../..");

const jobs = [
<<<<<<< Updated upstream
    {
        name: "Tesla Investor",
        earnings: -10000
    },
    {
        name: "Tech CEO",
        earnings: 2000
    },
    {
        name: "Taxi Driver",
        earnings: 250
    },
    {
        name: "Fry Cook",
        earnings: 300
    },
    {
        name: "Discord Moderator",
        earnings: 150
    },
    {
        name: "EECS 370 IA",
        earnings: 300
    },
    {
        name: "EECS 281 IA",
        earnings: 301
    },
    {
        name: "Comedian",
        earnings: 690
    },
    {
        name: "Chick Sexer (identify sex of chickens)",
        earnings: 450
    },
    {
        name: "Plumber",
        earnings: 390
    },
    {
        name: "Electrician",
        earnings: 385
    },
    {
        name: "Bitcoin Hodler",
        earnings: -100
    },
    {
        name: "Santa",
        earnings: 450
    },
    {
        name: "Public Water Fountain Coin Scavenger",
        earnings: 800
    },
    {
        name: "Minecraft YouTuber",
        earnings: 999
    },
    {
        name: "Twitch Streamer",
        earnings: 5
    },
    {
        name: "TikTok Influencer",
        earnings: -420
    },
    {
        name: "MBus Driver",
        earnings: 2
    }
]
=======
    {name:"Tesla Investor",earnings:-10000}, 
    {name:"Tech CEO",earnings:2000},
    {name:"Taxi Driver",earnings:250},
    {name:"Fry Cook (making french fries all day)",earnings:300},
    {name:"Discord Moderator",earnings:150},
    {name:"EECS370 IA",earnings:300},
    {name:"EECS281 IA",earnings: 301},
    {name:"Comedian",earnings:690},
    {name:"Chick Sexer (identify sex of chickens)",earnings:450},
    {name:"Plumber",earnings:390},
    {name:"Electrician",earnings:385},
    {name:"Circuit City CEO",earnings:50},
    {name:"Santa",earnings:450},
    {name:"Public Water Fountain Coin Scavenger",earnings:800}
];
>>>>>>> Stashed changes

module.exports = {
    // Required for slash commands
    description: "Pick this if you are unemployed! 😀",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({ user }) => {
        try {
            let db = await mongoClient.db('botCasino');
            let _user = await db.collection('users').findOne(
                {
                    user_id: user.id,
                }
            );
            if (_user == undefined || _user == null || _user == NaN) {
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                }
            }
            if (!_user.employed) {
                var random_job = jobs[Math.floor(Math.random() * jobs.length)];
                db.collection('users').updateOne({ user_id: user.id }, {
                    $set: {
                        employed: true,
                        income: random_job.earnings
                    },
                    $inc: {
                        coins: random_job.earnings
                    }
                });
                return {
                    content: "Congratulations! You've been hired as a " + random_job.name + "! You'll be earning an income of " + random_job.earnings + ", and a starting bonus of this amount has been added to your bank account. 🤑"
                }
            } else {
                return {
                    content: "Sorry, you've already got a job! Why are you trying to get another? Save some for the rest of us!",
                }
            }
        } catch (e) {
            console.error(e);
            return {
                content: "☠️ Oops! Something went wrong on my end."
            }
        }
    }
}