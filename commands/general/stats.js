const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const fetchAll = require('discord-fetch-all');
const {
  GetUser,
  GetGlobalUser,
  handlemsg
} = require(`../../modules/functions`)
module.exports = {
  name: "",
  category: "general",
  description: "Get the Stats of the bot",
  usage: "stats",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
      
    try {
      

      let guild = client.stats.get(message.guild.id);


      const allMessages = await fetchAll.messages(channel, {
        reverseArray: true, // Reverse the returned array
        userOnly: true, // Only return messages by users
        botOnly: false, // Only return messages by bots
        pinnedOnly: false, // Only returned pinned messages
    });
      
      message.reply({embeds: [new MessageEmbed()
        .setColor(ee.color)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(ee.footertext, ee.footericon)
        //.addField("⚙️ Befehle global genutzt:", handlemsg(">>> " +`${Math.ceil(global.commands * [...client.guilds.cache.values()].length / 10)}`+" Befehle` in\n **allen** Servern genutzt"), true)
        //.addField("🎵 Songs global gespielt:", handlemsg(">>> "+ `${Math.ceil(global.songs * [...client.guilds.cache.values()].length / 10)} Songs`+" in\n**allen** Servern gespielt"), true)
        .addField(eval("\"\\u200b\""), eval("\"\\u200b\""))
        .addField("⚙️ Befehle serverweit genutzt:", handlemsg(">>> "+ `${guild.commands} Befehle`+ " in\n**diesem** Server genutzt"), true)
        .addField("📑 Gesendete Nachrichten serverweit:", handlemsg(">>> "+ `${allMessages.length} Nachrichten`+ " in\n**thdiesemis** Server gespielt"), true)
        .setTitle(handlemsg("💿 Die Statistik von " + `${client.user.username}`))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(ee.erroroccur)
        .setDescription(eval("`\\`\\`\\` ${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\\`\\`\\``"))
      ]});
    }
  }
}