//load the data
const config = require("../botconfig/config.json");
const Discord = require("discord.js");
const ee = require("../botconfig/embed.json");



module.exports = {
    handlemsg,   
    databasing,
    duration,
    reset_DB,
    change_status,
    check_voice_channels,  
    create_join_to_create_Channel,  
    escapeRegex,
    GetUser,
    GetGlobalUser,
    swap_pages2,
    nFormatter
  }


//Start the module

function nFormatter(num, digits = 2) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}


function duration(duration, useMilli = false) {
  let remain = duration;
  let days = Math.floor(remain / (1000 * 60 * 60 * 24));
  remain = remain % (1000 * 60 * 60 * 24);
  let hours = Math.floor(remain / (1000 * 60 * 60));
  remain = remain % (1000 * 60 * 60);
  let minutes = Math.floor(remain / (1000 * 60));
  remain = remain % (1000 * 60);
  let seconds = Math.floor(remain / (1000));
  remain = remain % (1000);
  let milliseconds = remain;
  let time = {
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  };
  let parts = []
  if (time.days) {
    let ret = time.days + ' Day'
    if (time.days !== 1) {
      ret += 's'
    }
    parts.push(ret)
  }
  if (time.hours) {
    let ret = time.hours + ' Hr'
    if (time.hours !== 1) {
      ret += 's'
    }
    parts.push(ret)
  }
  if (time.minutes) {
    let ret = time.minutes + ' Min'
    if (time.minutes !== 1) {
      ret += 's'
    }
    parts.push(ret)

  }
  if (time.seconds) {
    let ret = time.seconds + ' Sec'
    if (time.seconds !== 1) {
      ret += 's'
    }
    parts.push(ret)
  }
  if (useMilli && time.milliseconds) {
    let ret = time.milliseconds + ' ms'
    parts.push(ret)
  }
  if (parts.length === 0) {
    return ['instantly']
  } else {
    return parts
  }
}

//FUNCTION FOR ENSURING THE databases
function databasing(guildid, client) {
    client.settings.ensure(guildid, {
        prefix: config.prefix,
        channel: "",
        channelname: "{user} - VC",
        guild: guildid,
    });
};

//Function to reset the Database
function reset_DB(guildid, client) {
    client.settings.set(guildid, {
        prefix: config.prefix,
        channel: "",
        channelname: "{user} - VC",
        guild: guildid,
    });
};

