const discord_guildModel = require('../models/discord_guildModel.js');
const fct = require('../../util/fct.js');
const errorMsgs = require('../../const/errorMsgs.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (!msg.member.hasPermission("MANAGE_GUILD")) {
        await msg.channel.send('You need the permission to manage the server, in order to use this command.');
        return resolve();
      }
      if (args.length < 1) {
        await msg.channel.send(errorMsgs.tooFewArguments.replace('<prefix>',msg.guild.appData.prefix));
        return resolve();
      }

      let field = args[0].toLowerCase();
      const value = args.slice(1,args.length+1).join(' ');

      // SET - BASIC
      if (field == 'votetag')
        await votetag(msg,value);
      else if (field == 'voteemote')
        await voteemote(msg,value);
      else if (field == 'bonustag')
        await bonustag(msg,value);
      else if (field == 'bonusemote')
        await bonusemote(msg,value);
      else if (field == 'prefix')
        await prefix(msg,value);
      else {
        await msg.channel.send('Invalid argument. Type ``'+msg.guild.appData.prefix+'help`` for more information');
        return resolve();
      }
    } catch (e) { reject(e); }
    resolve();
  });
}


function prefix(msg,value) {
  return new Promise(async function (resolve, reject) {
    try {
      if (value.length < 1 || value.length > 32) {
        await msg.channel.send('Please use 1 to 32 characters as prefix.');
        return resolve();
      }

      await discord_guildModel.storage.set(msg.guild,'prefix',value);
      await msg.channel.send('Setting updated.');
      resolve();
    } catch (e) { reject(e); }
  });
}

function entriesperpage(msg,value) {
  return new Promise(async function (resolve, reject) {
    try {
      if (isNaN(value) || value < 4 || value > 20) {
        await msg.channel.send('The entriesperpage needs to be a value within 4 and 20.');
        return resolve();
      }

      await discord_guildModel.storage.set(msg.guild,'entriesPerPage',value);
      await msg.channel.send('Setting updated.');
      resolve();
    } catch (e) { reject(e); }
  });
}

function showNicknames(msg,value) {
  return new Promise(async function (resolve, reject) {
    try {
      const myGuild = await discord_guildModel.storage.get(msg.guild);

      if (myGuild.showNicknames) {
        await discord_guildModel.storage.set(msg.guild,'showNicknames',0);
        await msg.channel.send('Users *usernames* will show on all embeds and messages.');
      } else {
        await discord_guildModel.storage.set(msg.guild,'showNicknames',1);
        await msg.channel.send('Users *nicknames* will show on all embeds and messages.');
      }
      resolve();
    } catch (e) { reject(e); }
  });
}
