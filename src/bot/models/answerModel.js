const db = require('../../models/db.js');

exports.new = (questionId,userId,text) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await dbapi.call({
            questionId: questionId,
            userId: userId,
            text: text},
          '/api/answer/new',
          'post');

      resolve(res);
    } catch (e) { reject(e); }
  });
}

exports.get = (id) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await dbapi.call(
          null,
          '/api/answer/get/' + id,
          'get');

      resolve(res);
    } catch (e) { reject(e); }
  });
}

exports.getByQuestionId = (questionId) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await dbapi.call(
          null,
          '/api/answer/getByQuestion/' + questionId,
          'get');

      resolve(res);
    } catch (e) { reject(e); }
  });
}

exports.getByUserId = (userId) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await dbapi.call(
          null,
          '/api/answer/getByUserId/' + userId,
          'get');

      resolve(res);
    } catch (e) { reject(e); }
  });
}
