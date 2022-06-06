const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
const moment = require("moment")
const { swap_pages2, handlemsg } = require(`../../modules/functions`)
module.exports = {
  name: "serverinfo",
  aliases: ["sinfo"],
  category: "general",
  description: "Shows info about a server",
  usage: "serverinfo",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player) => {
  
    try {
      function trimArray(arr, maxLen = 40) {
        if ([...arr.values()].length > maxLen) {
          const len = [...arr.values()].length - maxLen;
          arr = [...arr.values()].sort((a, b) => b?.rawPosition - a.rawPosition).slice(0, maxLen);
          arr.map(role => `<@&${role.id}>`)
          arr.push(`${len} more...`);
        }
        return arr.join(", ");
      }
      message.guild.owner = await message.guild.fetchOwner().then(m => m.user).catch(() => {})
      await message.guild.members.fetch().catch(() => {});
      function emojitrimarray(arr, maxLen = 35) {
        if (arr.length > maxLen) {
          const len = arr.length - maxLen;
          arr = arr.slice(0, maxLen);
          arr.push(`${len} more...`);
        }
        return arr.join(", ");
      }

      const owner = "881288912922890262"
      let boosts = message.guild.premiumSubscriptionCount;
      var boostlevel = 0;
      if (boosts >= 2) boostlevel = "1";
      if (boosts >= 7) boostlevel = "2";
      if (boosts >= 14) boostlevel = "3 / ∞";
      let maxbitrate = 96000;
      if (boosts >= 2) maxbitrate = 128000;
      if (boosts >= 7) maxbitrate = 256000;
      if (boosts >= 14) maxbitrate = 384000;
      let embed = new Discord.MessageEmbed()
      .setAuthor("Server Information über: " + message.guild.name, message.guild.iconURL({ dynamic: true }), `https://discord.gg/6qwwTGVN9Y`)
      //embed.setThumbnail(message.member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      embed.addField("**<:arrow:971137602512109588> Besitzer:**", `<@881288912922890262>\n\`PADDi_TV#0277\``, true)
      embed.addField("**<:arrow:971137602512109588> Erstellt an:**", "\`" + moment(message.guild.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(message.guild.createdTimestamp).format("hh:mm:ss") +"`", true)
      embed.addField("**<:arrow:971137602512109588> Du bist beigetreten:**", "\`" + moment(message.member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(message.member.joinedTimestamp).format("hh:mm:ss") +"`", true)
    
      embed.addField("**<:arrow:971137602512109588> Alle Channel:**", "👁‍🗨 \`" + message.guild.channels.cache.size + "\`", true)
      embed.addField("**<:arrow:971137602512109588> Text Channel:**", "💬 \`" + message.guild.channels.cache.filter(channel => channel.type == "GUILD_TEXT").size + "\`", true)
      embed.addField("**<:arrow:971137602512109588> Voice Channel:**", "🔈 \`" + message.guild.channels.cache.filter(channel => channel.type == "GUILD_VOICE").size + "\`", true)
     
      embed.addField("**<:arrow:971137602512109588> Alle NUTZER:**", `😀 \`${message.guild.memberCount}\`/${message.guild.maximumMembers ? "100.000": message.guild.maximumMembers}`, true)
      embed.addField("**<:arrow:971137602512109588> Alle MENSCHEN:**", "👤 \`" + message.guild.members.cache.filter(member => !member.user.bot).size + "\`", true)
      embed.addField("**<:arrow:971137602512109588> Alle BOTS:**", "🤖 \`" + message.guild.members.cache.filter(member => member.user.bot).size + "\`", true)
      

      embed.addField("**<:arrow:971137602512109588> Rules Channel:**", `${message.guild.rulesChannel ? `<#${message.guild.rulesChannelId}>`: "<:no:970251607184928768> \`No Channel\`"}`, true)
      embed.addField("**<:arrow:971137602512109588> Public Updates Channel:**", `${message.guild.publicUpdatesChannel ? `<#${message.guild.publicUpdatesChannelId}>`: "<:no:970251607184928768> \`No Channel\`"}`, true)
      embed.addField("**<:arrow:971137602512109588> AFK Channel:**", `${message.guild.afkChannel ? `<#${message.guild.afkChannelId}>`: "<:no:970251607184928768> \`No Channel\`"}`, true)

      embed.addField("**<:arrow:971137602512109588> ONLINE:**", "🟢 \`" + message.guild.members.cache.filter(member => member.presence && member.presence && member.presence.status != "offline").size + "\`", true)
      embed.addField("**<:arrow:971137602512109588> OFFLINE:**", ":black_circle:\`" + message.guild.members.cache.filter(member => !member.presence || member.presence && member.presence.status == "offline").size + "\`", true)
      embed.addField("**<:arrow:971137602512109588> Alle Boosts:**", "<a:nitro_logo:971137602658897960> \`" + message.guild.premiumSubscriptionCount + "\`", true)

      embed.addField("**<:arrow:971137602512109588> Boost-Level:**", `<a:nitro:971137602818285588> \`${boostlevel}\``, true)
      embed.addField("**<:arrow:971137602512109588> Max-Channel-Bitrate:**", "👾 \`" + maxbitrate + " kbps\`", true)
      if(boosts >= 14){
          embed.addField(`**<:arrow:971137602512109588> Vanity:**`, `${message.guild.vanityURLCode ? `https://discord.gg/${message.guild.vanityURLCode}` : "<:no:970251607184928768> No Vanity-Invite"}`)
      }

      
      
      
      //add the footer to the end
      
    
        embed.setThumbnail(message.guild.iconURL({
            dynamic: true
        }));
        
        embed.setColor(ee.color);
        embed.setFooter("ID: " + message.guild.id, message.guild.iconURL({
          dynamic: true
        }))
      return message.reply({embeds: [embed]});
      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(":x: Ein Fehler ist aufgetreten")
        .setDescription(eval("`\\`\\`\\` ${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\\`\\`\\``"))
      ]});
    }
  }
}