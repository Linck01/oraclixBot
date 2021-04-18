const questionModel = require('../models/questionModel.js');
const userModel = require('../models/userModel.js');
const answerModel = require('../models/answerModel.js');
const reportModel = require('../models/reportModel.js');
const fct = require('../../util/fct.js');
const errorMsgs = require('../../const/errorMsgs.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (args.length < 3) {
        await msg.channel.send(embeds.genericSmall(errorMsgs.get('tooFewArguments').replace('<prefix>',msg.guild.appData.prefix)));
        return resolve();
      }

      const type = args[0].toLowerCase();
      if (type != 'question' && type != 'answer') {
        await msg.channel.send(embeds.genericSmall('The first argument has to be either ``question`` or ``answer`` depending on what you want to report. Type ``'+msg.guild.appData.prefix+'help`` for more information'));
        return resolve();
      }

      const typeId = args[1];

      if (isNaN(typeId)) {
        await msg.channel.send(embeds.genericSmall('The second argument has to be the question\'s or answer\'s id. Type ``'+msg.guild.appData.prefix+'help`` for more information'));
        return resolve();
      }

      const reason = args[2];

      if (reason != 'atos' && reason != 'unrelated') {
        await msg.channel.send(embeds.genericSmall(errorMsgs.get('invalidReportReason').replace('<prefix>',msg.guild.appData.prefix)));
        return resolve();
      }

      let obj;
      if (type == 'question')
        obj = await questionModel.get(typeId);
      else if (type == 'answer')
        obj = await answerModel.get(typeId);

      if (!obj) {
        await msg.channel.send(embeds.genericSmall('Could not find ' + type + ' with id ``' + typeId + '``.'));
        return resolve();
      }

      const myUser = await userModel.getByDiscordUser(msg.author);
      const res = await reportModel.create(type,typeId,myUser.id,reason);

      if (res.error)
        return resolve(await msg.channel.send(embeds.genericSmall(errorMsgs.get(res.error).replace('<prefix>',msg.guild.appData.prefix))));
      else
        await msg.channel.send(embeds.genericSmall('Report sent!'));

    } catch (e) { reject(e); }
    resolve();
  });
}
