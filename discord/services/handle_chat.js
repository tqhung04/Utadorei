const dialogflow = require('dialogflow');
const { project_id } = require('../config.json');
const uuid = require('uuid');
const IPlay = require('../intents/iPlay.js');
const I18n = require('../../i18n/discord/services/handle_chat.json');

module.exports = {
  call: call
}

async function call(message) {
  const sessionId = uuid.v4();
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(project_id, sessionId);

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
  if (result.intent) {
    console.log(result.intent);
    switch (result.intent.displayName) {
      case 'IPlay':
        IPlay.call(message, result);
        break;
      default:
        message.reply(I18n.no_match_intent);
        break;
    }
  } else {
    message.reply(I18n.no_match_intent);
  }
}
