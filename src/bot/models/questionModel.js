const db = require('../../models/db.js');

exports.create = (guildId,channelId,userId,question,answerCount) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch({
            guildId: guildId,
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

      resolve(res);
    } catch (e) { reject(e); }
  });
}

exports.getAll = (page) => {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await db.fetch(
          null,
          '/api/question/getAll/' + page,
          'get');

      resolve(res);
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
