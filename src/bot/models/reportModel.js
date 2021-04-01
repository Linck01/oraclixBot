const db = require('../../models/db.js');

exports.create = (type,typeId,fromUserId) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch({
            type: type,
            typeId: typeId,
            fromUserId: fromUserId
          },
          '/api/report/create',
          'post');

      resolve(res);
    } catch (e) { reject(e); }
  });
}

exports.getTop = (from,to,time) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch(
          null,
          '/api/report/getTop/' + from + '/' + to + '/' + time,
          'get');

      resolve(res);
    } catch (e) { reject(e); }
  });
}
