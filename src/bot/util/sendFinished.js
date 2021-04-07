const db = require('../../models/db.js');
const questionModel = require('../models/questionModel.js');
const userModel = require('../models/userModel.js');
const getAnswerEmbed = require('./getAnswerEmbed.js')


module.exports.init = (client) => {
  return (questions) => {
    return new Promise(async function (resolve, reject) {
      try {
        if (questions.error)
          return reject(questions.error);

        let channel;
        for (let question of questions.results) {
          channel = client.channels.cache.get(question.sourceId);

          if (!channel || !channel.guild)
            continue;

          const myAuthor = await userModel.get(question.fromUserId);
          let author = channel.guild.members.cache.get(myAuthor.sourceId);
          if (!author)
            author = await channel.guild.members.fetch(myAuthor.sourceId);
          const ping = '<@' + myAuthor.sourceId + '>';

          await questionModel.set(question.id,'sent',1);
          await channel.send(ping + ' your Question has been answered!',getAnswerEmbed(question,question.answers));
          console.log('Successfully answered question ' + question.id + ' in guild ' + channel.guild.name + ' (' + question.answers.length + ' answers).');
        }

        resolve();
      } catch (e) { reject(e); }
    });
  }
}
