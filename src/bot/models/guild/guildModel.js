const db = require('../../../models/db.js');
const mysql = require('promise-mysql');
const fct = require('../../../util/fct.js');

const promises = {};
exports.cache = {};
exports.storage = {};

const hostField = process.env.NODE_ENV == 'production' ? 'hostIntern' : 'hostExtern';
const cachedFields = ['prefix','addDate'];

exports.cache.load = (guild) => {
  if(!guild.appData) {
    if(promises[guild.id]) { return promises[guild.id]; }

    promises[guild.id] = new Promise(async (resolve,reject) => {
      try {
        await buildCache(guild);
        delete promises[guild.id];
        resolve();
      } catch (e) { delete promises[guild.id]; reject(e); }
    });

    return promises[guild.id];
  }

  return new Promise(async resolve => { resolve(); });
};


exports.storage.set = (guild,field,value) => {
  return new Promise(async function (resolve, reject) {
    try {
      await db.fetch({guildId: guild.id,field: field,value: value},'/api/discord_guild/set/' + guild.id,'put');

      if (cachedFields.indexOf(field) > -1)
        guild.appData[field] = value;

      return resolve();
    } catch (e) { reject(e); }
  });
};

exports.storage.get = (guild) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch(null,'/api/discord_guild/get/' + guild.id,'get');

      return resolve(res);
    } catch (e) { reject(e); }
  });
};

const buildCache = (guild) => {
  return new Promise(async function (resolve, reject) {
    try {
      let cache = await exports.storage.get(guild);

      if (!cache)
        cache = await db.fetch({guildId: guild.id},'/api/discord_guild/create','post');

      cache.addDate = cache.addDate * 1;
      guild.appData = cache;

      resolve();
    } catch (e) { reject(e); }
  });
};

/*
exports.storage.increment = (guild,field,value) => {
  return new Promise(async function (resolve, reject) {
    try {
      await shardDb.query(guild.appData.dbHost,`UPDATE guild SET ${field} = ${field} + ${mysql.escape(value)} WHERE guildId = ${guild.id}`);

      if (cachedFields.indexOf(field) > -1)
        guild.appData[field] += value * 1;

      return resolve();
    } catch (e) { reject(e); }
  });
};*/
