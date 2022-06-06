const { MessageEmbed, Permissions } = require("discord.js");
const Discord = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`)
module.exports = {
  name: "voice",
  category: "voice",
  aliases: [""],
  extracustomdesc: "`voice add`, `voice ban`, `voice invite`, `voice kick`, `voice limit`, `voice lock`, `voice name` ,`voice promote`, `voice trust`, `voice unban`, `voice unlock`, `voice untrust`",
  usage: "`voice <CMD_TYPE> [Options]`\n\nValid CMD_TYPES: `lock`, `invite`, `add`, `kick`, `unlock`, `ban`, `name`, `unban`, `trust`, `untrust`, `limit`, `promote`",
  description: "The Voice Commands are there for the JOIN TO CREATE COMMANDS, use them to adjust your hosted channel!",
  run: async (client, message, args, cmduser, text) => {


    const prefix = client.settings.get(message.guild.id, "prefix");



    try {

      let newargs = message.content.slice(prefix.length).split(/ +/).slice(1);
      let args = newargs;
      let cmd = args.shift()
      if (cmd && cmd.length > 0) cmd = cmd.toLowerCase();
      if (cmd === "lock") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(eval("\"<:no:970251607184928768> Du musst in einem Sprach Channel sein um diesen Befehl ausführen zu können!\""))
            .setTimestamp()
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);

        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionsFor(message.author.id);
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
          };
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`:x: Du musst der Owner von \`${vc.name}\` sein!`)
                .setTimestamp()
                .setFooter(ee.footertext, ee.footericon)
              ]
            })

          vc.permissionOverwrites.set([{
            id: message.guild.id,
            allow: ['VIEW_CHANNEL'],
            deny: ['CONNECT']
          }])
            .then(lol => {
              lock = true
              vc.permissionOverwrites.create(message.author.id, {
                MANAGE_CHANNELS: true,
                VIEW_CHANNEL: true,
                MANAGE_ROLES: true,
                CONNECT: true
              })
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor(ee.color)
                  .setTitle("✅ Channel ist gespert!")
                  .setDescription(`Niemand kann mehr joinen!`)
                  .setTimestamp()
                  .setFooter(ee.footertext, ee.footericon)
                ]
              })
            })

        } else {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: Für diesen Befehl musst du in einem temporären VoiceChannel sein!")
              .setTimestamp()
              .setFooter(ee.footertext, ee.footericon)
            ]
          })
        }

      } else if (cmd === "unlock") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(eval("\"<:no:970251607184928768> Du musst in einem Sprach Channel sein um diesen Befehl ausführen zu können!\""))
            .setTimestamp()
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Du musst der Owner des  **temp.** VoiceChannels sein!\""))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })

          if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(message.guild.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.color)
                .setThumbnail(client.user.displayAvatarURL())
                .setTitle(eval("\"✅Channel entsperrt!\""))
                .setDescription(eval("`Nun kann jeder beitreten`"))
                .setTimestamp()
                .setFooter(ee.footertext, ee.footericon)
              ]
            })
          })
        } else {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Du musst in einem **Temp.** Sprach Channel für diesen Befehl sein!\""))
              .setTimestamp()
              .setFooter(ee.footertext, ee.footericon)
            ]
          })
        }
      } else if (cmd === "kick") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(eval("\"<:no:970251607184928768> Du musst in einem Sprach Channel sein um diesen Befehl ausführen zu können!\""))
            .setTimestamp()
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable12"]))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          if (!args[0]) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}kick @User\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          let member = message.mentions.members.filter(member => member.guild.id == message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}kick @User\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          if (!member.voice.channel)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Der gepingte Benutzser is nicht mit einem Channel verbunden\""))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          if (member.voice.channel.id != channel.id)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Der gepingte Benutzser is nicht mit deinem Channel verbunden\""))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          try {
            member.voice.disconnect();
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.color)
                .setThumbnail(client.user.displayAvatarURL())
                .setTitle(eval("`✅ ${member.user.tag} aus deinem Kanal gekicked`"))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Ein Fehler ist aufgetreten\""))
                .setDescription(eval("`\\`\\`\\` ${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\\`\\`\\``"))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          }
        } else {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Du musst in einem **Temp.** Sprach Channel für diesen Befehl sein!\""))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
        }
      } else if (["invite", "add"].includes(cmd)) {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(eval("\"<:no:970251607184928768> Du musst in einem Sprach Channel sein um diesen Befehl ausführen zu können!\""))
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
          ]
        })
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Du musst der Besitzer des **temp.**  Sprach Kanals sein !\""))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          if (!args[0]) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}voice invite @User [optional Message]\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          let member = message.mentions.members.filter(member => member.guild.id == message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}invite @User [optional Message]\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          let txt = args.slice(1).join(" ");
          try {

            if (!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE)) {
              return message.reply(`:x: **I am missing the CREATE_INSTANT_INVITE PERMISSION for \`${channel.name}\`**`)
            }
            channel.createInvite().then(invite => {
              if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
                return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
              }
              vc.permissionOverwrites.edit(member.user.id, {
                VIEW_CHANNEL: true,
                CONNECT: true
              }).then(lol => {
                if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
                  return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
                }
                vc.permissionOverwrites.edit(message.author.id, {
                  MANAGE_CHANNELS: true,
                  VIEW_CHANNEL: true,
                  MANAGE_ROLES: true,
                  CONNECT: true
                })
                member.user.send({
                  embeds: [new Discord.MessageEmbed()
                    .setColor(ee.color)
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTitle(eval("`Du wurdest eingeladen, dem Sprachkanal von ${message.author.tag} zu joinen`"))
                    .setDescription(`[Klicke hier](${invite.url}) um den Kanal \`${channel.name}\` zu joinen\n\n> **${txt ? txt : ""}**`.substring(0, 2000))
                    .setFooter(ee.footertext, ee.footericon)
                    .setTimestamp()
                  ]
                }).catch(e => {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setColor(ee.wrongcolor)
                      .setTitle(eval("`<:no:970251607184928768> Dm an \\`${member.user.tag} konnte nicht gesendet werden\\``"))
                      .setDescription(eval("`\\`\\`\\` ${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\\`\\`\\``"))
                      .setFooter(ee.footertext, ee.footericon)
                      .setTimestamp()
                    ]
                  })
                })
              })
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor(ee.color)
                  .setThumbnail(member.user.displayAvatarURL())
                  .setTitle(eval("`✅ Einladung erfolgreich versendet`"))
                  .setDescription(eval("`**${member.user.tag}** zu deinem Kanal eingeladen`"))
                  .setFooter(ee.footertext, ee.footericon)
                  .setTimestamp()
                ]
              })
            })

          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Ein Fehler ist aufgetreten\""))
                .setDescription(eval("`\\`\\`\\` ${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\\`\\`\\``"))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          }
        } else {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Du musst in einem **Temp.** Sprach Channel für diesen Befehl sein!\""))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
        }
      } else if (cmd === "ban") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(eval("\"<:no:970251607184928768> Du musst in einem Sprach Channel sein um diesen Befehl ausführen zu können!\""))
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
          ]
        })
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Du musst der Besitzer des **temp.**  Sprach Kanals sein !\""))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          if (!args[0]) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}ban @User\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          let member = message.mentions.members.filter(member => member.guild.id == message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}ban @User\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          if (member.voice.channel && member.voice.channel.id == channel.id)
            try {
              member.voice.disconnect();
              message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor(ee.color).setThumbnail(client.user.displayAvatarURL())
                  .setTitle(eval("`✅ ${member.user.tag} wurde von deinem Kanal getrennt`"))
                  .setFooter(ee.footertext, ee.footericon)
                  .setTimestamp()
                ]
              })
            } catch (e) {
              message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setTitle(eval("\"<:no:970251607184928768> Ein Fehler ist aufgetreten\""))
                  .setDescription(eval("`\\`\\`\\` ${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\\`\\`\\``"))
                  .setFooter(ee.footertext, ee.footericon)
                  .setTimestamp()
                ]
              })
            }

          if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: false
          }).then(lol => {

            if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.color).setThumbnail(client.user.displayAvatarURL())
                .setTitle(eval("`✅ Banned ${member.user.tag} von deinem Channel!`"))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          })


        } else {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Du musst in einem **Temp.** Sprach Channel für diesen Befehl sein!\""))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
        }
      } else if (cmd === "unban") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(eval("\"<:no:970251607184928768> Du musst in einem Sprach Channel sein um diesen Befehl ausführen zu können!\""))
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
          ]
        })
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Du musst der Besitzer des **temp.**  Sprach Kanals sein !\""))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          if (!args[0]) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}unban @User\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          let member = message.mentions.members.filter(member => member.guild.id == message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}unban @User\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.color).setThumbnail(client.user.displayAvatarURL())
                .setTitle(eval("`✅ ${member.user.tag} von deinem Kanal unbannd!`"))
                .setDescription(eval("\"Er kann jetzt wieder deinem Kanal joinen!\""))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          })
        } else {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Du musst in einem **Temp.** Sprach Channel für diesen Befehl sein!\""))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
        }
      } else if (cmd === "trust") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(eval("\"<:no:970251607184928768> Du musst in einem Sprach Channel sein um diesen Befehl ausführen zu können!\""))
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
          ]
        })
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Du musst der Besitzer des **temp.**  Sprach Kanals sein !\""))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          if (!args[0]) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}trust @User\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          let member = message.mentions.members.filter(member => member.guild.id == message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}trust @User\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.color).setThumbnail(client.user.displayAvatarURL())
                .setTitle(eval("`✅ Trusted ${member.user.tag} zu deinem Kanal an!`"))
                .setDescription(eval("\"Er kann jetzt deinem Kanal beitreten!\"",))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          })
        } else {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Du musst in einem **Temp.** Sprach Channel für diesen Befehl sein!\""))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
        }
      } else if (cmd === "untrust") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(eval("\"<:no:970251607184928768> Du musst in einem Sprach Channel sein um diesen Befehl ausführen zu können!\""))
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
          ]
        })
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Du musst der Besitzer des **temp.**  Sprach Kanals sein !\""))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          if (!args[0]) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}untrust @User\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          let member = message.mentions.members.filter(member => member.guild.id == message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}untrust @User\\``"))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
          if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: false
          }).then(lol => {
            if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.color).setThumbnail(client.user.displayAvatarURL())
                .setTitle(eval("`✅ Untrusted ${member.user.tag} von deinem Channel!`"))
                .setDescription(eval("\"Er kann jetzt nicht mehr deinem Kanal beitreten!\""))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          })
        } else {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Du musst in einem **Temp.** Sprach Channel für diesen Befehl sein!\""))
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
            ]
          })
        }
      } else if (cmd === "limit") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(eval("\"<:no:970251607184928768> Du musst in einem Sprach Channel sein um diesen Befehl ausführen zu können!\""))
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
          ]
        })
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Du musst der Besitzer des **temp.**  Sprach Kanals sein !\""))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
              ]
            })
          if (!args[0]) return message.reply(
            {
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(eval("\"<:no:970251607184928768> Du musst das Limit angeben, welches du festlegen möchtest\""))
                .setTimestamp()
              ]
            });
          if (isNaN(args[0])) return message.reply(
            {
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(eval("\"<:no:970251607184928768> Du musst das Limit angeben, welches du festlegen möchtest | Es MUSST eine **Nummer** sein\""))
                .setTimestamp()
              ]
            });
          let userlimit = Number(args[0]);
          if (userlimit > 99 || userlimit < 0) return message.reply(
            {
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(eval("\"<:no:970251607184928768> Deine Nummer befindet sich nicht im gültigen Bereich (`0` - `99`)\""))
                .setTimestamp()
              ]
            });
          channel.setUserLimit(userlimit).then(vc => {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.color).setThumbnail(client.user.displayAvatarURL())
                .setTitle(eval("`✅ Benutzerlimit auf \\`${vc.userLimit} gesetzt\\``"))
                .setTimestamp()
                .setFooter(ee.footertext, ee.footericon)
              ]
            })
          })
        } else {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Du musst in einem **Temp.** Sprach Channel für diesen Befehl sein!\""))
              .setTimestamp()
              .setFooter(ee.footertext, ee.footericon)
            ]
          })
        }
      } else if (cmd === "promote") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(eval("\"<:no:970251607184928768> Du musst in einem Sprach Channel sein um diesen Befehl ausführen zu können!\""))
            .setTimestamp()
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Du musst der Besitzer des **temp.**  Sprach Kanals sein !\""))
                .setTimestamp()
                .setFooter(ee.footertext, ee.footericon)
              ]
            })
          if (!args[0]) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}promote @User\\``"))
              .setTimestamp()
              .setFooter(ee.footertext, ee.footericon)
            ]
          })
          let member = message.mentions.members.filter(member => member.guild.id == message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Bitte erwähne einen Benutzer mit einem @Ping oder seiner ID!\""))
              .setDescription(eval("`Richtige Nutzung: \\`${prefix}promote @User\\``"))
              .setTimestamp()
              .setFooter(ee.footertext, ee.footericon)
            ]
          })
          if (!member.voice.channel)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Der gepingte Benutzser is nicht mit einem Channel verbunden\""))
                .setTimestamp()
                .setFooter(ee.footertext, ee.footericon)
              ]
            })
          if (member.voice.channel.id != channel.id)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Der gepingte Benutzser is nicht mit deinem Channel verbunden\""))
                .setTimestamp()
                .setFooter(ee.footertext, ee.footericon)
              ]
            })
          try {
            if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(member.user.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            }).then(l => {
              if (!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
                return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
              }
              vc.permissionOverwrites.edit(message.author.id, {
                MANAGE_CHANNELS: false,
                VIEW_CHANNEL: true,
                MANAGE_ROLES: false,
                CONNECT: true
              })
                .then(lol => {
                  client.jointocreatemap.set(`owner_${vc.guild.id}_${vc.id}`, member.user.id);
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setColor(ee.color)
                      .setThumbnail(client.user.displayAvatarURL())
                      .setTitle(eval("`✅ ${member.user.tag} wurde zum neuen Eigentümer deines Kanals befördert\\nDeine Berechtigung wurde entfernt!`"))
                      .setTimestamp()
                      .setFooter(ee.footertext, ee.footericon)
                    ]
                  })
                })
            })
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(eval("\"<:no:970251607184928768> Ein Fehler ist aufgetreten\""))
                .setDescription(eval("`\\`\\`\\` ${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\\`\\`\\``"))
                .setTimestamp()
                .setFooter(ee.footertext, ee.footericon)
              ]
            })
          }
        } else {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(eval("\"<:no:970251607184928768> Du musst in einem **Temp.** Sprach Channel für diesen Befehl sein!\""))
              .setTimestamp()
              .setFooter(ee.footertext, ee.footericon)
            ]
          })
        }
      } else if (cmd === "name") {
        const name = args.join(" ")
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(eval("\"<:no:970251607184928768> Du musst in einem Sprach Channel sein um diesen Befehl ausführen zu können!\""))
            .setTimestamp()
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (!args[0]) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTimestamp().setTitle(":x: Du hast keinen Kanalnamen angegeben").setDescription(`Benutze: \`${prefix}voice name [neuer Kanal Name]\` | Hinweis: \`{user}\` wird durch den Benutzernamen ersetzt*`)] });
        if (args[0].length > 32) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.wrongcolor).setFooter(ee.footertext, ee.footericon).setTimestamp().setTitle(":x: Dein angegebener Kanalname ist zu lang").setDescription(`Die maximale Länge für einen Kanalnamen beträgt \`32\` Buchstaben`)] });

        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionsFor(message.author.id);
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
          };
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`:x: Du musst der Owner von \`${vc.name}\` sein!`)
                .setTimestamp()
                .setFooter(ee.footertext, ee.footericon)
              
              ]
            })

          vc.setName(name.replace("{user}", message.author.username))
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle("✅ Der Kanalname wurde erfolgreich geändert")
                  .setColor(ee.color)
                  .setTimestamp()
                  .setDescription(`Neuer Channelname: \`${name}\`\n\nWie es aussieht: \`${name.replace("{user}", message.author.username)}\``)
                  .setFooter(ee.footertext, ee.footericon)
                ]
              })

        } else {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: Für diesen Befehl musst du in einem temporären VoiceChannel sein!")
              .setTimestamp()
              .setFooter(ee.footertext, ee.footericon)
            ]
          })
        }
      } else {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setTitle("FEHLER | Please add a VALID TYPE")
            .setColor(ee.color)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(eval("`Richtige Nutzung: \\`${prefix}voice <CMD_TYPE> [Options]\\`\\nVerfügbare CMD_TYPES: \\`lock\\`,\\`invite\\`,\\`add\\`,\\`kick\\`,\\`unlock\\`,\\`ban\\`,\\`unban\\`,\\`trust\\`,\\`untrust\\`,\\`limit\\`,\\`promote\\``"))
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
/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/Discord-Js-Handler-Template
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention him / Milrato Development, when using this Code!
  * @INFO
*/
