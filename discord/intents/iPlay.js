module.exports = {
  call: call
}

function call(message, result) {
  keyword = filterKeyWord(message, result.parameters.fields);
  console.log(keyword);

  message.reply(keyword);
}

function filterKeyWord(message, fields) {
  if (!isExist(fields['eActionMusic'])) {
    return message.content;
  }

  return message.content.replace(fields['eActionMusic'].stringValue,'');
}

function isExist(param) {
  if(typeof param == 'undefined') {
    return false;
  } else {
    return true;
  }
}
