const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);

const {
  GetUser,
  GetGlobalUser, handlemsg
} = require(`../../modules/functions`)
const fetch = require("node-fetch")
module.exports = {
  name: "connectioninfo",
  aliases: ["coinfo"],
  category: "general",
  description: "Get Information of your Connection",
  usage: "connectioninfo",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
		try {
      var user;
      if(args[0]){
        try {
          if(args[1] && args[1].toLowerCase() == "global"){
            args.pop()
            user = await GetGlobalUser(message, args)
          } else {
            user = await GetUser(message, args)
          }
        } catch (e){
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
          return message.reply("<:no:970251607184928768> Der User konnte nicht gefunden werden")
        }
      } else{
        user = message.author;
      }
      let member = message.guild.members.cache.get(user.id) || await message.guild.members.fetch(user.id).catch(() => {}) || false;
      
      if(!member) return message.reply("<:no:970251607184928768> **Dieser User ist kein Mitglied diesem Server!**")
      if(!member.voice || !member.voice.channel) return message.reply(":x: **Dieser User ist mit keinem Sprachkanal verbunden!**")

      const embed = new Discord.MessageEmbed()
        .setTitle(`Connection Info of: \`${user.tag}\``)
        .addField('<:arrow:971137602512109588> **Channel**', `> **${member.voice.channel.name}** ${member.voice.channel}`, true)
        .addField('<:arrow:971137602512109588> **Channel-ID**', `> \`${member.voice.channel.id}\``, true)
        .addField('<:arrow:971137602512109588> **Mitglieder **', `> \`${member.voice.channel.members.size} Mitglieder insgesamt \``, true)
        .addField('<:arrow:971137602512109588> **Voller Channel?**', `> ${member.voice.channel.full ? "✅" : "❌"}`, true)
        .addField('<:arrow:971137602512109588> **Benutzerbeitrittslimit**', `> \`${member.voice.channel.userLimit != 0 ? member.voice.channel.userLimit : "Kein Limit!"}\``, true)
      
      message.reply({
        embeds: [embed]
      });
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