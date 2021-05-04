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
      if (args.length < 1) {
        await msg.channel.send(embeds.genericSmall('Please provide the question\'s id. Type ``'+msg.guild.appData.prefix+'help`` for more information'));
        return resolve();
      }

      const questionId = args[0];

      if (isNaN(questionId)) {
        await msg.channel.send(embeds.genericSmall('The question\'s id has to be a digit. Type ``'+msg.guild.appData.prefix+'help`` for more information'));
        return resolve();
      }

      const question = await questionModel.get(questionId);

      if (!question) {
        await msg.channel.send(embeds.genericSmall('The question with this id cannot be found. Type ``'+msg.guild.appData.prefix+'help`` for more information'));
        return resolve();
      }

      const answers = await answerModel.getByQuestionId(questionId);

      await msg.channel.send(embeds.questionEmbed(msg.guild.client,question,answers));

    } catch (e) { reject(e); }
    resolve();
  });
}