//FUNCTION FOR CHECKING THE PREFIX !
function escapeRegex(str) {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`)
    } catch (e) {

    }
};

  function change_status(client){
    
    const statusOptions = ['twitch.tv/PADDi_TV', 'tiktok.com/@paddi_tv', 'Developed by h03ppi#4282']

    let counter = 0

    const updateStatus = () => {
        client.user?.setPresence({
            status: 'online',
            activities: [
                {
                    name: statusOptions[counter],
                    type: "STREAMING",
                    url: "https://www.twitch.tv/paddi_tv"

                }
            ]
        })

        if (++counter >= statusOptions.length) {
            counter = 0
        }

        setTimeout(updateStatus, 7 * 1000)
    }
    updateStatus()

}

function GetUser(message, arg){
    var errormessage = "<:no:833101993668771842> I failed finding that User...";
    return new Promise(async (resolve, reject) => {
      var args = arg, client = message.client;
      if(!client || !message) return reject("CLIENT IS NOT DEFINED")
      if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
      let user = message.mentions.users.first();
      if(!user && args[0] && args[0].length == 18) {
        user = await client.users.fetch(args[0]).catch((e)=>{
          return reject(errormessage);
        })
        if(!user) return reject(errormessage)
        return resolve(user);
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
      
      else if(!user && args[0]){
        let alluser = message.guild.members.cache.map(member=> String(member.user.tag).toLowerCase())
        user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
        user = message.guild.members.cache.find(me => String(me.user.tag).toLowerCase() == user)
        if(!user || user == null || !user.id) {
          alluser = message.guild.members.cache.map(member => String(member.displayName + "#" + member.user.discriminator).toLowerCase())
          user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
          user = message.guild.members.cache.find(me => String(me.displayName + "#" + me.user.discriminator).toLowerCase() == user)
          if(!user || user == null || !user.id) return reject(errormessage)
        }
        user = await client.users.fetch(user.user.id).catch(() => {})
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else {
        user = message.mentions.users.first() || message.author;
        return resolve(user);
      }
    })
  }
  function GetGlobalUser(message, arg){
    var errormessage = "<:no:833101993668771842> I failed finding that User...";
    return new Promise(async (resolve, reject) => {
      var args = arg, client = message.client;
      if(!client || !message) return reject("CLIENT IS NOT DEFINED")
      if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
      let user = message.mentions.users.first();
      if(!user && args[0] && args[0].length == 18) {
        user = await client.users.fetch(args[0]).catch(() => {})
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else if(!user && args[0]){
        let alluser = [], allmembers = [];
        var guilds = [...client.guilds.cache.values()];
        for(const g of guilds){
          var members = g.members.cache.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
          for(const m of members) { alluser.push(m.user.tag); allmembers.push(m); }
        }
        user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
        user = allmembers.find(me => String(me.user.tag).toLowerCase() == user)
        if(!user || user == null || !user.id) {
          user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
          user = allmembers.find(me => String(me.displayName + "#" + me.user.discriminator).toLowerCase() == user)
          if(!user || user == null || !user.id) return reject(errormessage)
        }
        user = await client.users.fetch(user.user.id).catch(() => {})
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else {
        user = message.mentions.users.first() || message.author;
        return resolve(user);
      }
    })
  }



//function to check voice channels
function check_voice_channels(client) {
    let guilds = client.guilds.cache.map(guild => guild.id);
    for (let i = 0; i < guilds.length; i++) {
        try {
            let guild = client.guilds.cache.get(guilds[i]);
            databasing(guild.id, client);
            let jointocreate = []; //get the data from the database onto one variables
            jointocreate.push(client.settings.get(guild.id, "channel"));
            for (let j = 0; j < jointocreate.length; j++) {
                let channel = guild.channels.cache.get(jointocreate[j]);
                if (!channel) continue;
                let members = channel.members.map(guild => guild.id);
                if (!members) continue;
                for (let k = 0; k < members.length; k++) {
                    let member = guild.members.cache.get(members[k]);
                    create_join_to_create_Channel(client, member.voice, j + 1)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
    return
};

//function to create a voice channel
function create_join_to_create_Channel(client, user, type) {
    if (type == 1) chname = client.settings.get(user.member.guild.id, "channelname");
    else chname = "{user}'s Room";
    //CREATE THE CHANNEL
    let allowed = true;
    if (!user.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) {
        allowed = false;
        try {
            user.member.user.send("${user.member.user} | :x: Error | Bitte gebe mir Rechte, `MANGE CHANNELS` --> Ich muss Kanäle erstellen können ...")
        } catch {
            try {
                let channel = guild.channels.cache.find(
                    channel =>
                        channel.type === "text" &&
                        channel.permissionsFor(guild.me).has("SEND_MESSAGES")
                );
                channel.send(`${user.member.user} | :x: Error | Bitte gebe mir Rechte, \`MANGE CHANNELS\` --> Ich muss Kanäle erstellen können ...`)
            } catch { }
        }
    };
    if (allowed) {
        console.log(`Created the Channel: ${String(chname.replace("{user}", user.member.user.username)).substr(0, 32)} in: ${user.guild ? user.guild.name : "undefined"}`.brightGreen);

        user.guild.channels.create(String(chname.replace("{user}", user.member.user.username)).substr(0, 32), {
            type: 'GUILD_VOICE',
            permissionOverwrites: [ //update the permissions
                {
                    id: user.id, //the user is allowed to change everything
                    allow: ['MANAGE_CHANNELS', "VIEW_CHANNEL", "MANAGE_ROLES", "CONNECT"]
                },
                { //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
                    id: user.guild.id,
                    allow: ['VIEW_CHANNEL', "CONNECT"]
                }
            ],
        }).then(vc => {
            if (user.channel.parent) vc.setParent(user.channel.parent)
            client.jointocreatemap.set(`owner_${vc.guild.id}_${vc.id}`, user.id);
            client.jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);
            user.setChannel(vc)
        })
    }
};

