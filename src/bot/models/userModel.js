const db = require('../../models/db.js');
const mysql = require('promise-mysql');
const fct = require('../../util/fct.js');
const config = require('../../const/config.js');

exports.tip = (fromUserId,answerId,amount) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch({fromUserId: fromUserId,answerId: answerId,amount: amount},'/api/user/tip/','put');

      return resolve(res);
    } catch (e) { reject(e); }
  });
};

exports.get = (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      let res = await db.fetch(null,'/api/user/get/' + id,'get');

      if (res.error)
        return reject(res.error);

      return resolve(res.results);
    } catch (e) { reject(e); }
  });
};

exports.getByDiscordUser = (user) => {
  return new Promise(async function (resolve, reject) {
    try {
      let res = await db.fetch(null,'/api/user/getBySourceId/' + config.sourceInt + '/' + user.id,'get');

      if (res.error)
        return reject(res.error);

      if (!res.results) {
        await db.fetch({source:config.sourceInt,sourceId:user.id, username:user.username + '#' + user.discriminator},'/api/user/create','post');
        res = await db.fetch(null,'/api/user/getBySourceId/' + config.sourceInt + '/' + user.id,'get');

        if (res.error)
          return reject(res.error);

        if (!res.results)
          return reject('Could not get user by discordUser.')
      }

      return resolve(res.results);
    } catch (e) { reject(e); }
  });
};
