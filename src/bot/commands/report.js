const guildModel = require('../models/guild/guildModel.js');
const questionModel = require('../models/questionModel.js');
const answerModel = require('../models/answerModel.js');
const reportModel = require('../models/reportModel.js');
const fct = require('../../util/fct.js');
const errorMsgs = require('../../const/errorMsgs.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (args.length < 2) {
        await msg.channel.send(errorMsgs.tooFewArguments.replace('<prefix>',msg.guild.appData.prefix));
        return resolve();
      }

      const type = args[0].toLowerCase();
      if (type != 'question' && type != 'answer') {
        await msg.channel.send('The first argument has to be either ``question`` or ``answer`` depending on what you want to report. Type ``'+msg.guild.appData.prefix+'help`` for more information');
        return resolve();
      }

      const typeId = args[1];

      if (isNaN(typeId)) {
        await msg.channel.send('The second argument has to be the question\'s or answer\'s id. Type ``'+msg.guild.appData.prefix+'help`` for more information');
        return resolve();
      }

      let obj;
      if (type == 'question')
        obj = await questionModel.get(typeId);
      else if (type == 'answer')
        obj = await answerModel.get(typeId);

      if (!obj) {
        await msg.channel.send('Could not find ' + type + ' with id ``' + typeId + '``.');
        return resolve();
      }

      const myUser = await userModel.storage.get(msg.author);
      const res = await reportModel.create(type,typeId,myUser.userId);

      if (res.error)
        return resolve(await msg.channel.send(errorMsgs.get(res.error).replace('<prefix>',msg.guild.appData.prefix)));
      else
        await msg.channel.send('Report sent!');

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

      await guildModel.storage.set(msg.guild,'prefix',value);
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

      await guildModel.storage.set(msg.guild,'entriesPerPage',value);
      await msg.channel.send('Setting updated.');
      resolve();
    } catch (e) { reject(e); }
  });
}

function showNicknames(msg,value) {
  return new Promise(async function (resolve, reject) {
    try {
      const myGuild = await guildModel.storage.get(msg.guild);

      if (myGuild.showNicknames) {
        await guildModel.storage.set(msg.guild,'showNicknames',0);
        await msg.channel.send('Users *usernames* will show on all embeds and messages.');
      } else {
        await guildModel.storage.set(msg.guild,'showNicknames',1);
        await msg.channel.send('Users *nicknames* will show on all embeds and messages.');
      }
      resolve();
    } catch (e) { reject(e); }
  });
}
