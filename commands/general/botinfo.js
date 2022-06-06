const Discord = require("discord.js");
const moment = require("moment");
let os = require("os");
let cpuStat = require("cpu-stat");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const { duration, handlemsg } = require(`../../modules/functions`);
const { connected } = require("process");
module.exports = {
    name: "botinfo",
    aliases: ["binfo", "botabout"],
    category: "general",
    description: "Sends detailed info about the client",
    usage: "botinfo",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix) => {
    
    try{
      let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed().setColor(ee.color)
      .setAuthor("Bekomme Bot Informationen...", "https://cdn.discordapp.com/emojis/756773010123522058.gif", "https://discord.gg/milrato")]})
      cpuStat.usagePercent(function (e, percent, seconds) {
          if (e) {
              return console.log(e.stack ? String(e.stack).grey : String(e).grey);
          }
          let connectedchannelsamount = 0;
          let guilds = client.guilds.cache.map((guild) => guild);
          for (let i = 0; i < guilds.length; i++) {
              if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
          }
        const totalGuilds = client.guilds.cache.size;
        const totalMembers = client.users.cache.size;
        countertest = 0;
        const botinfo = new Discord.MessageEmbed()
            .setAuthor(client.user.tag + " Information", client.user.displayAvatarURL(), `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`) 
            .setDescription(eval("`\\`\\`\\`yml\\nName: ${client.user.tag} [${client.user.id}]\\nBot Latency: ${Math.round(Date.now() - message.createdTimestamp)}ms\\nApi Latency: ${Math.round(client.ws.ping)}ms\\nRuntime: ${duration(client.uptime).join(\"︲\")}\\`\\`\\``"))
            .setColor(ee.color).setThumbnail(client.user.displayAvatarURL())
            .addField("<:arrow:971137602512109588> Generell -- Statistik", handlemsg("```yml\nServer: {totalGuilds}\nNutzer: {totalMembers}\nCommands: "+ `${client.commands.size}`+"```", {totalGuilds: totalGuilds, totalMembers: totalMembers, connections: connectedchannelsamount, connectedchannelsamount: connectedchannelsamount}), true)
            .addField("<:arrow:971137602512109588> Bot -- Statistik", `\`\`\`yml\nNode.js: ${process.version}\nDiscord.js: v${Discord.version}\nEnmap: v5.8.4\`\`\``, true)
            .addField("<:arrow:971137602512109588> System -- Statistik", handlemsg("```yml\nOS: Linux | Debian\nCPU Nutzung: {cpu} %\nRAM Nutzung: {ram} MB```", {cpu: percent.toFixed(2), ram: (process.memoryUsage().heapUsed/1024/1024).toFixed(2)}))
            .addField("<:arrow:971137602512109588> Programmierer", `\`\`\`yml\nName: h03ppi#4282\nID: [345538444564496384]\`\`\``, true)
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
        tempmsg.edit({embeds: [botinfo]});
      });
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(ee.erroroccur)
          .setDescription(eval("`\\`\\`\\` ${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\\`\\`\\``"))
        ]});
    }
  },
};