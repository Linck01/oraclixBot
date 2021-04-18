const Discord = require('discord.js');
const fct = require('../util/fct.js');
const cronScheduler = require('./cron/scheduler.js');
const utilModel = require('../models/utilModel.js');

const client = new Discord.Client(
  {ws: {intents:
  [ 'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'DIRECT_MESSAGES',
    'DIRECT_MESSAGE_REACTIONS'
  ]}}
);

process.env.UV_THREADPOOL_SIZE = 50;

const onMessage = require('./events/message.js');
const onGuildCreate = require('./events/guildCreate.js');
const onGuildDelete = require('./events/guildDelete.js');

start();

async function start() {
  try {
    await initClientCaches(client);
    initEventTriggers(client);

    await client.login();
  } catch (e) {
    console.log(e);
    await fct.waitAndReboot(3000);
  }
}

function initEventTriggers(client) {
  client.on('ready', async () => {
    try {
      console.log(`Logged in as ${client.user.tag}!`);

      client.user.setActivity('Crafting predictions..');

      await cronScheduler.start(client);

    } catch (e) { console.log(e); }
  });

  client.on('disconnect', (msg, code) => {
    if (code === 0)
      return console.log('client.onDisconnect: ',msg);

    client.connect();
  });

  client.on('error', (err) => {
    console.log('client.onError: ', err);
    //process.exit();
  });

  client.on('message', (msg) => {onMessage(msg).catch(e => console.log(e));});
  client.on('guildCreate', (guild) => {onGuildCreate(guild).catch(e => console.log(e));});
  client.on('guildDelete', (guild) => {onGuildDelete(guild).catch(e => console.log(e));});
}

function initClientCaches(client) {
  return new Promise(async function (resolve, reject) {
    try {
      client.appData = {};
      client.appData.botShardStat = { commands1h: 0, botInvites1h: 0, botKicks1h: 0};
      client.appData.settings = await utilModel.getSettings();
      client.appData.texts = await utilModel.getTexts();

      resolve();
    } catch (e) { console.log(e); }
  });
}

process.on('SIGINT', () => {
  console.info('SIGINT signal received in Shard.');
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received in Shard.');
});
