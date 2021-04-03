const Discord = require('discord.js');
const config = require('../../const/config.js');

module.exports = (question,answers) => {
  const embed = new Discord.MessageEmbed()
    .setAuthor('Question')
    .setColor(config.embedColor)
    .setDescription('``[' + question.id + '] ' + question.text + '``')
    .setImage('')
    .setThumbnail('')
  ;

  let answerStr = [];
  for (let answer of answers)
    answerStr.push('``[' + answer.id + '] ' + answer.text + '``');

  if (answers.length > 0)
    answerStr = answerStr.join('\n');
  else
    answerStr = 'No answers yet.'

  const titleStr = answers.length == 1 ? 'Answer' : 'Answers';

  embed.addField(titleStr, answerStr);

  return embed;
}
