const db = require('../../models/db.js');

exports.create = (questionId,userId,text) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch({
            questionId: questionId,
            userId: userId,
            text: text},
          '/api/answer/create',
          'post');

      resolve(res);
    } catch (e) { reject(e); }
  });
}

exports.get = (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch(
          null,
          '/api/answer/get/' + id,
          'get');

      if (res.error)
        return reject(res.error);
      else
        return resolve(res.results);
    } catch (e) { reject(e); }
  });
}

exports.getByQuestionId = (questionId) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch(
          null,
          '/api/answer/getByQuestion/' + questionId,
          'get');

      if (res.error)
        return reject(res.error);
      else
        return resolve(res.results);
    } catch (e) { reject(e); }
  });
}

exports.getByUserId = (userId) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch(
          null,
          '/api/answer/getByUserId/' + userId,
          'get');

      if (res.error)
        return reject(res.error);
      else
        return resolve(res.results);
    } catch (e) { reject(e); }
  });
}
