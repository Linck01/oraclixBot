const db = require('../../models/db.js');
const mysql = require('promise-mysql');
const fct = require('../../util/fct.js');

const promises = {};
let defaultCache = null;
let defaultAll = null;
exports.cache = {};
exports.storage = {};
const hostField = process.env.NODE_ENV == 'production' ? 'hostIntern' : 'hostExtern';

exports.storage.set = (user,field,value) => {
  return new Promise(async function (resolve, reject) {
    try {
      await db.fetch({userId: user.id,field: field,value: value},'/api/discord_user/set/','put');

      if (cachedFields[field])
        user.appData[field] = value;

      return resolve();
    } catch (e) { reject(e); }
  });
};

exports.storage.increment = (user,field,value) => {
  return new Promise(async function (resolve, reject) {
    try {
      await db.fetch({userId: user.id,field: field,value: value},'/api/discord_user/inc/','put');

      if (user.appData && cachedFields.indexOf(field) > -1)
        user.appData[field] += value * 1;

      return resolve();
    } catch (e) { reject(e); }
  });
};

exports.storage.get = (user) => {
  return new Promise(async function (resolve, reject) {
    try {
      let res = await db.fetch(null,'/api/discord_user/get/' + user.id,'get');

      if (!res)
        res = await db.fetch({userId: user.id, username:user.username,tag: user.discriminator},'/api/discord_user/create','post');

      console.log(res);
      return resolve(res);
    } catch (e) { reject(e); }
  });
};
