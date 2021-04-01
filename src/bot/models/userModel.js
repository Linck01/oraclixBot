const db = require('../../models/db.js');
const mysql = require('promise-mysql');
const fct = require('../../util/fct.js');

exports.set = (userId,field,value) => {
  return new Promise(async function (resolve, reject) {
    try {
      await db.fetch({userId: userId,field: field,value: value},'/api/user/set/','put');

      return resolve();
    } catch (e) { reject(e); }
  });
};

exports.get = (user) => {
  return new Promise(async function (resolve, reject) {
    try {
      let res = await db.fetch(null,'/api/user/get/' + user.id,'get');

      if (res.error)
        return reject(res.error);

      return resolve(res.results);
    } catch (e) { reject(e); }
  });
};
