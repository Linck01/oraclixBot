const db = require('./db.js');
const mysql = require('promise-mysql');

exports.getSettings = (id,field,value) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch(null,'/api/util/settings/','get');

      if (res.error)
        return reject(res.error);
      else
        return resolve(res.results);
     } catch (e) { reject(e); }
   });
 }

 exports.getTexts = (id,field,value) => {
   return new Promise(async function (resolve, reject) {
     try {
       const res = await db.fetch(null,'/api/util/texts/','get');

       if (res.error)
         return reject(res.error);
       else
         return resolve(res.results);
     } catch (e) { reject(e); }
   });
 }

 exports.insertUpdateMulti = (tableName,array) => {
   return new Promise(async function (resolve, reject) {
     try {
       await db.fetch({tableName: tableName,array: array},'/api/util/insertUpdateMulti/','put');

       return resolve();
     } catch (e) { reject(e); }
   });
 };
