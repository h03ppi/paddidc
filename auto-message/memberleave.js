const { GuildMember, MessageEmbed } = require("discord.js")
const config = require("../botconfig/config.json")

module.exports = function (client) {
    console.log(` :: ⬜️ Module: memberleave`);
    const channelID = config.leavechannel

    client.on("guildMemberRemove", (GuildMember) => {
      

      
      const channel = GuildMember.guild.channels.cache.get(channelID)

        const embed = new MessageEmbed()
        .setTitle("PADDi_TV´s Community")
        .setDescription(`Schade das **${GuildMember.user.username}**, **PADDi_TV´s Community** verlassen hat.`)
        .setColor("#FFFFFF")
        .setThumbnail(GuildMember.user.displayAvatarURL())
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp()
        
        
        channel.send({embeds:[embed]})
        
    })
}