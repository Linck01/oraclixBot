const config = require('../../const/config.js');
const fs = require('fs');
const embeds = require('../util/embeds.js');

const commandFiles = fs.readdirSync('./bot/commands/').filter(file => file.endsWith('.js')).map(file => file.slice(0,-3));

const commands = new Map();
for (const file of commandFiles)
	commands.set(file, require(`../commands/${file}`));

module.exports = (msg) => {
  return new Promise(async function (resolve, reject) {
    try {
      const withoutPrefix = msg.content.slice(msg.guild.appData.prefix.length);
    	const split = withoutPrefix.split(/ +/);
    	const command = split[0].toLowerCase();
    	const args = split.slice(1);
      const now = new Date(Date.now()).toLocaleString();

			console.log('  ' + now + '  ' + command + ' command triggered: ' + msg.content + ' from user ' +
					msg.author.username + ' in guild ' + msg.channel.guild.name + '.');

			if (command != 'test') {
				msg.channel.send(getOtherBotEmbed());
				return resolve();
			}

			if (command == '?' || command == 'ask')
				await commands.get('ask')(msg,args);
			else if (command == '!' || command == 'answer')
				await commands.get('answer')(msg,args);
			else if (command == 'show' || command == 's')
				await commands.get('show')(msg,args);
			else if (command == 'latest' || command == 'l')
				await commands.get('latest')(msg,args);
			else if (command == 'favor' || command == 'favors')
				await commands.get('favor')(msg,args);
			else if (command == 'tip' || command == 't')
				await commands.get('tip')(msg,args);
			else if (command == 'myquestions' || command == 'mq')
				await commands.get('myquestions')(msg,args);
			else if (command == 'myprofile' || command == 'mp')
				await commands.get('myprofile')(msg,args);
			else if (command == 'patchnote')
				await commands.get('patchnote')(msg,args);
			else if (command == 'patchnotes' || command == 'p')
				await commands.get('patchnotes')(msg,args);
			else if (command == 'help' || command == 'h')
				await commands.get('help')(msg,args);
			else if (command == 'report' || command == 'r')
				await commands.get('report')(msg,args);
			else if (command == 'ban' || command == 'b')
				await commands.get('ban')(msg,args);
			else if (command == 'test')
				await commands.get('test')(msg,args);
			else if (command == 'showreports' || command == 'sr')
				await commands.get('showReports')(msg,args);
			else if (command == 'faq' || command == 'faqs' || command == 'f')
				await commands.get('faq')(msg,args);
			else
        await msg.channel.send(embeds.genericSmall('Unknown command. Type ``'+msg.guild.appData.prefix+'help`` for more information.\n'));

			resolve();
    } catch (e) { reject(e); }
  });
}

const Discord = require('discord.js');
const getOtherBotEmbed = () => {
  const embed = new Discord.MessageEmbed()
    .setTitle('This bot is having troubles due to a high demand!')
    .setColor(config.embedColor)
    .setDescription('Please remove this bot from your server and invite our secondary bot to use it without problems again. \n\n Oraclix2 invite: https://discord.com/oauth2/authorize?client_id=838721407223332864&permissions=2148531392&scope=bot \n\n Thank you and sorry for the inconvenience.')
    .setImage('')
    .setThumbnail('')
  ;
  return embed;
}
