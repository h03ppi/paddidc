const {
    MessageEmbed
  } = require("discord.js");
  const config = require(`../../botconfig/config.json`);
  const ee = require(`../../botconfig/embed.json`);

  module.exports = {
    name: "afk",
    category: "general",
    aliases: ["awayfromkeyboard",],
    cooldown: 10,
    usage: "afk [TEXT]",
    description: "Set yourself AFK",
    type: "user",
    run: async (client, message, args, text, prefix, player) => {

       const user = message.author 
      try {
        if(args[0]) client.afkDB.set(message.guild.id+user.id, args.join(" "), "message");
        client.afkDB.set(message.guild.id+user.id, Date.now(), "stamp");
        message.reply(`Du bist jetzt AFK für/grund: ${args.join(" ")} \n> **Tipp:** *Schreibe \`[afk]\` vor deine Nachricht, um AFK zu bleiben, aber trotzdem zu schreiben*`);
      } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds : [new MessageEmbed()
          .setFooter(ee.footertext, ee.footericon)
          .setColor(ee.wrongcolor)
          .setTitle(ee.erroroccur)
          .setDescription(eval("`\\`\\`\\`${e.message}\\`\\`\\``"))
        ]});
      }
    }
  }