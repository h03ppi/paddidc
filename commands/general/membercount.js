const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
const { handlemsg } = require(`../../modules/functions`)
module.exports = {
  name: "membercount",
  aliases: ["members"],
  category: "general",
  description: "Shows how many Members there are in this Server",
  usage: "membercount",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    try {
      await message.guild.members.fetch().catch(() => {});
      
        message.reply({embeds: [new Discord.MessageEmbed()
        .setAuthor("Nutzer Anzahl Information über: " +message.guild.name, message.guild.iconURL({
          dynamic: true
        }), "https://discord.com/api/oauth2/authorize?client_id=734513783338434591&permissions=8&scope=bot%20applications.commands")
        .setColor(ee.color)
        .addField("<:arrow:971137602512109588> Alle NUTZER", "😀 \`" + message.guild.memberCount + "\`", true)
        .addField("<:arrow:971137602512109588> Alle MENSCHEN", "👤 \`" + message.guild.members.cache.filter(member => !member.user.bot).size + "\`", true)
        .addField("<:arrow:971137602512109588> Alle BOTS", "🤖 \`" + message.guild.members.cache.filter(member => member.user.bot).size + "\`", true)
        
        .addField("<:arrow:971137602512109588> ONLINE", "🟢 \`" + message.guild.members.cache.filter(member => member.presence && member.presence && member.presence.status != "offline").size + "\`", true)
        .addField("<:arrow:971137602512109588> ONLINE", "🟢 \`" + message.guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence && member.presence.status != "offline").size + "\`", true)
        .addField("<:arrow:971137602512109588> ONLINE", "🟢 \`" + message.guild.members.cache.filter(member => member.user.bot && member.presence && member.presence && member.presence.status != "offline").size + "\`", true)
        
        .addField("<:arrow:971137602512109588> ABWESEND", "🟠 \`" + message.guild.members.cache.filter(member => member.presence && member.presence && member.presence.status == "idle").size + "\`", true)
        .addField("<:arrow:971137602512109588> ABWESEND", "🟠 \`" + message.guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence && member.presence.status == "idle").size + "\`", true)
        .addField("<:arrow:971137602512109588> ABWESEND", "🟠 \`" + message.guild.members.cache.filter(member => member.user.bot && member.presence && member.presence && member.presence.status == "idle").size + "\`", true)
        
        .addField("<:arrow:971137602512109588> DND", "🔴 \`" + message.guild.members.cache.filter(member => member.presence && member.presence && member.presence.status == "dnd").size + "\`", true)
        .addField("<:arrow:971137602512109588> DND", "🔴 \`" + message.guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence && member.presence.status == "dnd").size + "\`", true)
        .addField("<:arrow:971137602512109588> DND", "🔴 \`" + message.guild.members.cache.filter(member => member.user.bot && member.presence && member.presence && member.presence.status == "dnd").size + "\`", true)
        
        .addField("<:arrow:971137602512109588> OFFLINE", ":black_circle: \`" + message.guild.members.cache.filter(member => !member.presence || member.presence && member.presence.status == "offline").size + "\`", true)
        .addField("<:arrow:971137602512109588> OFFLINE", ":black_circle: \`" + message.guild.members.cache.filter(member => !member.user.bot && (!member.presence || member.presence && member.presence.status == "offline")).size + "\`", true)
        .addField("<:arrow:971137602512109588> OFFLINE", ":black_circle: \`" + message.guild.members.cache.filter(member => member.user.bot && (!member.presence || member.presence && member.presence.status == "offline")).size + "\`", true)
        .setFooter(ee.footertext, ee.footericon)
        .setTimestamp()
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