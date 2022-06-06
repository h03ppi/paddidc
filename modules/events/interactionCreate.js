//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const {
  onCoolDown,
  escapeRegex,
  delay,
  simple_databasing,
  databasing, 
  handlemsg,
  check_if_dj
} = require(`../../modules/functions`);
const Discord = require("discord.js");
module.exports = async (client, interaction) => {
      if (!interaction?.isCommand()) return;
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp
      } = interaction;
      const {
        guild
      } = member;
      if(!guild) {
        return interaction?.reply({content: ":x: Interactions only Works inside of GUILDS!", ephemeral: true}).catch(()=>{});
      }
      const CategoryName = interaction?.commandName;
      simple_databasing(client, guild.id, member.id)
      var not_allowed = false;
      const guild_settings = client.settings.get(guild.id);
      let es = guild_settings.embed;
      let ls = guild_settings.language;
      let {
        prefix,
        botchannel,
        unkowncmdmessage
      } = guild_settings;
      let command = false;
      if (command) {
        if (!command.category?.toLowerCase().includes("nsfw") && botchannel.toString() !== "") {
          if (!botchannel.includes(channelId) && !member.permissions.has("ADMINISTRATOR")) {
            for(const channelId of botchannel){
              let channel = guild.channels.cache.get(channelId);
              if(!channel){
                client.settings.remove(guild.id, channelId, `botchannel`)
              }
            }
            not_allowed = true;
            return interaction?.reply({ephmerla: true, embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle("<:no:833101993668771842> **Not in the Bot Chat!**")
              .setDescription(`${"**There is a Bot chat setup in this GUILD! Try using the Bot Commands here:**"}\n> ${botchannel.map(c=>`<#${c}>`).join(", ")}`)]}
            )
          }
        }
        if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
          client.cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now(); //get the current time
        const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
        const cooldownAmount = (command.cooldown || 1) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
        if (timestamps.has(member.id)) { //if the user is on cooldown
          const expirationTime = timestamps.get(member.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
          if (now < expirationTime) { //if he is still on cooldonw
            const timeLeft = (expirationTime - now) / 1000; //get the lefttime
            not_allowed = true;
            return interaction?.reply({
              ephemeral: true,
              embeds: [new Discord.MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(handlemsg(client.la[ls].common.cooldown, {
                  time: timeLeft.toFixed(1),
                  commandname: command.name
                }))
              ]
            }); //send an information message
          }
        }
        timestamps.set(member.id, now); //if he is not on cooldown, set it to the cooldown
        setTimeout(() => timestamps.delete(member.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
        client.stats.inc(guild.id, "commands"); //counting our Database stats for SERVER
        client.stats.inc("global", "commands"); //counting our Database Stats for GLOBAL
        //if Command has specific permission return error
        if (command.memberpermissions && command.memberpermissions.length > 0 && !interaction?.member.permissions.has(command.memberpermissions)) {
          return interaction?.reply({
                ephemeral: true,
                embeds: [new Discord.MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(client.la[ls].common.permissions.title)
                    .setDescription(`${client.la[ls].common.permissions.description}\n> \`${command.memberpermissions.join("`, ``")}\``)   
          ]
          });
    }
      

    
    
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    //run the command with the parameters:  client, message, args, user, text, prefix,
    if (not_allowed) return
    let message = {
      applicationId: interaction?.applicationId,
      attachments: [],
      author: member.user,
      channel: guild.channels.cache.get(interaction?.channelId),
      channelId: interaction?.channelId,
      member: member,
      client: interaction?.client,
      components: [],
      content: null,
      createdAt: new Date(interaction?.createdTimestamp),
      createdTimestamp: interaction?.createdTimestamp,
      embeds: [],
      id: null,
      guild: interaction?.member.guild,
      guildId: interaction?.guildId,
    }
    //Execute the Command
		command.run(client, interaction, interaction?.member.user, es, ls, prefix, player, message)
	}
}
