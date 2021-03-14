const cron = require('node-cron');
const saveBotShardHealth = require('./saveBotShardHealth.js');
const fct = require('../util/fct.js');
const db = require('../models/db.js');

let restartDelay,updateSettingsInterval,updateTextsInterval,saveBotShardHealthInterval;

if (process.env.NODE_ENV == 'production') {
  restartDelay = 86400000 * 7;
  updateSettingsInterval = 300000;
  updateTextsInterval = 300000;
  saveBotShardHealthInterval = 180000;
} else {
  restartDelay = 86400000;
  updateSettingsInterval = 10000;
  updateTextsInterval = 10000;
  saveBotShardHealthInterval = 8000;
}

exports.start = (manager) => {
  return new Promise(async function (resolve, reject) {
    try {
      startUpdateSettings(manager);
      startUpdateTexts(manager);
      startSaveBotShardHealth(manager);

      // Periodical Restart
      setTimeout(function() {
        try {
          process.exit();
        } catch (e) { console.log(e); }
      }, restartDelay);


      resolve();
    } catch (e) { reject(e); }
  });
}

const startUpdateSettings = async (manager) => {
  while(true) {
    try {
      const settings = await db.fetch(null,'/api/misc/settings/','get');
      await manager.broadcastEval(`this.appData.settings = ${JSON.stringify(settings)}`);
    } catch (e) { console.log(e); }

    await fct.sleep(updateSettingsInterval).catch(e => console.log(e));
  }
}

const startUpdateTexts = async (manager) => {
  while(true) {
    try {
      const texts = await db.fetch(null,'/api/misc/texts/','get');
      await manager.broadcastEval(`this.appData.texts = ${JSON.stringify(texts)}`);
    } catch (e) { console.log(e); }

    await fct.sleep(updateTextsInterval).catch(e => console.log(e));
  }
}

const startSaveBotShardHealth = async (manager) => {
  while(true) {
    await saveBotShardHealth(manager).catch(e => console.log(e));
    await fct.sleep(saveBotShardHealthInterval).catch(e => console.log(e));
  }
}
