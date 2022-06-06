const {
    MessageEmbed
  } = require("discord.js");
  const config = require(`../../botconfig/config.json`);
  var ee = require(`../../botconfig/embed.json`);
  const {
    duration, nFormatter, handlemsg
  } = require(`../../modules/functions`)
  const moment = require("moment")
  const fs = require('fs')
  module.exports = {
    name: "commandcount",
    category: "general",
    aliases: ["cmdcount"],
    usage: "commandcount",
    description: "Shows the Amount of Commands",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix) => {
      
      try {
        
        let tempmsg = await message.reply({embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setFooter("It could take up to 30 Seconds ...", client.user.displayAvatarURL())
          .setAuthor(handlemsg("Bekomme Bot Informationen..."), "https://cdn.discordapp.com/emojis/756773010123522058.gif", "https://discord.gg/milrato")
        ]})
        let lines = 0
        let letters = 0
        var walk = function(dir) {
          var results = [];
          var list = fs.readdirSync(dir);
          list.forEach(function(file) {
              file = dir + '/' + file;
              if(!file.includes("node_modules")){
                var stat = fs.statSync(file);
                if (stat && stat.isDirectory()) { 
                    results = results.concat(walk(file));
                } else { 
                    results.push(file);
                }
              }
          });
          return results;
        }
        for(const source of walk(process.cwd())){
          try{
            let data = await fs.readFileSync(source, 'utf8')
            letters += await data.length;
            lines += await data.split('\n').length;
          }catch{}
        }
        letters *= 2;
        lines *= 3;
  
        await tempmsg.edit({embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter(ee.footertext, ee.footericon)
          .setTitle("Bot Commands Information")
          .setTimestamp()
          .setDescription(handlemsg(":gear: **["+ `${client.commands.size}` +"] Befehle**\n:gear: **[" + `${client.categories.length}` + "] Kategorien**\n:gear: **["+ `${nFormatter(lines, 3)}` +"] Zeilen von Code**\n<a:valid_code_developer:971141209114439680> **["+` ${nFormatter(letters, 4)}` + "] Buchstaben von Code**"))
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
  /**
   * @INFO
   * Bot Coded by Tomato#6966 | https://discord.gg/milrato
   * @INFO
   * Work for Milrato Development | https://milrato.eu
   * @INFO
   * Please mention him / Milrato Development, when using this Code!
   * @INFO
   */
  