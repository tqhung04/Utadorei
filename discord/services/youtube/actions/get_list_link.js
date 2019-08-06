var {google} = require('googleapis');

module.exports = function getListLink(auth, artist) {
  var service = google.youtube('v3');
  service.search.list({
    auth: auth,
    part: 'snippet',
    myRating: 'like',
    maxResults: 10,
    q: "Ăn gì chơi gì ở Enoshima?"
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.data.items;
    if (channels.length == 0) {
      console.log('No channel found.');
    } else {
      console.log(channels);
    }
  });
}
