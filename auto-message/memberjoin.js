const { GuildMember, MessageEmbed } = require("discord.js")
const config = require("../botconfig/config.json")

module.exports = function (client) {
    console.log(` :: ⬜️ Module: memberjoin`);
    const channelID = config.joinchannel

    client.on("guildMemberAdd", (GuildMember) => {
      
      const channel = GuildMember.guild.channels.cache.get(channelID)
      const memberRole = GuildMember.guild.roles.cache.get(config.joinrole)
      
      

       

        GuildMember.roles.add(memberRole)

        const embed = new MessageEmbed()
        .setTitle("PADDi_TV´s Community")
        .setDescription(`Guten Tag ${GuildMember}, willkommen auf dem Community Discord Server von **PADDi_TV**! Hoffentlich hast du eine menge Spaß. <:love:939511558843826227>`)
        .setThumbnail(GuildMember.user.displayAvatarURL())
        .setColor("#FFFFFF")
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp()
        
        
        channel.send({embeds:[embed]})
      

        
    })
}
