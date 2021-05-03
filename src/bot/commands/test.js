module.exports = (msg) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (msg.author.id != '370650814223482880') {
        await msg.channel.send(embeds.genericSmall('Only the owner of this bot can use this command.'));
        return resolve();
      }

      let dateString;
      const arr = [];


      for (let guild of msg.client.guilds.cache)
        arr.push(guild[1]);

      arr.sort(compare);

      for (let guild of arr) {

      }

      const toRemove = arr.slice(0,1);

      for (let guild of toRemove) {
        dateString = new Date(guild.joinedTimestamp*1000).toLocaleString();
        console.log('Removed ' + guild.name + ' ' + dateString);
        await guild.leave();
      }


      resolve();
    } catch (e) { reject(e); }
  });
}

function compare( a, b , field ) {
  if ( a.joinedTimestamp < b.joinedTimestamp )
    return -1;

  if ( a.joinedTimestamp > b.joinedTimestamp )
    return 1;

  return 0;
}
