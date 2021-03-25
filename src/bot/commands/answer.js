const answerModel = require('../models/answerModel.js');
const questionModel = require('../models/questionModel.js');
const config = require('../../const/config.js');
const fct = require('../../util/fct.js');
const userModel = require('../models/userModel.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      const filterMsg = response => { return response.author.id == msg.author.id };
      const filterEmoji = (reaction, user) => {
        return reaction.emoji.name === '👍' && user.id === msg.author.id;
      };

      const myUser = await userModel.storage.get(msg.author);
      if (fct.isBanned(myUser)) {
        await msg.channel.send('You are still banned and need to wait until you can use this bot again.');
        return resolve();
      }

      question = await questionModel.getQuestionToAnswer(myUser.id);

      if (!question) {
        msg.channel.send('Sorry, there are no more questions of this kind to the universe right now. Please try again later!');
        return resolve();
      }

      await msg.channel.send('The Oracle sends you the following question: ``' + question.text + '``');
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

      const message = await msg.channel.send('Do you wish to send your answer to Oraclix? \n ``' + answer + '``\n This will grant you ' + msg.client.appData.settings.rewardPerAnswer + ' favor.');
      await message.react('👍');

      const collected = await message.awaitReactions(filterEmoji, { max: 1, time: 180000, errors: ['time'] }).catch(c => {});

      if (!collected) {
        await msg.channel.send('Timeout.');
        return resolve();
      }

      await answerModel.create(question.id,myUser.id,answer);
      await msg.channel.send('Your answer has been submitted.');
    } catch (e) { return reject(e); }

    resolve();
  });
}
