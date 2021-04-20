const Discord = require('discord.js');
const config = require('../../const/config.js');

exports.questionEmbed = (client,question,answers,tag) => {
  const embed = new Discord.MessageEmbed()
    .setTitle('Question')
    .setColor(config.embedColor)
    .setDescription('``[' + question.id + '] ' + question.text + '``')
    .setImage('')
    .setThumbnail('')
    .setFooter(client.appData.settings.news)
  ;

  if (tag)
    embed.setAuthor(tag + ' Your question has been answered!');

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

exports.askEmbed = (client,questionText,answerCount) => {
  const embed = new Discord.MessageEmbed()
    .setTitle('Do you wish to send your question to the Oracle?')
    .setColor(config.embedColor)
    .setDescription('``' + questionText + '``\n' + 'This will cost you **' + answerCount * client.appData.settings.costPerAnswer + '** *favor* for **' + answerCount + '** *answer*' + ((answerCount == 1) ? '' : 's') + '. Please verify and agree to the [T&C](https://oraclix.org/termsAndConditions) by reacting with a 👍.')
    .setImage('')
    .setThumbnail('')
    //.setFooter(client.appData.settings.news)
  ;

  return embed;
}

exports.askSentEmbed = (client,question,answerCount) => {
  console.log(question);
  const embed = new Discord.MessageEmbed()
    .setTitle('Question has been sent! Be patient for an answer.')
    .setColor(config.embedColor)
    .setDescription('``[' + question.id + '] ' + question.text + '``  [View in Browser](https://oraclix.com/q/' + question.id +')' )
    .setImage('')
    .setThumbnail('')
    .setFooter(client.appData.settings.news)
  ;

  return embed;
}

exports.answerPresentEmbed = (client,question) => {
  const embed = new Discord.MessageEmbed()
    .setTitle('Please answer the following question within the next ' + Math.floor(config.answerTimeFrameS / 60) + ' minutes: ')
    .setColor(config.embedColor)
    .setDescription('``[' + question.id + '] ' + question.text + '``')
    .setImage('')
    .setThumbnail('')
    //.setFooter(client.appData.settings.news)
  ;

  return embed;
}

exports.answerEmbed = (client,question,answerText) => {
  const embed = new Discord.MessageEmbed()
    .setTitle('Do you wish to send your answer?')
    .setColor(config.embedColor)
    .setDescription('``' + answerText + '``\n This will grant you **10** *favor*. Please verify and agree to the [T&C](https://oraclix.org/termsAndConditions) by reacting with a 👍.')
    .setImage('')
    .setThumbnail('')
    //.setFooter(client.appData.settings.news)
  ;

  return embed;
}

exports.answerSentEmbed = (client,question,answerText) => {
  const embed = new Discord.MessageEmbed()
    .setTitle('Your answer has been sent to the Oracle!')
    .setColor(config.embedColor)
    .setDescription('``' + answerText + '``')
    .setImage('')
    .setThumbnail('')
    .setFooter(client.appData.settings.news)
  ;

  return embed;
}

exports.genericSmall = (text) => {
  const embed = new Discord.MessageEmbed()
    .setColor(config.embedColor)
    .setDescription(text)
    .setImage('')
    //.setThumbnail('')
  ;

  // embed.addField(titleStr, answerStr);     await msg.channel.send('');

  return embed;
}
