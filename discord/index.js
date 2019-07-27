const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const bot = new Discord.Client();
const ytdl = require('ytdl-core');
let servers = {};

bot.once('ready', () => {
  console.log('Ready!');
});

console.log(token);
bot.login(token);

bot.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) { return; }

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
  }
});

function play(connection, message) {
  let server = servers[message.guild.id];
  server.dispatcher = connection.playStream(
    ytdl(server.queue[0], {filter: 'audioonly'})
  );
  console.log('Playing ' + server.queue[0]);
  server.queue.shift();
  server.dispatcher.on('end', function() {
    if(server.queue[0]) { play(connection, message); }
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
  servers[message.guild.id].queue.push(url);

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

  server.queue.splice(1, 0, url);
  server.dispatcher.end();
}
