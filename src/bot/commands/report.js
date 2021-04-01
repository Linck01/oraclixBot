const questionModel = require('../models/questionModel.js');
const discord_userModel = require('../models/discord_userModel.js');
const answerModel = require('../models/answerModel.js');
const reportModel = require('../models/reportModel.js');
const fct = require('../../util/fct.js');
const errorMsgs = require('../../const/errorMsgs.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (args.length < 2) {
        await msg.channel.send(errorMsgs.get('tooFewArguments').replace('<prefix>',msg.guild.appData.prefix));
        return resolve();
      }

      const type = args[0].toLowerCase();
      if (type != 'question' && type != 'answer') {
        await msg.channel.send('The first argument has to be either ``question`` or ``answer`` depending on what you want to report. Type ``'+msg.guild.appData.prefix+'help`` for more information');
        return resolve();
      }

      const typeId = args[1];

      if (isNaN(typeId)) {
        await msg.channel.send('The second argument has to be the question\'s or answer\'s id. Type ``'+msg.guild.appData.prefix+'help`` for more information');
        return resolve();
      }

      let obj;
      if (type == 'question')
        obj = await questionModel.get(typeId);
      else if (type == 'answer')
        obj = await answerModel.get(typeId);

      if (!obj) {
        await msg.channel.send('Could not find ' + type + ' with id ``' + typeId + '``.');
        return resolve();
      }

      const myDiscord_user = await discord_userModel.storage.get(msg.author);
      const res = await reportModel.create(type,typeId,myDiscord_user.userId);

      if (res.error)
        return resolve(await msg.channel.send(errorMsgs.get(res.error).replace('<prefix>',msg.guild.appData.prefix)));
      else
        await msg.channel.send('Report sent!');

    } catch (e) { reject(e); }
    resolve();
  });
}
