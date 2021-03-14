const questionModel = require('../models/questionModel.js');
const userModel = require('../models/userModel.js');
const fct = require('../../util/fct.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      let answerCount = 1, message;
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
      message = await msg.channel.send('Do you wish to ask your question to the Oracle? \n ``' + question + '``\nThis will cost you ' + msg.client.appData.settings.pricePerAnswer + ' favors for ' + answerCount + ' answer' + ((answerCount == 1) ? '' : 's') + '.');
      message.react('👍');

      const collected = await message.awaitReactions(filter, { max: 1, time: 180000, errors: ['time'] }).catch(c => {});

      if (!collected)
        return resolve();

      const myUser = await userModel.storage.get(msg.author);
      if (fct.isBanned(myUser)) {
        await msg.channel.send('You are still banned and need to wait until you can use this bot again.');
        return resolve();
      }

      const price = answerCount * msg.client.appData.settings.pricePerAnswer;
      if (myUser.credits < price) {
        await msg.channel.send('Not enough favors left. Use the ``'+msg.guild.appData.prefix+'!`` command to gain more favors by answering the Oracles questions.');
        return resolve();
      }
      console.log(question);
      const res = await questionModel.create('discord',msg.channel.id,myUser.id,question,answerCount);

      await msg.channel.send('Your question has been sent to the Oracle!');
    } catch (e) { return reject(e); }

    resolve();
  });
}
