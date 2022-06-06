const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
//import the Discord Library
const Discord = require("discord.js");
//Start the module
module.exports = client => {
  /** ////////////////////////////////////////// *
   * CREATE A CATEGORY FOR EACH SINGLE COMMAND
   * ////////////////////////////////////////// *
   */
  client.category = {
    "general": ["support", "server", "tutorial", "video", "info", "stats", "stat", "uptime", "add", "invite", "source", "github", "prefix","usi","userinfo", "stats"],
    "voice": ["lock", "unlock", "kick", "vcinvite", "vcadd", "voiceinvite", "voiceadd", "ban", "unban", "trust", "untrust", "rename", "limit", "bitrate", "promote"],
    "setup": ["setup", "setupname"]
  };
  /** ////////////////////////////////////////// *
   * LOG EVERY TIME THE BOT GETS READY and STATUS CHANGE
   * ////////////////////////////////////////// *
   */
  client.on("ready", (bah) => {
    require("../modules/events/ready")(client)
  });

  /** ////////////////////////////////////////// *
   * LOG EVERY SINGLE MESSAGE
   * ////////////////////////////////////////// *
   */
  client.on("messageCreate", (message) => {
    require("../modules/events/message")(client, message)
  });


};