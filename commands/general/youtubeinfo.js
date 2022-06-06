const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const moment = require('moment');
const {
  databasing,
  delay,
  getLatestVideos,
  channelInfo
} = require('../../modules/functions');
const {
  MessageButton,
  MessageActionRow
} = require('discord.js')
const { handlemsg } = require('../../modules/functions');
module.exports = {
  name: "youtubeinfo",
  aliases: ["ytinfo", "youtubeuserinfo", "ytuserinfo", "ytuser", "youtubeuser"],
  category: "general",
  description: "Get information about a Youtube Channel-Link",
  usage: "youtubeinfo <YOUTUBECHANNELLINK>",
  type: "util",
  run: async (client, message, args, cmduser, text) => {

    const prefix = client.settings.get(message.guild.id, "prefix");
    
    try {
      let button_back = new MessageButton().setStyle('PRIMARY').setCustomId('1').setLabel("<< Back")
      let button_forward = new MessageButton().setStyle('PRIMARY').setCustomId('3').setLabel('Forward >>')
      const allbuttons = [new MessageActionRow().addComponents([button_back, button_forward])]
      let url = args[0];
      if (url && typeof url == "string") {
        if (url.match(/^https?:\/\/(www\.)?youtube\.com\/(channel\/UC[\w-]{21}[AQgw]|(c\/|user\/)?[\w-]+)$/) == null)
          return message.reply({embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle("<:no:970251607184928768> Bitte nutze einen gültigen Youtube Link")
            .setTimestamp()
            .setDescription(handlemsg("Richtige Nutzung: \n`{prefix}youtubeinfo https://youtube.com/channel/UCJ3QPFCM6TT2WjNG7RpU8xA`", {
              prefix: prefix
            }))
          ]});
      } else {
        return message.reply({embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTimestamp()
          .setTitle("<:no:970251607184928768> Bitte nutze einen gültigen Youtube Link")
          .setDescription(handlemsg("Richtige Nutzung: \n`{prefix}youtubeinfo https://youtube.com/channel/UCJ3QPFCM6TT2WjNG7RpU8xA`", {
            prefix: prefix
          }))
        ]});
      }
      let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed().setColor(ee.color)
        .setAuthor("Bekomme die Youtube Channel Information ,,,", "https://cdn.discordapp.com/emojis/756773010123522058.gif", "https://discord.gg/milrato")]})
      let Channel = await channelInfo(url)
      let embed = new Discord.MessageEmbed()
        .setTitle(Channel.name)
        .setURL(Channel.url)
        .setColor("RED")
        .addField("**Abonnenten:**", "`" + Channel.subscribers + "`")
        .addField("**Tags:**", Channel.tags.map(t => `\`${t}\``).join(",  "))
        .addField("**Ungelistet:**", Channel.unlisted ? "✅" : "❌", true)
        .addField("**Familiensicher:**", Channel.familySafe ? "✅" : "❌", true)
        .setFooter("ID: " + Channel.id)
        .setTimestamp()
        .setImage(Channel.mobileBanner[0] ? Channel.mobileBanner[0].url : null)        
        .setDescription(String(Channel.description).substring(0, 1500))
      let Videos = await getLatestVideos(url)
      let embed2 = new Discord.MessageEmbed()
        .setTitle(handlemsg("Videos von {author}", {
          author: Videos[0].author
        }))
        .setColor("RED")
        .setURL(url)
      //For Each Video, add a new Field (just the first 10 Videos!)
      Videos.forEach((v, i) => {
        if (i < 10) {
          embed2.addField(v.title, handlemsg("[Schau es an]({link}) | Hochgeladen an: `{date}`", {
            date: v.pubDate,
            link: v.link
          }))
        }
      })
      //Send the Message
      let pagemsg = await tempmsg.edit({
        embeds:  [embed],
        components: allbuttons
      })
      //create a collector for the thinggy
      const collector = pagemsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.author.id == client.user.id,
        time: 180e3
      }); //collector for 5 seconds
      //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
      var edited = false;
      var embeds = [embed, embed2]
      let currentPage = 0;
      collector.on('collect', async b => {
        if (b?.user.id !== message.author.id)
          return b?.reply(handlemsg("<:no:970251607184928768> **Nur der, der {prefix}youtubeinfo geschrieben hat, darf das machen!**", {
            prefix: prefix
          }))
        //page forward
        if (b?.customId == "1") {
          //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
          if (currentPage !== 0) {
            await pagemsg.edit({
              embeds:  [embeds[currentPage]],
              components: allbuttons
            });
            await b?.deferUpdate();
          } else {
            currentPage = embeds.length - 1
            await pagemsg.edit({
              embeds:  [embeds[currentPage]],
              components: allbuttons
            });
            await b?.deferUpdate();
          }
        }

        //go forward
        else if (b?.customId == "3") {
          //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
          if (currentPage < embeds.length - 1) {
            currentPage++;
            await pagemsg.edit({
              embeds:  [embeds[currentPage]],
              components: allbuttons
            });
            await b?.deferUpdate();
          } else {
            currentPage = 0
            await pagemsg.edit({
              embeds:  [embeds[currentPage]],
              components: allbuttons
            });
            await b?.deferUpdate();
          }
        }
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(ee.erroroccur)
        .setTimestamp()
        .setDescription(eval("`\\`\\`\\` ${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\\`\\`\\``"))
      ]});
    }
    return;
  }
}