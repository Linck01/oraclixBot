const mysql = require('promise-mysql');
const config = require('../const/config.js');
const keys = require('../const/keys.js').get();
const fetch = require('node-fetch');
let fetchAuth;


exports.fetch = (body,route,method) => {
  return new Promise(async function (resolve, reject) {
    try {
      let res;

      const requestObject = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'authorization': keys.dbApiAuth
        },
        //timeout: 12000,
      };

      if (body != null)
        requestObject.body = JSON.stringify(body);

      res = await fetch(keys.dbApiHost + route, requestObject);
      //console.log(res);
      res = await res.json();

      resolve(res);

    } catch (e) { reject('Fetch Error: ' + e); }
  });
}
