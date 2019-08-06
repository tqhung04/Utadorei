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

  console.log(request);
  console.log(await sessionClient.detectIntent(request));
  const responses = await sessionClient.detectIntent(request);
  // return
  // const responses = await sessionClient.detectIntent(request);
  // console.log(responses);
  // const result = responses[0].queryResult;
  // message.reply(I18n.no_match_intent);
  // if (result.intent) {
  //   switch (result.intent.displayName) {
  //     case 'IPlay':
  //       IPlay.call(message, result);
  //       break;
  //     default:
  //       message.reply(I18n.no_match_intent);
  //       break;
  //   }
  // } else {
  //   message.reply(I18n.no_match_intent);
  // }
}
