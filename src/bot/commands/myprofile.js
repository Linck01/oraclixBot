const Discord = require('discord.js');
const discord_guildModel = require('../models/discord_guildModel.js');
const userModel = require('../models/userModel.js');
const questionModel = require('../models/questionModel.js');
const fct = require('../../util/fct.js');
const nameUtil = require('../util/nameUtil.js');
const errorMsgs = require('../../const/errorMsgs.js');
const config = require('../../const/config.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      let subcommand;
      if (args.length != 0)
        subcommand = args[0].toLowerCase();

      if (args.length == 0)
        await info(msg);
      else {
        await msg.channel.send(embeds.genericSmall(errorMsgs.get('invalidSubcommand').replace('<prefix>',msg.guild.appData.prefix)));
        return resolve();
      }
    } catch (e) { reject(e); }
    resolve();
  });
}

function info(msg) {
  return new Promise(async function (resolve, reject) {
    try {
      const myUser = await userModel.getByDiscordUser(msg.author);
      const questions = await questionModel.getByUserId(myUser.id);

      const embed = new Discord.MessageEmbed()
          .setTitle('')
          .setAuthor('Info for user ' + nameUtil.getGuildMemberAlias(msg.member), '')
          .setColor(config.embedColor)
          .setThumbnail(msg.author.iconURL)
          .setFooter(msg.client.appData.settings.news);

      embed.addField('**Favors**', myUser.credits);
      embed.addField('Active since', new Date(myUser.addDate * 1000).toLocaleString().split(',')[0] + '\n');
      embed.addField('Questions asked', questions.length);

      let recentQuestionsString = '';
      if (questions.length == 0)
        recentQuestionsString = 'No questions asked yet.';
      else
        for (let question of questions.slice(0,4))
          recentQuestionsString += '``' + new Date(myUser.addDate * 1000).toLocaleString().split(',')[0] + ' [' + question.id + '] ' + nameUtil.cutName(question.text) + '``' + '\n';

      embed.addField('Recent questions', recentQuestionsString + '\n');

      await msg.channel.send(embed);
      resolve();
    } catch (e) { reject(e); }
  });
}
