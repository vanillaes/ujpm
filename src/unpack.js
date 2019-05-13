var https = require('https');
const { WritableStreamBuffer } = require('stream-buffers');
const shasum = require('shasum');

const UNPACK = {

  download: async function(url) {
    // setup an auto-resizing buffer
    let writer = new WritableStreamBuffer({
      initialSize: (100 * 1024),
      incrementAmount: (100 * 1024)
    });

    // pipe the download into the buffer
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.on('data', d => writer.write(d));
        res.on('error', e => console.error(e));
        res.on('close', () => writer.end());
      }
    });

    // promisify the writing
    return await new Promise(function(resolve, reject) {
      writer.on('finish', () => resolve(writer.getContents()));
      writer.on('error', () => reject);
    });
  },

  verifyContents: function(input, buffer) {
    return (input === shasum(buffer));
  }
}

module.exports = UNPACK;
