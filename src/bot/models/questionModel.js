const db = require('../../models/db.js');
const config = require('../../const/config.js');

exports.getQuestionToAnswer = (userId) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch(
          null,
          '/api/question/getQuestionToAnswer/' + userId,
          'get');

      resolve(res);
    } catch (e) { reject(e); }
  });
}

exports.create = (channelId,userId,question,answerCount) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch({
            source: config.sourceInt,
            channelId: channelId,
            userId: userId,
            question: question,
            answerCount: answerCount},
          '/api/question/create',
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
          '/api/question/get/' + id,
          'get');

      if (res.error)
        return reject(res.error);
      else
        return resolve(res.results);
    } catch (e) { reject(e); }
  });
}

exports.set = (id,field,value) => {
  return new Promise(async function (resolve, reject) {
    try {
      await db.fetch({id: id,field: field,value: value},'/api/question/set/','put');

      return resolve();
    } catch (e) { reject(e); }
  });
};

exports.getLatest = (from,to) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch(
          null,
          '/api/question/getLatest/' + from + '/' + to,
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
          '/api/question/getByUserId/' + userId,
          'get');

      if (res.error)
        return reject(res.error);
      else
        return resolve(res.results);
    } catch (e) { reject(e); }
  });
}



/*
exports.getFinishedButNotSent = () => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch(
          null,
          '/api/question/getFinishedButNotSent/',
          'get');

      resolve(res);
    } catch (e) { reject(e); }
  });
}


exports.set = (id,field,value) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch({
          id: id,
          field: field,
          value: value },
          '/api/question/set',
          'put');

      resolve(res);
    } catch (e) { reject(e); }
  });
}
*/
