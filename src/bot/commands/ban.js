const errorMsgs = require('../../const/errorMsgs.js');
const userModel = require('../models/userModel.js');
const embeds = require('../util/embeds.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (msg.author.id != '370650814223482880') {
        await msg.channel.send(embeds.genericSmall('Only the owner of this bot can use this command.'));
        return resolve();
      }

      if (args.length < 2) {
        await msg.channel.send(embeds.genericSmall(errorMsgs.get('tooFewArguments').replace('<prefix>',msg.guild.appData.prefix)));
        return resolve();
      }
      const userId = args[0];
      const days = args[1];

      if (isNaN(userId) || isNaN(days)) {
        await msg.channel.send(embeds.genericSmall('Both arguments need to be numbers (userId and days).'));
        return resolve();
      }

      await userModel.set(userId,'banned',(Date.now() / 1000) + 60*60*24*days);

      await msg.channel.send('Successfully banned ' + userId + '.');
      resolve();
    } catch (e) { reject(e); }
  });
}
