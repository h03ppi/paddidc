const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const mesg = require("../../modules/events/message")
const {
  GetUser,
  GetGlobalUser,
  handlemsg
} = require(`../../modules/functions`)
module.exports = {
  name: "prefix",
  aliases: ["p"],
  category: "mod",
  description: "Switch the Prefix",
  usage: "prefix [new prefix]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {


    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.wrongcolor).setFooter(ee.footertext, ee.footericon).setTimestamp().setTitle(":x: Du hast nicht genug Rechte!")] });
    if (!args[0]) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.wrongcolor).setFooter(ee.footertext, ee.footericon).setTimestamp().setTitle(":x: Du hast kein neuen Prefix angegeben").setDescription(`Benutze: \`${client.settings.get(message.guild.id, "prefix")}prefix <newprefix>\``)] });
    if (args[0].length > 5) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.wrongcolor).setFooter(ee.footertext, ee.footericon).setTimestamp().setTitle(":x: Dein angegebener Prefix ist zu lang!").setDescription(`Die maximale länge ist \`5\``)] });
    client.settings.set(message.guild.id, args[0], "prefix");
    return message.reply({
      embeds: [
        new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon)
          .setTitle("Der Prefix wurde erfolgreich geändert")
          .setDescription(`Neuer Prefix: \`${client.settings.get(message.guild.id, "prefix")}\``)
          .setTimestamp()
      ]
    })

  }
}