function handlemsg(txt, options) {
    let text = String(txt);
    for(const option in options){ 
      var toreplace = new RegExp(`{${option.toLowerCase()}}`,"ig");
      text = text.replace(toreplace, options[option]);
    }
    return text;
  }

  async function swap_pages2(client, message, embeds) {
    let currentPage = 0;
    let cmduser = message.author;
    if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
    let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel("Back")
    let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
    let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel("Forward")
    let button_blank = new MessageButton().setStyle('SECONDARY').setCustomId('button_blank').setLabel("\u200b").setDisabled();
    let button_stop = new MessageButton().setStyle('DANGER').setCustomId('stop').setEmoji("🛑").setLabel("Stop")
    const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward, button_blank, button_stop])]
    let prefix = client.settings.get(message.guild.id, "prefix");
    //Send message with buttons
    let swapmsg = await message.channel.send({   
        content: `***Click on the __Buttons__ to swap the Pages***`,
        embeds: [embeds[0]], 
        components: allbuttons
    });
    //create a collector for the thinggy
    const collector = swapmsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.author.id == client.user.id, time: 180e3 }); //collector for 5 seconds
    //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
    collector.on('collect', async b => {
        if(b?.user.id !== message.author.id)
          return b?.reply({content: `<:no:833101993668771842> **Only the one who typed ${prefix}help is allowed to react!**`, ephemeral: true})
          //page forward
          if(b?.customId == "1") {
            collector.resetTimer();
            //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
              if (currentPage !== 0) {
                currentPage -= 1
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
              } else {
                  currentPage = embeds.length - 1
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                  await b?.deferUpdate();
              }
          }
          //go home
          else if(b?.customId == "2"){
            collector.resetTimer();
            //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
              currentPage = 0;
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
              await b?.deferUpdate();
          } 
          //go forward
          else if(b?.customId == "3"){
            collector.resetTimer();
            //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
              if (currentPage < embeds.length - 1) {
                  currentPage++;
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                  await b?.deferUpdate();
              } else {
                  currentPage = 0
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                  await b?.deferUpdate();
              }
          
          } 
          //go forward
          else if(b?.customId == "stop"){
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
              await b?.deferUpdate();
              collector.stop("stopped");
          }
    });
    collector.on("end", (reason) => {
      if(reason != "stopped"){
        swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
      }
    })
  
  }
  const Parser = require("rss-parser");
