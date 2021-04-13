const db = require('./db.js');

exports.getSettings = (id,field,value) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch(null,'/api/misc/settings/','get');
      
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
       const res = await db.fetch(null,'/api/misc/texts/','get');

       if (res.error)
         return reject(res.error);
       else
         return resolve(res.results);
     } catch (e) { reject(e); }
   });
 }
