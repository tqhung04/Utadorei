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
    return `I got it!. Playing music of ${artist.stringValue}`;
  }

  return "Music of?";
}

function isExist(param) {
  if(typeof param == 'undefined' || param === '') {
    return false;
  } else {
    return true;
  }
}
