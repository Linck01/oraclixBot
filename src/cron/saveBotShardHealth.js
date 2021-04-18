const publicIp = require('public-ip');
const ipInt = require('ip-to-int');
const utilModel = require('../models/utilModel.js');


module.exports = (manager) => {
  return new Promise(async function (resolve, reject) {
    try {
      const nowDate = new Date().getTime() / 1000;

      const shards = await manager.broadcastEval(`
        const obj = {
          shardId: this.shard.ids[0],
          uptimeS: this.uptime / 1000,
          readyDate: this.readyTimestamp,
          serverCount: this.guilds.cache.size
        };
        obj;
		  `);

      let ip = await publicIp.v4();
      ip = ipInt(ip).toInt();

      for (shard of shards) {
        shard.ip = ip;
        shard.changeDate = nowDate;
        shard.readyDate = new Date(shard.readyDate).getTime() / 1000;
        if (process.env.NODE_ENV != 'production')
          shard.shardId = shard.shardId + 1000000;
      }

      await utilModel.insertUpdateMulti('botShardStat',shards);

      resolve();
    } catch (e) { reject(e); }
  });
}
