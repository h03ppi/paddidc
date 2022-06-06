//IMPORT FILE DATA
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const {
  databasing,
  escapeRegex,
  handlemsg
} = require("../../modules/functions");
//import the Discord Library
const Discord = require("discord.js");
let cpuStat = require("cpu-stat");
let os = require("os");
// HERE THE EVENT STARTS
module.exports = (client, message) => {

  //if message from a bot, or not in a guild return error
  if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return;
  try {
    //ensure the databases
    databasing(message.guild.id, client);
    // defining guild_settings 
    const guild_settings = client.settings.get(message.guild.id);
    //get the prefix from the DATABASE
    let { prefix } = guild_settings;
    // if mesage is from a bot
    if (message.author.bot) return;
    // if prefix in database is null
    if (prefix === null) prefix = config.prefix;
    //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    //if its not that then return
    if (!prefixRegex.test(message.content)) return;
    //now define the right prefix either ping or not ping
    const [, matchedPrefix] = message.content.match(prefixRegex);
    //create the arguments with sliceing of of the rightprefix length
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    //creating the cmd argument by shifting the args by 1
    const cmd = args.shift()?.toLowerCase();
    //if no cmd added return error
    if (cmd.length === 0) {
      if (matchedPrefix.includes(client.user.id))
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTimestamp()
            .setTitle(`Hugh? Ich wurde gepingt? Ich helfe dir`)
            .setDescription(`Um alle Befehle anzuzeigen, gebe ein: \`${prefix}help\`\n\nUm Join To Create zu setuppen: \`${prefix}setup\`\n\nUm das Setup zu bearbeiten, gebe ein: \`${prefix}editsetup\`\n\n*Es gibt 2 andere Setups, fügen einfach 2 oder 3 am Ende des Setups hinzu: \`${prefix}setup2\`/\`${prefix}setup3\`*`)]
        })
      return
    };

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    // If message.member is uncached, cache it.
    if (!message.member) message.member =  message.guild.fetchMember(message);

    
    
    if (cmd.length === 0) return;
    
    // Get the command
    let command = client.commands.get(cmd);
    // If none is found, try to find it by alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // If a command is finally found, run the command
    if (command) 
        command.run(client, message, args);


      else {
        return message.reply({
          embeds: [
            new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle("UNKNOWN CMD")
              .setDescription(`Sorry, ich kenne diesen Command nicht! Try: \`${prefix}help\``)
              .setFooter(ee.footertext, ee.footericon)
              .setTimestamp()
          ]
        })
      }   

      

    
    //if the Bot has not enough permissions return error
    /*let required_perms = ["MANAGE_CHANNELS", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"]
    if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS) && !message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS) && !message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES) && !message.guild.me.permissions.has(Discord.Permissions.FLAGS.VIEW_CHANNEL) && cmd != "help") {
      if (message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) {
        return message.reply({
          embeds: [
            new Discord.MessageEmbed()
              .setColor(ee.color)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle("❌ Error | I don't have enough Permissions!")
              .setDescription("Please give me just `ADMINISTRATOR`, because I need it to delete Messages, Create Channel and execute all Admin Commands.\n If you don't want to give me them, then those are the exact Permissions which I need: \n> `" + required_perms.join("`, `") + "`")
          ]
        })
      } else {
        return message.reply("❌ Error | I don't have enough Permissions! Please give me just `ADMINISTRATOR`, because I need it to delete Messages, Create Channel and execute all Admin Commands.\n If you don't want to give me them, then those are the exact Permissions which I need: \n> `" + required_perms.join("`, `") + "`")
      }
    };*/

    if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.VIEW_CHANNEL)) return;
    if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
    if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS))
      return message.reply(`❌ **Mir fehlt die Berechtigung zum EMBED LINKS (Send Embeds)**`)
    if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS))
      return message.reply(`❌ **Mir fehlt die Berechtigung zur VERWENDUNG EXTERNER EMOJIS**`)
    if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.ADD_REACTIONS))
      return message.reply(`❌ **Mir fehlt die Berechtigung zum HINZUFÜGEN VON REAKTIONEN**`)
    if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS))
      return message.reply(`❌ **Mir fehlt die Berechtigung zum VERWALTEN VON KANÄLEN**`)

    //ALL CMDS, yes not looking great but its enough ;)


    

    
  } catch (e) {
    console.log(e)
    message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTimestamp()
          .setTitle("ERROR | ERROR")
          .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
      ]
    }).then((msg) => {
      setTimeout(() => { msg.delete() }, 7500)
    })/*.then(msg => msg.delete({
      timeout: 7500
    }))*/
  }
};