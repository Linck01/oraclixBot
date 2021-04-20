const questionModel = require('../models/questionModel.js');
const userModel = require('../models/userModel.js');
const fct = require('../../util/fct.js');
const errorMsgs = require('../../const/errorMsgs.js');
const embeds = require('../util/embeds.js');
const config = require('../../const/config.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      let answerCount = 1;
      const filter = (reaction, user) => {
        return reaction.emoji.name === '👍' && user.id === msg.author.id;
      };

      if (!isNaN(args[0])) {
        if (+args[0] < 1 || +args[0] > 5) {
          await msg.channel.send(embeds.genericSmall('You can only request one to five answers at the same time!'));
          return resolve();
        } else
          answerCount = +args.splice(0,1);
      }

      const questionText = args.slice(0,args.length+1).join(' ');

      if (questionText.trim() == '') {
        await msg.channel.send(embeds.genericSmall('Please enter a question after the command.'));
        return resolve();
      }

      const message = await msg.channel.send(embeds.askEmbed(msg.client,questionText,answerCount));
      message.react('👍');

      const collected = await message.awaitReactions(filter, { max: 1, time: config.answerTimeFrameS * 1000, errors: ['time'] }).catch(c => {});

      if (!collected)
        return resolve();

      const myUser = await userModel.getByDiscordUser(msg.author);
      const res = await questionModel.create(msg.channel.id,myUser.id,questionText,answerCount);

      if (res.error)
        return resolve(await msg.channel.send(embeds.genericSmall(errorMsgs.get(res.error).replace('<prefix>',msg.guild.appData.prefix))));
      else
        await message.edit(embeds.askSentEmbed(msg.client,res.results,answerCount));

    } catch (e) { return reject(e); }
    return resolve();
  });
}
