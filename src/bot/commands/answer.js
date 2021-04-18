const answerModel = require('../models/answerModel.js');
const questionModel = require('../models/questionModel.js');
const config = require('../../const/config.js');
const fct = require('../../util/fct.js');
const userModel = require('../models/userModel.js');
const errorMsgs = require('../../const/errorMsgs.js');
const embeds = require('../util/embeds.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      const filterMsg = response => { return response.author.id == msg.author.id };
      const filterEmoji = (reaction, user) => {
        return reaction.emoji.name === '👍' && user.id === msg.author.id;
      };

      const myUser = await userModel.getByDiscordUser(msg.author);
      let question;
      let res = await questionModel.getQuestionToAnswer(myUser.id);

      if (res.error)
        return resolve(await msg.channel.send(embeds.genericSmall(errorMsgs.get(res.error).replace('<prefix>',msg.guild.appData.prefix))));
      else
        question = res.results;

      if (!question) {
        await msg.channel.send(embeds.genericSmall('Sorry, there are no more open questions right now. Please try again later!'));
        return resolve();
      }

      await msg.channel.send(embeds.answerPresentEmbed(msg.client,question));

      let answerText = await msg.channel.awaitMessages(filterMsg, { max: 1, time: config.answerTimeFrameS * 1000, errors: ['time'] }).catch(c => {});

      if (!answerText) {
        await msg.channel.send(embeds.genericSmall('Timeout.'));
        return resolve();
      }

      answerText = answerText.first().content;
      if (!answerText || answerText == '' || answerText.startsWith(msg.guild.appData.prefix)) {
        //await msg.channel.send('Abort (new command detected).');
        return resolve();
      }

      const message = await msg.channel.send(embeds.answerEmbed(msg.client,question,answerText));
      await message.react('👍');

      const collected = await message.awaitReactions(filterEmoji, { max: 1, time: config.answerTimeFrameS * 1000, errors: ['time'] }).catch(c => {});

      if (!collected) {
        await msg.channel.send(embeds.genericSmall('Timeout.'));
        return resolve();
      }

      res = await answerModel.create(question.id,myUser.id,answerText);

      if (res.error)
        return resolve(await msg.channel.send(embeds.genericSmall(errorMsgs.get(res.error).replace('<prefix>',msg.guild.appData.prefix))));
      else
        await message.edit(embeds.answerSentEmbed(msg.client,question,answerText));

    } catch (e) { return reject(e); }

    resolve();
  });
}
