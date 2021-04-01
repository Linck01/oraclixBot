const db = require('../../models/db.js');
const mysql = require('promise-mysql');
const fct = require('../../util/fct.js');

exports.set = (user,field,value) => {
  return new Promise(async function (resolve, reject) {
    try {
      await db.fetch({userId: user.id,field: field,value: value},'/api/discord_user/set/','put');

      return resolve();
    } catch (e) { reject(e); }
  });
};

exports.increment = (user,field,value) => {
  return new Promise(async function (resolve, reject) {
    try {
      await db.fetch({userId: user.id,field: field,value: value},'/api/discord_user/inc/','put');

      return resolve();
    } catch (e) { reject(e); }
  });
};

exports.get = (user) => {
  return new Promise(async function (resolve, reject) {
    try {
      let res = await db.fetch(null,'/api/discord_user/get/' + user.id,'get');

      if (res.error)
        return reject(res.error);

      if (!res.results) {
        res = await db.fetch({userId: user.id, username:user.username,tag: user.discriminator},'/api/discord_user/create','post');

        if (res.error)
          return reject(res.error);
      }

      return resolve(res.results);
    } catch (e) { reject(e); }
  });
};
