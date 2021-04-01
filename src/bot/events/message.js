const discord_guildModel = require('../models/discord_guildModel.js');
const handleCommand = require('./handleCommand.js');
const fct = require('../../util/fct.js');
const skip = require('../skip.js');

module.exports = (msg) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (msg.author.bot == true || !msg.guild)
        return resolve();
      if (skip(msg.guild.id))
        return resolve();

      if (msg.channel.type == 'dm' || !msg.guild) {
          msg.channel.send('Hi. Please use your commands inside ' +
              'the channel of a server i am in.\n Thanks!');

      } else if (msg.channel.type == 'text' && msg.type == 'DEFAULT' && msg.system == false) {
        await discord_guildModel.cache.load(msg.guild);

        if (msg.content.startsWith(msg.guild.appData.prefix))
          await handleCommand(msg);
        else if (msg.mentions.members.first() && msg.mentions.members.first().id == msg.client.user.id)
          await msg.channel.send('Hey, thanks for mentioning me! The prefix for the bot on this server is ``'+msg.guild.appData.prefix+'``. Type ``'+msg.guild.appData.prefix+'help`` for more information. Have fun!');
      }

      resolve();
    } catch (e) { reject(e); }
  });
}
