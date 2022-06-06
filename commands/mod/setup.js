const { MessageEmbed, Permissions } = require("discord.js");
const Discord = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`)
module.exports = {
  name: "setup",
  category: "mod",
  aliases: [""],
  extracustomdesc: "`setup start`, `setup name",
  usage: "`setup <CMD_TYPE> [Options]`\n\nValid CMD_TYPES: `start`, `name`",
  description: "Setup the JOIN TO CREATE Channel!",
  run: async (client, message, args, cmduser, text) => {

    const prefix = client.settings.get(message.guild.id, "prefix");

    try {

    let newargs = message.content.slice(prefix.length).split(/ +/).slice(1);
    let args = newargs;
    let cmd = args.shift()
    if (cmd && cmd.length > 0) cmd = cmd.toLowerCase();
    if (cmd === "start") {
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!")] });
    let {
      channel
    } = message.member.voice;
    if (channel) {
      message.reply({
        embeds: [new Discord.MessageEmbed()
          .setTitle("<:ChannelMaster:778404076466602024> Setup Complete for Join to Create")
          .setColor(ee.color)
          .setDescription(`Bound to Channel: \`${channel.name}\`\nPlease rejoin!`)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      client.settings.set(message.guild.id, channel.id, `channel`)
    } else {
      message.guild.channels.create("Join to Create", {
        type: 'GUILD_VOICE',
        bitrate: 8000,
        userLimit: 2,
        permissionOverwrites: [ //update the permissions
          { //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
            id: message.guild.id,
            allow: ['VIEW_CHANNEL', "CONNECT"],
            deny: ["SPEAK"]
          },
        ],
      }).then(vc => {
        if (message.channel.parent) vc.setParent(message.channel.parent.id)
        message.reply({
          embeds: [new Discord.MessageEmbed()
            .setTitle("<:ChannelMaster:778404076466602024> Setup Complete for Join to Create")
            .setColor(ee.color)
            .setDescription(`Bound to Channel: \`${vc.name}\`\n\nI created the Channel for you!`)
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
        client.settings.set(message.guild.id, vc.id, `channel`);
      })
    };

    return
  } else if (cmd === "name") {

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTimestamp().setTitle(":x: Du hast nicht genügend Berechtigungen!")] });
    if (!args[0]) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTimestamp().setTitle(":x: Du hast keinen Kanalnamen angegeben").setDescription(`Benutze: \`${prefix}voice name [neuer Kanal Name]\` | Hinweis: \`{user}\` wird durch den Benutzernamen ersetzt*`)] });
    if (args[0].length > 32) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTimestamp().setTitle(":x: Dein angegebener Kanalname ist zu lang").setDescription(`Die maximale Länge für einen Kanalnamen beträgt \`32\` Buchstaben`)] });
    client.settings.set(message.guild.id, args.join(" "), "channelname");
    message.reply({
      embeds: [new Discord.MessageEmbed()
        .setTitle(":loud_sound: Der Kanalname wurde erfolgreich geändert")
        .setColor(ee.color)
        .setDescription(`Neuer Kanalname: \`${client.settings.get(message.guild.id, "channelname")}\`\n\nWie es aussehen könnte: \`${client.settings.get(message.guild.id, "channelname").replace("{user}", message.author.username)}\``)
        .setFooter(ee.footertext, ee.footericon)
        .setTimestamp()
      ]
    });
    return;
  } else {
    return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setTitle("FEHLER | Please add a VALID TYPE")
        .setColor(ee.color)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(eval("`Richtige Nutzung: \\`${prefix}setup <CMD_TYPE> [Options]\\`\\nVerfügbare CMD_TYPES: \\`start\\`,\\`name\\``"))
        .setFooter(ee.footertext, ee.footericon)
        .setTimestamp()
      ]
    });
  }
} catch (e) {
  console.log(String(e.stack).grey.bgRed)
  return message.reply({
    embeds: [new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setTimestamp()
      .setTitle(ee.erroroccur)
      .setDescription("`\\`\\`\\` " + `${e.stack}` + "\\`\\`\\``")
    ]
  });
}
  }
}

