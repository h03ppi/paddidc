
//import the Discord Library
const Discord = require("discord.js");
let cpuStat = require("cpu-stat");
let fs = require("fs");
//IMPORT FILE DATA
const reactionRolesConfig = JSON.parse(fs.readFileSync('reactionroles.json' , 'utf8'))
// HERE THE EVENT STARTS
module.exports = (client) => {

    console.log(` :: ⬜️ Module: createreaction`);


    client.on("messageReactionAdd", async (reaction, user) => {
        if(reaction.message.partial) reaction.fetch();
        if(reaction.partial) reaction.fetch();
        if(user.bot || !reaction.message.guild) return;
        
      
        for (let index = 0; index < reactionRolesConfig.reactions.length; index++) {
          let reactionrole = reactionRolesConfig.reactions[index];
      
          if(reaction.message.id == reactionrole.message && reaction.emoji.name == reactionrole.emoji){
            reaction.message.guild.members.cache.get(user.id).roles.add(reactionrole.role)
            reaction.message.guild.members.cache.get(user.id).roles.remove(reactionrole.role2)
    
          }
          
        }
      })
      
      client.on("messageReactionRemove", async (reaction, user) => {
        if(reaction.message.partial) reaction.fetch();
        if(reaction.partial) reaction.fetch();
        if(user.bot || !reaction.message.guild) return;
        
        
        for (let index = 0; index < reactionRolesConfig.reactions.length; index++) {
          let reactionrole = reactionRolesConfig.reactions[index];
      
          if(reaction.message.id == reactionrole.message && reaction.emoji.name == reactionrole.emoji){
            reaction.message.guild.members.cache.get(user.id).roles.remove(reactionrole.role)
            reaction.message.guild.members.cache.get(user.id).roles.add(reactionrole.role2)
    
          }
          
        }
      })
      
      
      client.on('message', async (msg) => {
    
        var roleid = '886242229461581834';
        var roleid2 = '886244416476561428';
        
        
      
        var role = msg.guild.roles.cache.get(roleid);
        var role2 = msg.guild.roles.cache.get(roleid2);
        
      
        if(msg.author.bot || !msg.guild) return;
        if(msg.content.startsWith('?createReactionRole')){
          var args = msg.content.split(' ');
          if(args.length == 2){
    
    
            var emoji = args[1];
            
            if(!role || !role2){
              msg.reply('die rolle gibt es nicht')
              return;
            } 
            const embed = new Discord.MessageEmbed()
            
            .setTitle('⛔ Discord VERIFY ⛔', true)
            .setDescription("Hey, \n\nWir hoffen du bist gut auf dem Discord angekommen, und wir freuen uns das du den Weg her gefunden hast. \n\nBei klicken auf den grünen Haken bestätigst du, dass du die Regeln gelesen und damit einverstanden bist. \n\n <#832301084998893617> \n\nBei einem Regelbruch musst du mit den folgenden Konsequenzen rechnen!")
            .setColor("#FFFFFF")
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(client.user.username, client.user.displayAvatarURL())
            
            const message = await msg.channel.send({embeds:[embed]})
            message.react(emoji)
            
            var toSave = {message: message.id, emoji: emoji, role: roleid, role2: roleid2}
            reactionRolesConfig.reactions.push(toSave);
            let data = JSON.stringify(reactionRolesConfig);
            fs.writeFileSync('reactionroles.json', data);   
          }
           
        }
      
      })
};