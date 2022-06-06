//IMPORT FILE DATA
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { databasing, escapeRegex } = require("../../modules/functions")
//import the Discord Library
const Discord = require("discord.js");
let cpuStat = require("cpu-stat");
let os = require("os");
// HERE THE EVENT STARTS
module.exports = (client, message, args, cmd, prefix) => {

  if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return message.reply("Gib mir die Rechte, um Ebends zu schicken!");

  if (!args[0])
    return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setTitle("Das sind alle Befehlsgruppen!")
        .setFooter(ee.footertext, ee.footericon)
        .setTimestamp()
        .setDescription(`PREFIX: \`${prefix}\`\n\n*Gebe die Kategorie ein für die du Hilfe brauchst* Beispiel: \`${prefix}help voice\`\n[\`Support\`](https://discordapp.com/users/345538444564496384) | Developer: \`h03ppi#4292\``)
        .addField(`\`${prefix}help general\``, "Alle generelle/Information Commands!", true)
        .addField(`\`${prefix}help voice\``, "> *Alle Voice Channel Commands*", true)
      ]
    });
  switch (args[0].toLowerCase()) {
    case "general": {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.color)
          .setTitle("Das sind alle cmds!")
          .setTimestamp()
          .setDescription(`PREFIX: \`${prefix}\``)
          .addField(`\`${prefix}help\``, "_Zeigt alle verfügbaren Commands an!_", true)
          .addField(`\`${prefix}support\``, "> *Sendet einen Link für den [SUPPORT](https://discordapp.com/users/345538444564496384) des Bot!*", true)
          .addField(`\`${prefix}ping\``, "> *Zeigt den Ping vom Bot!*", true)
          .addField(`\`${prefix}uptime\``, "> *Zeigt die uptime vom Bot!*", true)
          .addField(`\`${prefix}info\``, "> *Zeigt Information & Stats vom Bot*", true)
          .addField(`\`${prefix}userinfo\``, "> *Zeigt Information vom gepingten User an*", true)
          .addField(`\`${prefix}prefix\``, "> *Ändert den Prefix vom Bot!*", true)
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    };
      break;
    case "setup":
      {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle("Das sind alle cmds!")
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
            .setDescription(`PREFIX: \`${prefix}\``)
            .addField(`\`${prefix}setup\` --> Follow steps`, "> *Creates a temp. Voice Channel Setup*")
            .addField(`\`${prefix}setupname <ChannelName>\``, "> *Changes the Created temp. Voice Channel's Name!* \n**Note:** *Having \`{user}\` in your Channel name, will replace with the username!*\n" + `Example: \`${prefix}setupname {user}'s VC\``)
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      };
      break;
    case "voice": {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.color)
          .setTitle("Das sind alle cmds!")
          .setTimestamp()
          .setDescription(`PREFIX: \`${prefix}\`\n\n** BALD ALLE DIESE BEFEHLE!!!**`)
          .addField(`\`${prefix}voice lock\``, "Sperrt den Voice Channel (mach es privat :D)!", true)
          .addField(`\`${prefix}voice unlock\``, "> *Entsperrt den Voice Channel (macht es öffentlich)!*", true)
          .addField(`\`${prefix}voice kick @User\``, "> *Kickt einen Benutzer aus deinem Kanal!*", true)
          .addField(`\`${prefix}voice ban @User\``, "> *Kickt und bannt einen Benutzer von deinem Kanal!*", true)
          .addField(`\`${prefix}voice unban @User\``, "> *Unbannt (vertraut) einem Benutzer für deinen Kanal!*", true)
          .addField(`\`${prefix}voice trust @User\``, "> *Vertraut einem Benutzer deinem Kanal an!*", true)
          .addField(`\`${prefix}voice untrust @User\``, "> *Enttraut einem Benutzer aus deinem Channel!!*", true)
          //.addField(`~~\`${prefix}rename <CHANNEL_NAME>\`~~`, "> *~~Renames the Channel Name (20 Sec cooldown)~~* --> Not Yet\n You can rename the Channel, by editing the Channel!", true)
          .addField(`\`${prefix}voice limit <UserLimit>\``, "> *Legt das Benutzerlimit deines Kanals fest (wie viele können beitreten)*", true)
          //.addField(`\`${prefix}bitrate <Bitrate in bits>\``, "> *Set's the Channel's bitrate*", true)
          .addField(`\`${prefix}voice invite @User [optional message]\``, "> *Lädt einen Benutzer in deinen Sprachkanal ein*", true)
          .addField(`\`${prefix}voice promote @User\``, "> *Mache einen anderen Benutzer Owner deines Kanals*", true)
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    };
      break;
    default:
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.color)
          .setTitle("Das sind alle Command Gruppen!")
          .setTimestamp()
          .setDescription(`PREFIX: \`${prefix}\` \n\n*Gebe die Kategorie ein für die du Hilfe brauchst* Beispiel: \`${prefix}voice\``)
          .addField(`\`${prefix}help general\``, "Alle generelle/Information Commands!", true)
          .addField(`\`${prefix}help voice\``, "> *Alle Voice Channel Commands*", true)
        ]
      });
      break
  }
};