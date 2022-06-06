//import the Discord Library
const Discord = require("discord.js");
const colors = require("colors");
const fs = require('fs');
//create a new Client
const client = new Discord.Client({
  //fetchAllMembers: false,
  restTimeOffset: 0,
  //disableMentions: "all",
  allowedMentions: {
    parse: [/** */],
    repliedUser: false
  },
  //messageCacheMaxSize: 10,
  //messageEditHistoryMaxSize: 10,
  restWsBridgeTimeout: 100,
  //disableEveryone: true,
  shards: "auto",
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
  ]
});


  // Collections
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.categories = fs.readdirSync("./commands/");


// Run the command loader

["command", "aichat"].forEach(h => {
  require(`./handlers/${h}`)(client);
})





//import the config.json file
const config = require("./botconfig/config.json");
//import our databasing system
const Enmap = require("enmap");
//create all 3 different databases for each application system
client.settings = new Enmap({
  name: "settings",
  dataDir: "./dbs/1"
});
client.jointocreatemap = new Enmap({
  name: "settings",
  dataDir: "./dbs/jointocreatemap"
});
client.stats = new Enmap({
  name: "stats",
  dataDir: "./dbs/stats"
});
client.afkDB = new Enmap({
  name: "afkDB",
  dataDir: "./dbs/afk"
}); //for the temp channels
//LOAD EACH MODULE FOR CMDS AND APPLIES,
require(`./modules/cmds`)(client);
require(`./modules/jointocreate`)(client);
require(`./auto-message/memberjoin`)(client);
require(`./auto-message/memberleave`)(client);
require(`./modules/events/reaction`)(client);
require(`./modules/events/customroles`)(client);

// So bot doesn't crash
// Ripped off from (Tomato's lavalink extraevents)
process.on('unhandledRejection', (reason, p) => {
  console.log('\n\n\n\n\n=== unhandled Rejection ==='.toUpperCase().yellow.dim);
  console.log('Reason: ', reason.stack ? String(reason.stack).gray : String(reason).gray);
  console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().yellow.dim);
});
process.on("uncaughtException", (err, origin) => {
  console.log('\n\n\n\n\n\n=== uncaught Exception ==='.toUpperCase().yellow.dim);
  console.log('Exception: ', err.stack ? err.stack : err)
  console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().yellow.dim);
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('=== uncaught Exception Monitor ==='.toUpperCase().yellow.dim);
});
process.on('beforeExit', (code) => {
  console.log('\n\n\n\n\n=== before Exit ==='.toUpperCase().yellow.dim);
  console.log('Code: ', code);
  console.log('=== before Exit ===\n\n\n\n\n'.toUpperCase().yellow.dim);
});
process.on('exit', (code) => {
  console.log('\n\n\n\n\n=== exit ==='.toUpperCase().yellow.dim);
  console.log('Code: ', code);
  console.log('=== exit ===\n\n\n\n\n'.toUpperCase().yellow.dim);
});
process.on('multipleResolves', (type, promise, reason) => {
  console.log('\n\n\n\n\n=== multiple Resolves ==='.toUpperCase().yellow.dim);
  console.log(type, promise, reason);
  console.log('=== multiple Resolves ===\n\n\n\n\n'.toUpperCase().yellow.dim);
});

//login to the BOT
client.login(config.token);
