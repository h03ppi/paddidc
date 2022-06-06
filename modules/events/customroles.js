const { Message, MessageEmbed } = require("discord.js")
const  fs  = require("fs")

module.exports = client => {
    console.log(` :: ⬜️ Module: customrole`);

  const customsRolesConfig = JSON.parse(fs.readFileSync('customrole.json' , 'utf8'))
  

  client.on('message', async (msg) => {

    var roleid = '967827164256956488';
    
    
  
    var role = msg.guild.roles.cache.get(roleid);
    

  
    if(msg.author.bot || !msg.guild) return;
    if(msg.content.startsWith('?createCustomRole')){
      var args = msg.content.split(' ');
      if(args.length == 2){


        var emoji = args[1];
        
        if(!role){
          msg.reply('die rolle gibt es nicht')
          return;
        } 
        var embed = new MessageEmbed()
        
        .setTitle('⛔ CUSTOMS GAMES VERIFY ⛔', true)
        .setDescription("Hey, \n\nBei klicken auf den grünen Haken bestätigst du, dass du die Regeln gelesen und damit einverstanden bist. \n\n <#967824791476256838> \n\nBei einem Regelbruch musst du mit den folgenden Konsequenzen rechnen!")
        .setColor("#FFFFFF")
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(client.user.username, client.user.displayAvatarURL())
        
        var message = await msg.channel.send({embeds:[embed]})
        message.react(emoji)
        
        var toSave = {message: message.id, emoji: emoji, role: roleid}
        customsRolesConfig.reactions.push(toSave);
        let data = JSON.stringify(customsRolesConfig);
        fs.writeFileSync('customrole.json', data);   
      }
       
    }
  
  })

  client.on("messageReactionAdd", async (reaction, user) => {
    if(reaction.message.partial) reaction.fetch();
    if(reaction.partial) reaction.fetch();
    if(user.bot || !reaction.message.guild) return;
    
  
    for (let index = 0; index < customsRolesConfig.reactions.length; index++) {
      let customrole  = customsRolesConfig.reactions[index];
  
      if(reaction.message.id == customrole.message && reaction.emoji.name == customrole.emoji){
        reaction.message.guild.members.cache.get(user.id).roles.add(customrole.role)
        

      }
      
    }
  })

  client.on("messageReactionRemove", async (reaction, user) => {
    if(reaction.message.partial) reaction.fetch();
    if(reaction.partial) reaction.fetch();
    if(user.bot || !reaction.message.guild) return;
    
    
    for (let index = 0; index < customsRolesConfig.reactions.length; index++) {
      let customrole = customsRolesConfig.reactions[index];
  
      if(reaction.message.id == customrole.message && reaction.emoji.name == customrole.emoji){
        reaction.message.guild.members.cache.get(user.id).roles.remove(customrole.role)
        

      }
      
    }
  })
}