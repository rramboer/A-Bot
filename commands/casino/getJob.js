const { CommandType } = require("wokcommands");
const { mongoClient } = require("../..");

const jobs = [
    { name: "Lottery Winner", earnings: 1000 },
    { name: "OnlyFans Content Creator", earnings: 975 },
    { name: "Bitcoin Miner", earnings: 950 },
    { name: "Twitter CEO", earnings: 925 },
    { name: "Crypto Shitcoin Creator", earnings: 900 },
    { name: "Call Center Scammer", earnings: 875 },
    { name: "Google Software Engineer", earnings: 850 },
    { name: "Gucci Designer", earnings: 825 },
    { name: "Amphetamine Dealer", earnings: 800 },
    { name: "Drug Mule", earnings: 775 },
    { name: "Minecraft YouTuber", earnings: 750 },
    { name: "Corrupt Politician", earnings: 725 },
    { name: "UMich Professor", earnings: 700 },
    { name: "Corporate Lawyer", earnings: 675 },
    { name: "Twitch Streamer", earnings: 650 },
    { name: "eBay Shoe Reseller", earnings: 625 },
    { name: "Hustlers University Student", earnings: 600 },
    { name: "Drop Shipper", earnings: 575 },
    { name: "Lamborghini Mechanic", earnings: 550 },
    { name: "Apple Store Genius", earnings: 525 },
    { name: "Rolex Product Tester", earnings: 500 },
    { name: "Porn Actor", earnings: 475 },
    { name: "Electrician", earnings: 450 },
    { name: "Exotic Zookeeper", earnings: 425 },
    { name: "Plumber", earnings: 400 },
    { name: "Uber Driver", earnings: 375 },
    { name: "Fry Cook", earnings: 350 },
    { name: "Bank Teller", earnings: 325 },
    { name: "Discord Moderator", earnings: 300 },
    { name: "Stripper Magician", earnings: 275 },
    { name: "EECS 281 IA", earnings: 250 },
    { name: "Starbucks Barista", earnings: 225 },
    { name: "EECS 370 IA", earnings: 200 },
    { name: "Campus Police Officer", earnings: 175 },
    { name: "Comedian", earnings: 150 },
    { name: "TikTok Influencer", earnings: 125 },
    { name: "Walmart Greeter", earnings: 100 },
    { name: "McDonald's Cashier", earnings: 75 },
    { name: "Public Water Fountain Coin Scavenger", earnings: 50 },
    { name: "MBus Driver", earnings: 25 },
    { name: "Factory Worker", earnings: 10 },
    { name: "Homeless Person", earnings: 1 },
];

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
                console.log(`User ${user.username} got a job as a ${random_job.name} making ${random_job.earnings}.`);
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