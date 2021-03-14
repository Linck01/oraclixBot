const answerModel = require('../models/answerModel.js');
const questionModel = require('../models/questionModel.js');
const config = require('../../const/config.js');
const fct = require('../../util/fct.js');
const userModel = require('../models/userModel.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      const filter = response => { return response.author.id == msg.author.id };

      const myUser = await userModel.storage.get(msg.author);
      if (fct.isBanned(myUser)) {
        await msg.channel.send('You are still banned and need to wait until you can use this bot again.');
        return resolve();
      }

      question = await questionModel.getQuestionToAnswer(msg.author.id);
      console.log(question);
      if (!question) {
        msg.channel.send('Sorry, there are no more questions of this kind to the universe right now. Please try again later!');
        return resolve();
      }

      await msg.channel.send('The Oracle sends you the following question: ``' + question + '``');
      const answer = await msg.channel.awaitMessages(filter,
        { max: 1, time: 8000, errors: ['time'] }).catch(c => {});

      await msg.channel.send('Your answer has been submitted.');
    } catch (e) { return reject(e); }


    // Category

    /*

    try {
      categoryName = await msg.channel.awaitMessages(filter,
        { maxMatches: 1, time: 600000, errors: ['time'] });
    } catch (e) {
      msg.channel.send('Timeout.').catch(e => console.log(e));
      return resolve();
    }

    try {
      categoryName = categoryName.first().content;
      category = await categoryModel.getByName(categoryName);

      if (category == null) {
        msg.channel.send('Abort. Please enter a valid category.');
        return resolve();
      }
      if (category.name == 'nsfw' && msg.channel.nsfw == false) {
        msg.channel.send('Please choose nsfw questions only in nsfw channels.');
        return resolve();
      }
    } catch (e) { return reject(e); }


    // ANSWER
    let answer,question;

    try {
      question = await questionModel.getActiveQuestionToAnswer(categoryName,msg.author.id);

      if (!question) {
        msg.channel.send('Sorry, there are no more questions of this kind to the universe right now. Please try again later!');
        return resolve();
      }
    } catch (e) { return reject(e); }

    try {
      await msg.channel.send('Question: ' + question.text + '\n\n What is your answer?');
    } catch (e) { return reject(e); }

    try {
      answer = await msg.channel.awaitMessages(filter,
        { maxMatches: 1, time: 600000, errors: ['time'] });
    } catch (e) {
      msg.channel.send('Timeout.').catch(e => console.log(e));
      return resolve();
    }

    try {
      answer = answer.first().content;
    } catch (e) { return reject(e); }


    // CONFIRM
    let confirmation,price,priceTotal;

    try {
      await msg.channel.send('This will award you '+config.creditsPerAnswer+' credits. Do you confirm all data is correct and agree to our Terms of Service? Yes/No');
    } catch (e) { return reject(e); }

    try {
      confirmation = await msg.channel.awaitMessages(filter,
        { maxMatches: 1, time: 120000, errors: ['time'] });
    } catch (e) {
      msg.channel.send('Timeout.').catch(e => console.log(e));
      return resolve();
    }

    try {
      confirmation = confirmation.first().content;
      if (confirmation != 'Yes' && confirmation != 'yes') {
        msg.channel.send('Abort. You need to accept to our Terms of Service to use this bot.');
        return resolve();
      }
    } catch (e) { return reject(e); }

    // CREATE ENTRY
    try {
      await answerModel.new(question.id,msg.author.id,answer);
    } catch (e) { return reject(e); }

    msg.channel.send('Your answer has been submitted. Thank you! Here, take some tokens. Hint: You can upvote this bot every 12 hours on ``https://discordbots.org/bot/581222640891723797`` for a load of free tokens!').catch(e => console.log(e));
    */
    resolve();
  });
}
