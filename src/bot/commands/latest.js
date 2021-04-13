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
      const page = fct.extractPage(args,config.entriesPerPage);

      const questions = await questionModel.getLatest(page.from,page.to);

      const embed = new Discord.MessageEmbed()
          .setTitle('')
          .setAuthor('Latest Questions', '')
          .setColor(config.embedColor)
          .setThumbnail(msg.author.iconURL)
          .setFooter(msg.client.appData.settings.footer);

      let recentQuestionsString = '';
      if (questions.length == 0)
        recentQuestionsString = 'No questions to show here.';
      else
        for (let question of questions)
          recentQuestionsString += '``' + new Date(question.addDate * 1000).toLocaleString().split(',')[0] + ' [' + question.id + '] ' + nameUtil.cutName(question.text,100) + '``' + '\n';

      embed.addField('Page ' + page.page + '', recentQuestionsString + '\n');

      await msg.channel.send(embed);
      resolve();
    } catch (e) { reject(e); }
    resolve();
  });
}
