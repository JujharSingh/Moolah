const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const cash = require('./cashdb.json');
const random = require("random-js")();
const math = require('mathjs');
const Enigma = module.require('./enigma/enigma.js');
const e = new Enigma
const async = require("async");
var timeout = require('async-timeout');
var prefix = config.prefix

function update() {
    fs.writeFile('./cashdb.json', JSON.stringify(cash, null, 2), function (err) {
        if (err) return console.log(err);
    });
}
function prettynumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

client.on('ready', () => {
    client.user.setGame(">help | "+client.guilds.entries().length+" Guilds")
    console.log(client.guilds.entries())
    console.log(config.name+" bot ready for service!")
})

client.on('message', (message) => {
    if(message.author.bot == true) return;
    msgarray = message.content.split(" ");
    if(msgarray[0].toLowerCase() == prefix+"help" || msgarray[0].toLowerCase() == prefix+"moolahhelp") {
        message.channel.send("`Sent DM with help!`")
        message.author.send({
            embed: {
                color: 3447003,
                title: "Help",
                fields: [
                    {
                        name: "Moderation",
                        value: prefix+"clear [N] - `Bulk deletes messages`ᅠᅠ",
                        inline: true
                    },
                    {
                        name: "Cash",
                        value: prefix+"cash = `Check your balance`\n"+prefix+"over50 [N] - `Bet away your money!`\n"+prefix+"over20 [N] - `Bet away your money!`\n"+prefix+"100 [N] - `Really wanna throw your money?`\n"+prefix+"givecash - `Feel generous? give away your money!`",
                        inline: true
                    },
                    {
                        name: "Fun/Misc",
                        value: prefix+"enigma [M] - `Encode and decode like the Nazis did!`",
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
            cash[message.author.id] = 1000
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
            message.channel.bulkDelete(+msgarray[1]+2)
        }
    }
    if(msgarray[0].toLowerCase() == prefix+"over50") {
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
                resultmoney = math.eval(cash[message.author.id]+" + "+earnings).toString()
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
                resultmoney = math.eval(cash[message.author.id]+" - "+money)
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
                resultmoney = math.eval(cash[message.author.id]+" - "+money)
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
                resultmoney = math.eval(cash[message.author.id]+" - "+money)
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
    if(msgarray[0].toLowerCase() == prefix+"givecash") {
        if (!message.mentions.users.first()) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "syntax error!",
                    description: "`"+prefix+"givecash [AMOUNT] [MENTION]`"
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
                    description: "`"+prefix+"givecash [AMOUNT] [MENTION]`"
                }
            })
        }else {
            if(!cash[message.mentions.users.first().id]) {
                cash[message.mentions.users.first().id] = 1000
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

client.on('guildCreate', () => {
    client.user.setGame(">help | "+client.guilds.array().length+" Guilds")
})

client.on('guildDelete', () => {
    client.user.setGame(">help | "+client.guilds.array().length+" Guilds")
})

client.login(config.token)