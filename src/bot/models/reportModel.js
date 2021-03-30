const db = require('../../models/db.js');

exports.create = (type,typeId,fromUserId) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await dbapi.call({
            type: type,
            typeId: typeId,
            fromUserId: fromUserId
          },
          '/api/report/new',
          'post');

      resolve(res);
    } catch (e) { reject(e); }
  });
}
