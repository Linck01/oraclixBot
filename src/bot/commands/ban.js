const errorMsgs = require('../../const/errorMsgs.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (msg.author.id != '370650814223482880') {
        await msg.channel.send('Only the owner of this bot can use this command.');
        return resolve();
      }

      if (args.length < 1) {
        await msg.channel.send(errorMsgs.tooFewArguments.replace('<prefix>',msg.guild.appData.prefix));
        return resolve();
      }
      const userId = args[0];

      console.log('ban');

      resolve();
    } catch (e) { reject(e); }
  });
}
