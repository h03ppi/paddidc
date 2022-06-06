const {
    MessageEmbed
  } = require("discord.js");
  const config = require("../../botconfig/config.json");
  var ee = require(`../../botconfig/embed.json`);

  var cp = require('child_process');
  module.exports = {
    name: "ping",
    category: "general",
    aliases: ["latency"],
    cooldown: 2,
    usage: "ping",
    description: "Gives you information on how fast the Bot can respond to you",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix) => {
      
      try {
        let oldate = Math.floor(Date.now() / 10)
        message.reply({embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(":heartbeat: Teste Verbindungs-Geschwindigkeit ...")
        ]}).then(msg => {
          let newtime = Math.floor(Math.floor(Date.now() / 10) - oldate);
          if(newtime < 0) newtime*=-1;
          msg.edit({embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
            .setTitle(":round_pushpin: Meine Pings:\n\n:robot: Bot Ping: `" + `${Math.floor(client.ws.ping + newtime)}ms` + "`\n\n:stopwatch: Host Ping: `"+ `${Math.floor(newtime)}ms` + "`\n\n:hourglass: Api Ping: `"+ `${Math.floor(client.ws.ping)}ms` +"`")
          ]});
        })
      } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
        ]});
      }
    }
  }