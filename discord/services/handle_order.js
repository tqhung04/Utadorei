const { prefix } = require('../config.json');
const ytdl = require('ytdl-core');
const I18n = require('../../i18n/discord/services/handle_order.json');

module.exports = {
  call: call
}

let servers = {};

function call(message) {
  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'play':
      handlePlay(message, args[0]);
      break;
    case 'skip':
      handleSkip(message);
      break;
    case 'stop':
      handleStop(message);
      break;
    case 'playnow':
      handlePlayNow(message, args[0]);
      break;
    case 'join':
      handleJoin(message);
      break;
    case 'np':
      handleNp(message);
      break;
    case 'list':
      handleList(message);
      break;
  }
}

function handleJoin(message) {
  if (!message.member.voiceChannel) {
    message.reply(I18n.no_channel);
    return false;
  }

  if (!message.guild.voiceConnection) {
    message.member.voiceChannel.join()
      .then(connection => {
      })
      .catch(console.log);
  }
}

function play(connection, message) {
  let server = servers[message.guild.id];
  let unplay_queue = getFirstUnPlayedQueue(server.queue);
  server.dispatcher = connection.playStream(
    ytdl(unplay_queue.url)
  );
  console.log('Playing ' + unplay_queue.url);
  unplay_queue.status = 1;
  server.dispatcher.on('end', function() {
    let unplay_queue = getFirstUnPlayedQueue(server.queue);
    if(unplay_queue) { play(connection, message); }
    else { connection.disconnect(); }
  });
}

function isValidCommand(message, url) {
  if (!url) {
    message.reply(I18n.no_given_link);
    return false;
  }

  let reg = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
  if (!url.match(reg)) {
    message.reply(I18n.no_youtube_link_format);
    return false;
  }

  if (!message.member.voiceChannel) {
    message.reply(I18n.no_channel);
    return false;
  }

  return true;
}

function handlePlay(message, url) {
  if (!isValidCommand(message, url)) { return; }

  if (!servers[message.guild.id]) { servers[message.guild.id] = {queue: []}; }
  servers[message.guild.id].queue.push({
    url: url,
    status: 0
  });

  console.log(servers[message.guild.id].queue);

  if (!message.guild.voiceConnection) {
    message.member.voiceChannel.join()
      .then(connection => {
        play(connection, message);
      })
      .catch(console.log);
  }
}

function handleSkip(message) {
  if (!servers[message.guild.id]) { return; }

  let server = servers[message.guild.id];
  if (server.dispatcher) { server.dispatcher.end(); }
}

function handleStop(message) {
  if (message.guild.voiceConnection) { message.guild.voiceConnection.disconnect(); }
}

function handlePlayNow(message, url) {
  let server = servers[message.guild.id];
  if(!server) {
    handlePlay(message, url);
    return;
  }

  server.queue.splice(1, 0, {
    url: url,
    status: 0
  });
  server.dispatcher.end();
}

function handleNp(message) {
  let server = servers[message.guild.id];
  if(!server || !server.queue) {
    message.reply(I18n.no_song_is_playing);
    return;
  }
  let current_queue = getCurrentQueue(server.queue);
  if(!server) { return; }
  ytdl.getBasicInfo(current_queue.url).then(info => {
    message.reply(getInfoMsg(info, current_queue.url));
  });
}

function getCurrentQueue(queues) {
  return queues.filter(function(queue) {
    return queue.status === 1;
  }).slice(-1)[0];
}

function getFirstUnPlayedQueue(queues) {
  return queues.filter(function(queue) {
    return queue.status === 0;
  })[0];
}

async function handleList(message) {
  let server = servers[message.guild.id];
  if(!server || !server.queue) {
    message.reply(I18n.no_song_is_playing);
    return;
  }
  let msg = "";
  server.queue.forEach(function(queue) {
    ytdl.getBasicInfo(queue.url).then(info => {
      msg += getInfoMsg(info, queue.url) + '\n --------------------------';
      console.log(msg);
    });
  });

  await delay();
  message.reply(msg);
}

function getInfoMsg(info, url) {
  return `\n ${I18n.title}: ${info.player_response.videoDetails.title} \n ${I18n.author}: ${info.author.name} \n ${I18n.link}: ${url}`;
}

function delay() {
  return new Promise(resolve => setTimeout(resolve, 1000));
}
