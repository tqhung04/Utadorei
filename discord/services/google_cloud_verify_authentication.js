const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

module.exports = {
  call: call
}

function call() {
  storage
    .getBuckets()
    .then((results) => {
      const buckets = results[0];

      console.log('Buckets:');
      buckets.forEach((bucket) => {
        console.log(bucket.name);
      });
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
}
