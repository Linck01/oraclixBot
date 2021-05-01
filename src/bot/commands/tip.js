const questionModel = require('../models/questionModel.js');
const userModel = require('../models/userModel.js');
const answerModel = require('../models/answerModel.js');
const reportModel = require('../models/reportModel.js');
const fct = require('../../util/fct.js');
const errorMsgs = require('../../const/errorMsgs.js');
const embeds = require('../util/embeds.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      const filterEmoji = (reaction, user) => {
        return reaction.emoji.name === '👍' && user.id === msg.author.id;
      };

      if (args.length < 2) {
        await msg.channel.send(embeds.genericSmall(errorMsgs.get('tooFewArguments').replace('<prefix>',msg.guild.appData.prefix)));
        return resolve();
      }

      const answerId = args[0];
      const amount = args[1];

      if (isNaN(answerId) || isNaN(amount)) {
        await msg.channel.send(embeds.genericSmall('Amount of favor and the answer\'s id have to be digits. Type ``'+msg.guild.appData.prefix+'help`` for more information'));
        return resolve();
      }

      if (amount < 1 || amount > 50) {
        await msg.channel.send(embeds.genericSmall(errorMsgs.get('tipAmountWrong').replace('<prefix>',msg.guild.appData.prefix)));
        return resolve();
      }

      const message = await msg.channel.send(embeds.genericSmall('Do you wish to tip ' + amount + ' to the author of answer ' + answerId + '. Please verify by reacting with a 👍.'));
      await message.react('👍');

      const collected = await message.awaitReactions(filterEmoji, { max: 1, time: 180000, errors: ['time'] }).catch(c => {});

      if (!collected) {
        await msg.channel.send(embeds.genericSmall('Timeout.'));
        return resolve();
      }

      const myUser = await userModel.getByDiscordUser(msg.author);
      const res = await userModel.tip(myUser.id,answerId,amount);

      if (res.error)
        return resolve(await msg.channel.send(embeds.genericSmall(errorMsgs.get(res.error).replace('<prefix>',msg.guild.appData.prefix))));
      else
        await message.edit(embeds.genericSmall('Tip sent!'));

    } catch (e) { reject(e); }
    resolve();
  });
}
