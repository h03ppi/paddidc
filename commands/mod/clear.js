const {
    MessageEmbed, Collection, Permissions
  } = require(`discord.js`);
  const config = require(`../../botconfig/config.json`);
  var ee = require(`../../botconfig/embed.json`);
  module.exports = {
    name: `clear`,
    aliases: [`purge`],
    category: `🚫 Administration`,
    description: `Deletes messages in a text channel or specified number of messages in a text channel.\n\nIf you Ping a User / Type "BOTS" after it, the amount of messages you give, is the amount of messages that will be checked, not that will be cleared!`,
    usage: `clear <Amount of messages> [@USER/BOTS]`,
    type: "channel",
    run: async (client, message, args, cmduser, text, prefix) => {
      
        try {

            let number = args[0] || args._hoistedOptions[0].value
            if(isNaN(number)) return message.reply("Bitte gebe eine Zahl zwischen `0` und `100` ein!").then(async msg => setTimeout(async () => {msg.delete()}, 5000))
            if(parseInt(number) <= 0 || parseInt(number) > 100) return message.reply("Bitte gebe eine Zahl zwischen `0` und `100` ein!").then(async msg1 => setTimeout(async () => {msg1.delete()}, 5000))

            try {await message.delete()} catch (err) {}

            message.channel.bulkDelete(number).catch(async err => {
                console.log(err)
                if(err) return message.reply("Nachrichten sind älter als 14 Tage!")

            }).then(async msg => {

                try {
                    await message.reply(`${message.author === undefined ? message.user : message.author} habe erfolgreich \`${msg.size}\` Nachrichten gelöschte!`)
                } catch (err) {
                    await message.channel.send(`${message.author === undefined ? message.user : message.author} habe erfolgreich \`${msg.size}\` Nachrichten gelöschte!`).then(async mess => setTimeout(async () => {mess.delete()}, 5000))
                }
            })

        } catch (err) {

            return message.reply("Bitte gebe eine Zahl zwischen `0` und `100` ein!")
        }
    }
}