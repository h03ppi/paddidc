const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const moment = require('moment');
const { GetUser, GetGlobalUser, handlemsg } = require(`../../modules/functions`)
const flags = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	DISCORD_PARTNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery',
	HOUSE_BRILLIANCE: 'House of Brilliance',
	HOUSE_BALANCE: 'House of Balance',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer'
};
function trimArray(arr, maxLen = 25) {
  if ([...arr.values()].length > maxLen) {
    const len = [...arr.values()].length - maxLen;
    arr = [...arr.values()].sort((a, b) => b?.rawPosition - a.rawPosition).slice(0, maxLen);
    arr.map(role => `<@&${role.id}>`)
    arr.push(`${len} more...`);
  }
  return arr.join(", ");
}
const statuses = {
  "online" : "🟢",
  "idle" : "🟠",
  "dnd" : "🔴",
  "offline" : "⚫️",
}
module.exports = {
  name: "userinfo",
  aliases: ["uinfo"],
  category: "general",
  description: "Get information about a user",
  usage: "userinfo [@USER] [global/guild]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    try {   
      var user;
      if(args[0]){
        try{
          if(args[1] && args[1].toLowerCase() == "global"){
            args.pop()
            user = await GetGlobalUser(message, args)
          }else {
            user = await GetUser(message, args)
          }
        }catch (e){
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
          return message.reply("Could not find the USER")
        }
      }else{
        user = message.author;
      }
      let banner = false;
      let customavatar = false;
      if(!user || user == null || user.id == null || !user.id) return message.reply("Could not find the USER")
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
      try{
        await user.fetch().then(user => {
          if(user.banner){
            banner = user.bannerURL({
              dynamic: true,
              size: 4096,
            })
          }
        }).catch(() => {})
      }catch (e) {
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
      }
      try{
        let member = message.guild.members.cache.get(user.id);
        if(!member) await message.guild.members.fetch(user.id).catch(() => {}) || false;
        const roles = member.roles;
        const userFlags = member.user.flags.toArray();
        const activity = member.presence ? member.presence.activities[0] : {
          type: "CUSTOM",
          emoji: {
            name: "❌"
          },
          state : "OFFLINE - No activity"
        };
        //create the EMBED
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor("Information über: " + `${member.user.tag} `, member.user.displayAvatarURL({ dynamic: true }), "https://discord.gg/6qwwTGVN9Y")
        embeduserinfo.addField("**<:arrow:971137602512109588> Nutzername:**",`> <@${member.user.id}>\n\`${member.user.tag}\``,true)
        embeduserinfo.addField("**<:arrow:971137602512109588> ID:**",`> \`${member.id}\``,true)
        embeduserinfo.addField("**<:arrow:971137602512109588> Profilbild:**",`> [\`Link to avatar\`](${member.user.displayAvatarURL({ format: "png" })})${customavatar ? `\n\n> [\`Link to Custom Avatar\`](${customavatar})`: ""}`,true)
        embeduserinfo.addField("**<:arrow:971137602512109588> Zeitpunkt DC gejoined:**", "> \`"+moment(member.user.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(member.user.createdTimestamp).format("hh:mm:ss") + "\`",true)
        embeduserinfo.addField("**<:arrow:971137602512109588> Zeitpunkt Server gejoined:**", "> \`"+moment(member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(member.joinedTimestamp).format("hh:mm:ss")+ "\`",true)
        embeduserinfo.addField("**<:arrow:971137602512109588> Flags:**",`> \`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}\``,true)
        embeduserinfo.addField("**<:arrow:971137602512109588> Status:**",`> \`${statuses[member.presence ? member.presence.status : "offline"]} ${member.presence ? member.presence.status : "offline"}\``,true)
        embeduserinfo.addField("**<:arrow:971137602512109588> Höchste Rolle:**",`> ${roles.size == 0 ? "Keine Rollen" : member.roles.highest.id === message.guild.id ? "Keine Rollen" : member.roles.highest}`,true)
        embeduserinfo.addField("**<:arrow:971137602512109588> Ist ein Bot:**",`> \`${member.user.bot ? "✔️" : "❌"}\``,true)
        var userstatus = "Hat keine Aktivität";
        if(activity){
          if(activity.type === "CUSTOM"){
            let emoji = `${activity.emoji ? activity.emoji?.id  ? `<${activity.emoji?.animated ? "a": ""}:${activity.emoji?.name}:${activity.emoji?.id }>`: activity.emoji?.name : ""}`
            userstatus = `${emoji} \`${activity.state || "Hat keine Aktivität"}\``
          }
          else{
            userstatus = `\`${activity.type.toLowerCase().charAt(0).toUpperCase() + activity.type.toLowerCase().slice(1)} ${activity.name}\``
          }
        }
        embeduserinfo.addField("**<:arrow:971137602512109588> Activität:**",`> ${userstatus}`)
        embeduserinfo.addField("**<:arrow:971137602512109588> Berechtigungen:**",`> ${member.permissions.toArray().includes("ADMINISTRATOR") ? "\`ADMINISTRATOR\`": member.permissions.toArray().sort((a, b) => a.localeCompare(b)).map(p=>`\`${p}\``).join("︲")}`.substring(0, 2048))
        embeduserinfo.addField(handlemsg("**<:arrow:971137602512109588> "+ `[${roles.cache.size}] Rollen:**`), roles.cache.size < 25 ? [...roles.cache.values()].sort((a, b) => b?.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') : roles.cache.size > 25 ? trimArray(roles.cache) : "Keine Rollen")
        embeduserinfo.setColor(ee.color)
        embeduserinfo.setFooter(ee.footertext, ee.footericon)
        embeduserinfo.setTimestamp()
        if(banner) embeduserinfo.setImage(banner)
        //send the EMBED
        message.reply({embeds: [embeduserinfo]})
      }catch (e) {
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
        const userFlags = user.flags?.toArray();
        //create the EMBED
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(customavatar ? customavatar : user.displayAvatarURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor("Information über:" + `${member.user.tag} `, member.user.displayAvatarURL({ dynamic: true }), "https://discord.gg/6qwwTGVN9Y")
        embeduserinfo.addField("**<:arrow:971137602512109588> Nutzername:**",`<@${user.id}>\n\`${user.tag}\``,true)
        embeduserinfo.addField("**<:arrow:971137602512109588> ID:**",`\`${user.id}\``,true)
        embeduserinfo.addField("**<:arrow:971137602512109588> Profilbild:**",`[\`Link to avatar\`](${user.displayAvatarURL({ format: "png" })})`,true)
        embeduserinfo.addField("**<:arrow:971137602512109588> Zeitpunkt DC gejoined:**", "\`"+moment(user.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(user.createdTimestamp).format("hh:mm:ss") + "\`",true)
        embeduserinfo.addField("**<:arrow:971137602512109588> Flags:**",`\`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}\``,true)
        embeduserinfo.addField("**<:arrow:971137602512109588> Ist ein Bot:**",`\`${user.bot ? "✔️" : "❌"}\``,true)
        embeduserinfo.setColor(ee.color)
        embeduserinfo.setFooter(ee.footertext, ee.footericon)
        embeduserinfo.setTimestamp()
        if(banner) embeduserinfo.setImage(banner)
        //send the EMBED
        message.reply({embeds: [embeduserinfo]})
      }
      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(":no: Ein Fehler ist aufgetreten")
        .setTimestamp()
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
