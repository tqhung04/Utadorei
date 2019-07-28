const dialogflow = require('dialogflow');
const { projectId } = require('../config.json');
const uuid = require('uuid');
const IPlay = require('../intents/iPlay.js');

module.exports = {
  call: call
}

async function call(message) {
  const sessionId = uuid.v4();
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message.content,
        languageCode: 'en-US',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  console.log(result.intent);
  if (result.intent) {
    switch (result.intent.displayName) {
      case 'IPlay':
        IPlay.call(message, result);
        break;
    }
  } else {
    handle_no_match_itent(message);
  }
}

function handle_no_match_itent(message) {
  message.reply('Sorry, I do not understand.');
}
