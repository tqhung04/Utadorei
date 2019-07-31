const { prefix } = require('../config.json');
const ytdl = require('ytdl-core');

module.exports = {
  call: call,
  play: play,
  isValidCommand: isValidCommand,
  handlePlay: handlePlay,
  handleSkip: handleSkip,
  handleStop: handleStop,
  handlePlayNow: handlePlayNow
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
  }
}

function handleJoin(message) {
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
    message.reply('Chủ nhân phải nhập link bài hát vào đi.');
    return false;
  }

  let reg = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
  if (!url.match(reg)) {
    message.reply('Em không hiểu được link này. Chủ nhân có nhập đúng link youtue không?');
    return false;
  }

  if (!message.member.voiceChannel) {
    message.reply('Mời chủ nhân vào voice channel trước.');
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
  let current_queue = getCurrentQueue(server.queue);
  if(!server) { return; }
  ytdl.getBasicInfo(current_queue.url).then(info => {
    message.reply(`\n Title: ${info.title} \n Author: ${info.author.name} \n Link: ${current_queue.url}`);
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
