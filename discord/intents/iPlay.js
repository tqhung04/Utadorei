const I18n = require('../../i18n/discord/intents/iPlay.json');

module.exports = {
  call: call
}

function call(message, result) {
  keyword = filterKeyWord(message, result.parameters.fields);
  message.reply(keyword);
}

function filterKeyWord(message, fields) {
  let artist = fields['eArtist'] || fields['music-artist']
  if (isExist(artist.stringValue)) {
    return `${I18n.playing} ${artist.stringValue}`;
  }

  return I18n.no_artist;
}

function isExist(param) {
  if(typeof param == 'undefined' || param === '') {
    return false;
  } else {
    return true;
  }
}
