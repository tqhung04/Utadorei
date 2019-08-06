const I18n = require('../../i18n/discord/intents/iPlay.json');
const Youtube = require('../services/youtube/authorize_youtube_api.js');
const actions = require('../services/youtube/actions/index.js');

module.exports = {
  call: call
}

function call(message, result) {
  keyword = filterKeyWord(message, result.parameters.fields);
}

function filterKeyWord(message, fields) {
  let artist = fields['eArtist'] || fields['music-artist']
  if (isExist(artist.stringValue)) {
    return handleByArtist(artist.stringValue);
  } else {
    return message.reply(I18n.no_artist);
  }
}

function handleByArtist(artist) {
  Youtube.call(actions.getListLink);
}

function isExist(param) {
  if(typeof param == 'undefined' || param === '') {
    return false;
  } else {
    return true;
  }
}
