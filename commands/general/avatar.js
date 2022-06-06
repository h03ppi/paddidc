const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const {
  GetUser,
  GetGlobalUser,
  handlemsg
} = require(`../../modules/functions`)
module.exports = {
  name: "avatar",
  aliases: ["av"],
  category: "general",
  description: "Get the Avatar of an user",
  usage: "avatar [@USER] [global/guild]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    try {
      //"HELLO"
      var user;
      let customavatar = false;
      try {
        if (args[1] && args[1].toLowerCase() == "global") {
          args.pop()
          user = await GetGlobalUser(message, args)
        } else {
          user = await GetUser(message, args)
        }
      } catch (e) {
        return message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
      }
      try {
        let member = message.guild.members.cache.get(user.id);
        if (!member) await message.guild.members.fetch(user.id).catch(() => {}) || false;
        if (member && member.avatar) {
          customavatar = member.displayAvatarURL({
            dynamic: true,
            size: 4096
          })
        }
      } catch (e) {
        console.log(String(e.stack).grey.bgRed)
      }
      let embed = new MessageEmbed()
        .setAuthor("Profilbild von: " + `${user.tag}` , user.displayAvatarURL({dynamic: true}))

        .setColor(ee.color)
        .setThumbnail(client.user.displayAvatarURL())
        .addField("<:arrow:971137602512109588> PNG", `[\`LINK\`](${user.displayAvatarURL({format: "png"})})`, true)
        .addField("<:arrow:971137602512109588> JPEG", `[\`LINK\`](${user.displayAvatarURL({format: "jpg"})})`, true)
        .addField("<:arrow:971137602512109588> WEBP", `[\`LINK\`](${user.displayAvatarURL({format: "webp"})})`, true)
        .setURL(user.displayAvatarURL({
          dynamic: true
        }))
        .setFooter(ee.footertext, ee.footericon)
        .setTimestamp()
        .setImage(user.displayAvatarURL({
          dynamic: true,
          size: 4096,
        }))
        if(customavatar)
        embed.setDescription(`**This User has a Custom Avatar too!**\n\n> [**\`Click here to get the LINK of it\`**](${customavatar})\n\n> **There is also:** \`${prefix}customavatar [@User]\``)
        message.reply({
          embeds: [embed]
        });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle("<:no:970251607184928768> Ein Fehler ist aufgetreten")
        .setDescription(eval("`\\`\\`\\` ${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\\`\\`\\``"))
      ]});
    }
  }
}
/*
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
