const Discord = require('discord.js');
const errorMsgs = require('../../const/errorMsgs.js');
const config = require('../../const/config.js');
const embeds = require('../util/embeds.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      let helpEmbed = helpMainEmbed(msg.guild,msg.client.appData.texts.discord.commands);

      await msg.channel.send(helpEmbed);
      //await msg.channel.send('I have sent you the requested information.');

      resolve();
    } catch (e) { reject(e); }
  });
}

function helpMainEmbed (guild,sections) {
  const embed = new Discord.MessageEmbed()
    .setAuthor('Oraclix Help')
    .setColor(0x00AE86)
    //.setDescription('A level and stat bot. \n - Track users voice- and textchannel activity and grant XP for each.\n - Track most active voice- and textchannels.\n - Let users grant each other XP via social upvotes.\n - Auto assign and deassign roles upon reaching a certain level.\n - Customize XP granted for each activity and XP necessary for each subsequent level.')
    .setDescription('Website: *https://oraclix.com/commands*. \n Support server: *'+config.discordSupportServer+'*. \n By using this bot you accept the terms and conditions: *https://oraclix.com/termsandconditions*.')
    .setImage('')
    .setThumbnail('')
  ;

  let commandsString, examples;
  for (let field in sections) {
    commandsString = '``' + guild.appData.prefix + sections[field].command.join('`` or ``' + guild.appData.prefix) + '``';
    examplesString = '``' + guild.appData.prefix + sections[field].example.join('`` or ``' + guild.appData.prefix) + '``';
    embed.addField('***' + sections[field].title + '***\n' + commandsString, sections[field].desc + '\n' + 'Example: ' + examplesString);
  }

  return {embed};
}
