const answerModel = require('../models/answerModel.js');
const questionModel = require('../models/questionModel.js');
const config = require('../../const/config.js');
const fct = require('../../util/fct.js');
const discord_userModel = require('../models/discord_userModel.js');
const errorMsgs = require('../../const/errorMsgs.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      const filterMsg = response => { return response.author.id == msg.author.id };
      const filterEmoji = (reaction, user) => {
        return reaction.emoji.name === '👍' && user.id === msg.author.id;
      };

      const myDiscord_user = await discord_userModel.get(msg.author);
      let question;
      let res = await questionModel.getQuestionToAnswer(myDiscord_user.userId);

      if (res.error)
        return resolve(await msg.channel.send(errorMsgs.get(res.error).replace('<prefix>',msg.guild.appData.prefix)));
      else
        question = res.results;

      if (!question) {
        msg.channel.send('Sorry, there are no more open questions right now. Please try again later!');
        return resolve();
      }

      await msg.channel.send('Please answer the following question: ``' + question.text + '``');
      let answer = await msg.channel.awaitMessages(filterMsg, { max: 1, time: 8000, errors: ['time'] }).catch(c => {});

      if (!answer) {
        await msg.channel.send('Timeout.');
        return resolve();
      }

      answer = answer.first().content;
      if (!answer || answer == '' || answer.startsWith(msg.guild.appData.prefix)) {
        //await msg.channel.send('Abort (new command detected).');
        return resolve();
      }

      const message = await msg.channel.send('Do you wish to send your answer? \n ``' + answer + '``\n This will grant you ' + msg.client.appData.settings.rewardPerAnswer + ' favor. Please verify by reacting with a 👍.');
      await message.react('👍');

      const collected = await message.awaitReactions(filterEmoji, { max: 1, time: 180000, errors: ['time'] }).catch(c => {});

      if (!collected) {
        await msg.channel.send('Timeout.');
        return resolve();
      }

      res = await answerModel.create(question.id,myDiscord_user.userId,answer);

      if (res.error)
        return resolve(await msg.channel.send(errorMsgs.get(res.error).replace('<prefix>',msg.guild.appData.prefix)));
      else
        await msg.channel.send('Your answer has been sent to the Oracle!');

    } catch (e) { return reject(e); }

    resolve();
  });
}
