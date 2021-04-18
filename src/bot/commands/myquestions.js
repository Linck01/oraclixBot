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

      const myUser = await userModel.getByDiscordUser(msg.author);
      const questions = await questionModel.getByUserId(myUser.id);

      const embed = new Discord.MessageEmbed()
          .setTitle('')
          .setAuthor('Questions from user ' + nameUtil.getGuildMemberAlias(msg.member), '')
          .setColor(config.embedColor)
          .setThumbnail(msg.author.iconURL)
          .setFooter(msg.client.appData.settings.footer);

      pageQuestions = questions.slice(page.from,page.to+1);
      let recentQuestionsString = '';
      if (pageQuestions.length == 0)
        recentQuestionsString = 'No questions to show here.';
      else
        for (let pageQuestion of pageQuestions)
          recentQuestionsString += '``' + new Date(pageQuestion.addDate * 1000).toLocaleString().split(',')[0] + ' [' + pageQuestion.id + '] ' + nameUtil.cutName(pageQuestion.text) + '``' + '\n';

      embed.addField('Page ' + page.page + '', recentQuestionsString + '\n');

      await msg.channel.send(embed);
      resolve();
    } catch (e) { reject(e); }
    resolve();
  });
}
