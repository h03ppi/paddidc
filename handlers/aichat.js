//import the config.json file
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var {
    MessageEmbed, MessageAttachment, User, Permissions
} = require(`discord.js`);
const { databasing } = require(`../modules/functions`)
const fetch = require("node-fetch")
module.exports = client => {
    

    // AFK SYSTEM
    client.on("messageCreate", async message => {
        try{
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot ) return;
            for(const user of [...message.mentions.users.values()]){
                if(client.afkDB.has(message.guild.id + user.id)){
                    await message.reply({content: `:cry: **${user.tag}** ist AFK <t:${Math.floor(client.afkDB.get(message.guild.id+user.id, "stamp") / 1000)}:R>!${client.afkDB.get(message.guild.id+user.id, "message") && client.afkDB.get(message.guild.id+user.id, "message").length > 1 ? `\n\n__Seine Nachricht__\n>>> ${String(client.afkDB.get(message.guild.id+user.id, "message")).substring(0, 1800).split(`@`).join(`\`@\``)}` : "" }`}).then(msg=>{
                        setTimeout(()=>{
                            try{
                                msg.delete().catch(() => {});
                            }catch{  }
                        }, 5000)
                    }).catch(() => {})
                }
            }
        }catch(e){
            console.log(String(e).grey)
        }
    });
    // AFK SYSTEM
    client.on("messageCreate", async message => {
        try{
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot) return;
            if(message.content && !message.content.toLowerCase().startsWith("[afk]") && client.afkDB.has(message.guild.id + message.author.id)){
                if(Math.floor(client.afkDB.get(message.guild.id+message.author.id, "stamp") / 10000) == Math.floor(Date.now() / 10000)) return console.log("AFK CMD");
                await message.reply({content: `:tada: Willkommen zurück **${message.author.username}!** :tada:\n> Du warst <t:${Math.floor(client.afkDB.get(message.guild.id+message.author.id, "stamp") / 1000)}:R> AFK`}).then(msg=>{
                    setTimeout(()=>{ msg.delete().catch(() => {}) }, 5000)
                }).catch(() => {})
                client.afkDB.delete(message.guild.id + message.author.id)
            }
        }catch(e){
            console.log(String(e).grey)
        }
    });

    client.on("guildMemberRemove", async (member) => {
        await client.channels.cache.get('939517493574266880').setName(`👤│Users: ${member.guild.members.cache.filter(m => !m.user.bot).size}`)
        })
      
      client.on("guildMemberAdd", async (member) => {
        await client.channels.cache.get('939517493574266880').setName(`👤│Users: ${member.guild.members.cache.filter(m => !m.user.bot).size}`)
        })
    
}