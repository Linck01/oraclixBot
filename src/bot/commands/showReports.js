const errorMsgs = require('../../const/errorMsgs.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (msg.author.id != '370650814223482880') {
        await msg.channel.send('Only the owner of this bot can use this command.');
        return resolve();
      }

      console.log('Show reports');
      resolve();
    } catch (e) { reject(e); }
  });
}
