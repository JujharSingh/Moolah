const Discord = require("discord.js");
const request = require('request');
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const cash = require('./cashdb.json');
const autorole = require('./autoroledb.json');
const random = require("random-js")();
const math = require('mathjs');
const Enigma = module.require('./enigma/enigma.js');
const e = new Enigma
const async = require("async");
var timeout = require('async-timeout');
var opus = require('node-opus');
const ffmpeg = require('ffmpeg');
const ytdl = require('ytdl-core');
var prefix = config.prefix

'use strict';
process.stdout.write('\x1Bc');

function update() {
    fs.writeFile('./cashdb.json', JSON.stringify(cash, null, 2), function (err) {
        if (err) return console.log(err);
    });
}
function aroleupdate() {
    fs.writeFile('./autoroledb.json', JSON.stringify(autorole, null, 2), function (err) {
        if (err) return console.log(err);
    });
}

function prettynumber(x) {
    if(!x) {return}
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

client.on('ready', () => {
    client.user.setGame(">help | "+client.guilds.array().length+" Guilds")
    fs.writeFile("./guilds.txt", client.guilds.array(), (error) => {if(error) {console.log(error)}})
    console.log(config.name+" bot ready for service!")
})

client.on('message', (message) => {
    if(message.author.bot == true) return;
    if(message.guild.id == "312353887451348992" && message.channel.id != 312891842767355905 && message.channel.type != "dm") return;
    msgarray = message.content.split(" ");
    if(message.content.startsWith(">")) {console.log(message.content+" called from "+message.guild.name+" by "+message.author.username+" - "+new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))}
    if(message.content.toLowerCase().startsWith(prefix+"calc")) {
        message.channel.send("`"+math.eval(message.content.substring(5))+"`")
    }
    if(message.content.toLowerCase().startsWith("ayy")) {
        async.parallel(message.react("🇱").then(() => {message.react("🇲").then(() => {message.react("🇦").then(() => {message.react("🇴")})})}))
    }
    if(message.content.toLowerCase().startsWith("xd")) {
        async.parallel(message.react("😂"))
    }
    if(msgarray[0].toLowerCase() == prefix+"") {

    }
    if(msgarray[0].toLowerCase() == prefix+"play" || msgarray[0].toLowerCase() == prefix+"moolahplay") {
        var vc = message.member.voiceChannel
        vc.leave()
        if(!vc) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`You need to be in a voice channel to use music commads!`"
                }
            })
        }else if(!msgarray[1]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`Please provide a YT link!`"
                }
            })
        }else if(msgarray[1].startsWith("https://www.youtube.com/") || msgarray[1].startsWith("http://www.youtube.com/")) {
            vc.join().then(VoiceConnection => {
                let stream = ytdl(msgarray[1], {filter: "audioonly"})
                const streaming = VoiceConnection.playStream(stream);
                client.on('message', (message) => {
                    if(message.author.bot == true) return;
                    if(message.content.toLowerCase().startsWith(prefix+"stop")) {vc.leave()}
                })
                streaming.on('end', () => {
                    vc.leave()
                })
            })
        }else {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`Currently only support yt links, no searching or other services`"
                }
            })
        }
    }
    if(msgarray[0].toLowerCase() == prefix+"cancer" || msgarray[0].toLowerCase() == prefix+"faggot") {
        if(message.guild.members.get("178678842196623361")) {
            message.channel.send("<@178678842196623361>")
        }else {
            message.channel.send("=-Fuzion-= Hoyyi#4879")
        }
    }
    if(msgarray[0].toLowerCase() == prefix+"spin") {
        message.channel.send("http://valetmag.com/gr/daily/personal_shopper/shop_talk/050917/art-lead.gif \nYour spinner spun for "+random.integer(1,360)+" seconds. well done!")
    }
    if(msgarray[0].toLowerCase() == prefix+"off") {
        if(message.author.id == "271737116214427650") {
            process.exit()
        }
    }
    if(msgarray[0].toLowerCase() == prefix+"autorole") {
        if(message.author.id != message.guild.owner.user.id) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`Guild maker only!!`"
                }
            })
        }else if(!message.mentions.roles.first()) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`please mention the role you would like to autorole, it is recommended to make the role unmentionable after this process`"
                }
            })
        }else {
            autorole[message.guild.id] = message.mentions.roles.first().id
            aroleupdate()
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "success!",
                    description: "`all new members will be autoroled to "+message.mentions.roles.first().name+"`"
                }
            })
        }
    }
    if(msgarray[0].toLowerCase() == prefix+"help" || msgarray[0].toLowerCase() == prefix+"moolahhelp") {
        message.channel.send("`Sent DM with help!`")
        message.author.send({
            embed: {
                color: 3447003,
                title: "Help",
                fields: [
                    {
                        name: "Moderation",
                        value: prefix+"clear [N] - `Bulk deletes messages`ᅠᅠ\n"+prefix+"mute [TIME] - `Make someone stfu for a period of time`",
                        inline: true
                    },
                    {
                        name: "Cash",
                        value: prefix+"cash = `Check your balance`\n"+prefix+"over50 [N] - `Bet away your money!`\n"+prefix+"over20 [N] - `Bet away your money!`\n"+prefix+"100 [N] - `Really wanna throw your money?`\n"+prefix+"sendcash - `Feel generous? give away your money!`",
                        inline: true
                    },
                    {
                        name: "Fun/Misc",
                        value: prefix+"enigma [M] - `Encode and decode like the Nazis did!`\nayy - `bot reacts with lmao (no prefix)`",
                        inline: true
                    },
                    {
                        name: "Music",
                        value: prefix+"play [URL] - `Play music from youtube!`",
                        inline: true
                    }
                ]
            }
        })
    }
    if(msgarray[0].toLowerCase() == prefix+"cash") {
        if(message.mentions.users.last()) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: message.mentions.users.last().username+"'s Balance",
                    description: "`$"+prettynumber(cash[message.mentions.users.last().id])+"`"
                }
            })
        }else if(!cash[message.author.id]) {
            cash[message.author.id] = "1000"
            update()
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "Alert!",
                    description: "I have opened a bank account for you with a free `$1,000`"
                }
            })
        }else {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "Balance",
                    description: "`$"+prettynumber(cash[message.author.id])+"`"
                }
            })
        }
    }
    if(msgarray[0].toLowerCase() == prefix+"clear") {
        if(!message.member.hasPermission("ADMINISTRATOR") || message.author.id != message.guild.owner.user.id || !message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`You need the 'ADMINISTRATOR' or the 'MANAGE_MESSAGES' permissions.`"
                }
            })
        }else if(msgarray[1].match(/^[0-9]+$/) == null) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "syntax error!",
                    description: "`"+prefix+"clear [MESSAGES [MAX: 98]]`"
                }
            })
        }else if(!msgarray[1]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`Please provide an amount of messages to clear`"
                }
            })
        }else {
            message.channel.send("Deleting Messages...")
            message.channel.bulkDelete(+msgarray[1]+2).catch((reason) => {message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`"+reason+"`"
                }
            })})
        }
    }
    if(msgarray[0].toLowerCase() == prefix+"over50") {
        if(!cash[message.author.id]) return message.send("`error: no cash! use >cash to get started!")
        if(!msgarray[1]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`Please provide an amount of cash to bet.`"
                }
            })
        }else if(+msgarray[1] > cash[message.author.id]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`You do not have enough cash! try betting a lower amount.`"
                }
            })
        }else {
            var roll = random.integer(1, 100)
            var money = +msgarray[1]
            if(roll > 50) {
                var earnings = money/2
                var resultmoney = math.eval(cash[message.author.id]+" + "+earnings).toString()
                cash[message.author.id] = resultmoney
                update()
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: "Over 50",
                        description: "Congratulations! You rolled `"+roll+"` and earned `"+prettynumber(earnings)+"`!"
                    }
                })
            }else {
                resultmoney = math.eval(cash[message.author.id]+" - "+money).toString()
                cash[message.author.id] = resultmoney
                update()
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: "Over 50",
                        description: "Better luck next time! You rolled `"+roll+"` and lost `"+prettynumber(money)+"`"
                    }
                })
            }
        }
    }
    if(msgarray[0].toLowerCase() == prefix+"over20") {
        if(!msgarray[1]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`Please provide an amount of cash to bet.`"
                }
            })
        }else if(+msgarray[1] > cash[message.author.id]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`You do not have enough cash! try betting a lower amount.`"
                }
            })
        }else {
            var roll = random.integer(1, 100)
            var money = +msgarray[1]
            if(roll > 20) {
                var earnings = money/4
                resultmoney = math.eval(cash[message.author.id]+" + "+earnings).toString()
                cash[message.author.id] = resultmoney
                update()
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: "Over 20",
                        description: "Congratulations! You rolled `"+roll+"` and earned `"+prettynumber(earnings)+"`!"
                    }
                })
            }else {
                resultmoney = +cash[message.author.id]-money
                resultmoney = math.eval(cash[message.author.id]+" - "+money).toString()
                cash[message.author.id] = resultmoney
                update()
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: "Over 20",
                        description: "Better luck next time! You rolled `"+roll+"` and lost `"+prettynumber(money)+"`"
                    }
                })
            }
        }
    }
    if(msgarray[0].toLowerCase() == prefix+"100") {
               if(!msgarray[1]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`Please provide an amount of cash to bet.`"
                }
            })
        }else if(+msgarray[1] > cash[message.author.id]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`You do not have enough cash! try betting a lower amount.`"
                }
            })
        }else {
            var roll = random.integer(1, 100)
            var money = +msgarray[1]
            if(roll === 100) {
                var earnings = money * 2
                resultmoney = math.eval(cash[message.author.id]+" + "+earnings).toString()
                cash[message.author.id] = resultmoney
                update()
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: "Exactly 100",
                        description: "Congratulations! You rolled `"+roll+"` and earned `"+prettynumber(earnings)+"`!"
                    }
                })
            }else {
                resultmoney = +cash[message.author.id]-money
                resultmoney = math.eval(cash[message.author.id]+" - "+money).toString()
                cash[message.author.id] = resultmoney
                update()
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: "Exactly 100",
                        description: "Better luck next time! You rolled `"+roll+"` and lost `"+prettynumber(money)+"`"
                    }
                })
            }
        } 
    }
    if(msgarray[0].toLowerCase() == prefix+"sendcash") {
        if (!message.mentions.users.first()) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "syntax error!",
                    description: "`"+prefix+"sendcash [AMOUNT] [MENTION]`"
                }
            })
        }else if(!msgarray[1]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`Please provide an amount of cash to send.`"
                }
            })
        }else if(+msgarray[1] > +cash[message.author.id]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`You do not have enough cash! try sending a lower amount.`"
                }
            })
        }else if(message.author.id == message.mentions.users.first().id) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`You cant send money to yourself!`"
                }
            })
        }else if(msgarray[1].match(/^[0-9]+$/) == null) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "syntax error!",
                    description: "`"+prefix+"sendcash [AMOUNT] [MENTION]`"
                }
            })
        }else {
            if(!cash[message.mentions.users.first().id]) {
                cash[message.mentions.users.first().id] = "1000"
                update()
            }
            var p1cash = +cash[message.author.id]
            var p2cash = +cash[message.mentions.users.first().id]
            cash[message.author.id] = math.eval(p1cash+" - "+msgarray[1]).toString()
            cash[message.mentions.users.first().id] = math.eval(p2cash+" + "+msgarray[1]).toString()
            update()
            //
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "success!",
                    description: message.author.username+" sent `"+msgarray[1]+"` to "+message.mentions.users.first().username
                }
            })
        }
    }
    if(msgarray[0].toLowerCase() == prefix+"enigma") {
        if(!msgarray[1]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`Please provide a message to encode/decode`"
                }
            })
        }else {
            message.channel.send(e.type(msgarray[1])) 
            e.reset('')
        }
    }
    if(msgarray[0].toLowerCase() == prefix+"mute") {
        if(!message.member.hasPermission("ADMINISTRATOR") || message.author.id != message.guild.owner.user.id || !message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`You need the 'ADMINISTRATOR' or the 'MANAGE_ROLES_OR_PERMISSIONS' permissions.`"
                }
            })
        }else if (!message.mentions.users.first()) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "syntax error!",
                    description: "`"+prefix+"mute [TIME (MIN)] [MENTION]`"
                }
            })
        }else if(msgarray[1].match(/^[0-9]+$/) == null) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "syntax error!",
                    description: "`"+prefix+"mute [TIME (MIN)] [MENTION]`"
                }
            })
        }else if(!msgarray[1]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "error!",
                    description: "`Please mention the user you want to mute.`"
                }
            })
        }else {
            var time = +msgarray[1] * 60000
            async.parallel([timeout(function noop(){message.channel.overwritePermissions(message.mentions.users.first(), {SEND_MESSAGES: false})}, time, null)], function(err, res) {message.channel.overwritePermissions(message.mentions.users.first(), {SEND_MESSAGES: true})});
        }
    }
})

client.on('guildCreate', (guild) => {
    guild.defaultChannel.send({
        embed: {
            color: 3447003,
            title: "Welcome to Moolah!",
            description: "Moolah is a bot with convenience and fun in mind!\nType `>help` to get started!"
        }
    })
    console.log(guild.name+" has added "+config.name+" to their guild")
    client.user.setGame(">help | "+client.guilds.array().length+" Guilds")
})

client.on('guildDelete', () => {
    client.user.setGame(">help | "+client.guilds.array().length+" Guilds")
})

client.on('guildMemberAdd', (member) => {
    if(autorole[member.guild.id]) {
        member.addRole(autorole[member.guild.id])
    }
})

client.login(config.token)