const parser = new Parser();
//UGLY STUFF:
async function getLatestVideos(ChannelLink) {
  return new Promise(async (res, rej) => {
      try {
          if (!ChannelLink) return rej("A String is required for the ChannelLink");
          if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
          let channel = await channelInfo(ChannelLink);
          if (!channel) return rej("NO CHANNEL INFORMATION FOUND")
          let content = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`);
          content = content.items.map(v => {
              var OBJ = {}
              OBJ.title = v.title
              OBJ.link = v.link
              OBJ.pubDate = v.pubDate
              OBJ.author = v.author
              OBJ.id = v.link.split("watch?v=")[1] || v.id,
                  OBJ.isoDate = v.isoDate
              return OBJ;
          })
          let tLastVideos = content.sort((a, b) => {
              let aPubDate = new Date(a.pubDate || 0).getTime();
              let bPubDate = new Date(b?.pubDate || 0).getTime();
              return bPubDate - aPubDate;
          });
          if (tLastVideos.length == 0) return rej("No Videos posted yet")
          return res(tLastVideos);
      } catch (error) {
          return rej(error);
      }
  })
}
module.exports.getLatestVideos = getLatestVideos;
"use strict";
const merge2Obj = (one, two) => {
    for (const key in two) {
        if (Object.prototype.hasOwnProperty.call(two, key)) {
            const ele = two[key];
            if (typeof ele === "object")
                one[key] = merge2Obj(one[key], ele);
            else
                one[key] = ele;
        }
    }
    return one;
};
const mergeObj = (res, ...objs) => {
    objs.forEach((obj) => merge2Obj(res, obj));
    return res;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new(P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {
        "default": mod
    };
};
const axios_1 = __importDefault(require("axios"));
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.channelInfo = void 0;
/**
 * Get full information about a YouTube channel
 */
const channelInfo = (url, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33;
    if (typeof url !== "string")
        throw new Error(`Expected "url" to be "string" but received "${typeof url}".`);
    if (typeof options !== "object")
        throw new Error(`Expected "options" to be "object" but received "${typeof options}".`);
    options = mergeObj({
        requestOptions: {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
            },
        },
    }, options);
    if (!url.startsWith("http"))
        url = `https://www.youtube.com/channel/${url}`;
    let res;
    try {
        res = (yield axios_1.default.get(url, Object.assign(Object.assign({}, options.requestOptions), {
            responseType: "GUILD_TEXT"
        }))).data;
    } catch (err) {
        throw new Error(`Failed to fetch site. (${err})`);
    }
    let initialData;
    try {
        initialData = JSON.parse((_a = res.split("var ytInitialData = ")[1]) === null || _a === void 0 ? void 0 : _a.split(";</script>")[0]);
    } catch (err) {
        throw new Error(`Failed to parse data from script tag. (${err})`);
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
    
    const channel = {
        name: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.title : undefined,
        id: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.externalId : undefined,
        url: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.channelUrl : undefined,
        rssUrl: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.rssUrl : undefined,
        description: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.description : undefined,
        subscribers: initialData &&
            initialData.header &&
            initialData.header.c4TabbedHeaderRenderer &&
            initialData.header.c4TabbedHeaderRenderer.subscriberCountText ?
            initialData.header.c4TabbedHeaderRenderer.subscriberCountText.simpleText : undefined,
        banner: initialData &&
            initialData.header &&
            initialData.header.c4TabbedHeaderRenderer &&
            initialData.header.c4TabbedHeaderRenderer.banner &&
            initialData.header.c4TabbedHeaderRenderer.banner.thumbnails ?
            initialData.header.c4TabbedHeaderRenderer.banner.thumbnails.sort((a, b) => b?.width - a.width) : undefined,
        tvBanner: initialData &&
            initialData.header &&
            initialData.header.c4TabbedHeaderRenderer &&
            initialData.header.c4TabbedHeaderRenderer.tvBanner &&
            initialData.header.c4TabbedHeaderRenderer.tvBanner.thumbnails ?
            initialData.header.c4TabbedHeaderRenderer.tvBanner.thumbnails.sort((a, b) => b?.width - a.width) : undefined,
        mobileBanner: initialData &&
            initialData.header &&
            initialData.header.c4TabbedHeaderRenderer &&
            initialData.header.c4TabbedHeaderRenderer.mobileBanner &&
            initialData.header.c4TabbedHeaderRenderer.mobileBanner.thumbnails ?
            initialData.header.c4TabbedHeaderRenderer.mobileBanner.thumbnails.sort((a, b) => b?.width - a.width) : undefined,
        tags: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.keywords.split(" ") : undefined,
        videos: ["USE THE FUNCTION: YTP.getLatestVideos(youtubeChannel)"],
        unlisted: initialData &&
            initialData.microformat &&
            initialData.microformat.microformatDataRenderer ?
            initialData.microformat.microformatDataRenderer.unlisted : undefined,
        familySafe: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.isFamilySafe : undefined,
    };
    return channel;
});
module.exports.channelInfo = channelInfo;


