const discord_guildModel = require('../models/discord_guildModel.js');
const fct = require('../../util/fct.js');

module.exports = (guild) => {
  return new Promise(async function (resolve, reject) {
    try {
      await discord_guildModel.cache.load(guild);
      //await guildModel.storage.set(guild,'createDate',new Date() / 1000);

      resolve();
    } catch (e) { reject(e); }
  });
}
