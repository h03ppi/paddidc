const {
    MessageEmbed
  } = require("discord.js");
  const config = require(`../../botconfig/config.json`);
  var ee = require(`../../botconfig/embed.json`);
 
  const {
    duration
  } = require(`../../modules/functions`)
  const moment = require("moment")
  module.exports = {
    name: "uptime",
    category: "general",
    aliases: [""],
    usage: "uptime",
    description: "Returns the duration on how long the Bot is online",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix) => {
      
      let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
      try {
        let date = new Date()
        let timestamp = date.getTime() - Math.floor(client.uptime);
        message.reply({embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter(ee.footertext, ee.footericon)
          .setTimestamp()
          .setTitle(eval("`:white_check_mark: **${client.user.username}** Uptime`"))
          .setDescription(eval("`\\`\\`\\`css\\n${duration(client.uptime).map(i=> `${i}`).join(\"︲\")}\\`\\`\\``"))
          .addField(eval("\"**Lauched Datum**\""), eval("moment(timestamp).format(\"LLLL\")"))
          ]}
        );
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