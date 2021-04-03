const questionModel = require('../models/questionModel.js');
const userModel = require('../models/userModel.js');
const fct = require('../../util/fct.js');
const errorMsgs = require('../../const/errorMsgs.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      let answerCount = 1;
      const filter = (reaction, user) => {
        return reaction.emoji.name === '👍' && user.id === msg.author.id;
      };

      if (!isNaN(args[0])) {
        if (+args[0] < 1 || +args[0] > 5) {
          await msg.channel.send('You can only request one to five answers at the same time!');
          return resolve();
        } else
          answerCount = +args.splice(0,1);
      }

      const question = args.slice(0,args.length+1).join(' ');

      if (question.trim() == '') {
        await msg.channel.send('Please enter a question after the command.');
        return resolve();
      }

      const message = await msg.channel.send('Do you wish to send your question to the Oracle? \n ``' + question + '``\nThis will cost you ' + answerCount + ' favors for ' + answerCount + ' answer' + ((answerCount == 1) ? '' : 's') + '. Please verify by reacting with a 👍.');
      message.react('👍');

      const collected = await message.awaitReactions(filter, { max: 1, time: 180000, errors: ['time'] }).catch(c => {});

      if (!collected)
        return resolve();

      const myUser = await userModel.getByDiscordUser(msg.author);
      const res = await questionModel.create(msg.channel.id,myUser.id,question,answerCount);

      if (res.error)
        return resolve(await msg.channel.send(errorMsgs.get(res.error).replace('<prefix>',msg.guild.appData.prefix)));
      else
        await msg.channel.send('Your question has been sent to the Oracle!');

    } catch (e) { return reject(e); }

    return resolve();
  });
}

/*
if (fct.isBanned(myUser)) {
  await msg.channel.send('You are still banned and need to wait until you can use this bot again.');
  return resolve();
}

const price = answerCount; // * msg.client.appData.settings.pricePerAnswer;
if (myUser.credits < price) {
  await msg.channel.send('Not enough favors left. Use the ``'+msg.guild.appData.prefix+'!`` command to gain more favors by answering the Oracles questions.');
  return resolve();
}*/
