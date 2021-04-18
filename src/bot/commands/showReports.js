const errorMsgs = require('../../const/errorMsgs.js');
const fct = require('../../util/fct.js');
const config = require('../../const/config.js');
const reportModel = require('../models/reportModel.js');
const Discord = require('discord.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (msg.author.id != '370650814223482880') {
        await msg.channel.send(embeds.genericSmall('Only the owner of this bot can use this command.'));
        return resolve();
      }

      const page = fct.extractPage(args,12);

      const res = await reportModel.getTop(page.from,page.to,7776000);

      if (res.error)
        return resolve(await msg.channel.send(embeds.genericSmall(errorMsgs.get(res.error).replace('<prefix>',msg.guild.appData.prefix))));

      const embed = new Discord.MessageEmbed()
        .setAuthor('Top reports last 3 months.')
        .setColor(config.embedColor)
        //.setDescription('A level and stat bot. \n - Track users voice- and textchannel activity and grant XP for each.\n - Track most active voice- and textchannels.\n - Let users grant each other XP via social upvotes.\n - Auto assign and deassign roles upon reaching a certain level.\n - Customize XP granted for each activity and XP necessary for each subsequent level.')
        .setDescription('')
        .setImage('')
        .setThumbnail('')
      ;
      console.log(res);
      for (let report of res.results)
        embed.addField('***' + report.toUserId + '***', report.count + '\n');

      await msg.channel.send(embed);

      resolve();
    } catch (e) { reject(e); }
  });
}
