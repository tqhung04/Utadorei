const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const bot = new Discord.Client();
const HandleOrder = require('./services/handle_order.js');
const HandleChat = require('./services/handle_chat.js');

bot.once('ready', () => {
  console.log('Ready!');
});

bot.login(token);

bot.on('message', message => {
  if (message.author.bot) { return; }

  if (message.content.startsWith(prefix)) {
    HandleOrder.call(message);
  } else {
    HandleChat.call(message);
  }
});
