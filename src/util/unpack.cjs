var https = require('https');
const { ReadableStreamBuffer, WritableStreamBuffer } = require('stream-buffers');
const shasum = require('shasum');
const { ungzip } = require('node-gzip');
const tar = require('tar-fs');

const UNPACK = {

  // TODO: add unpack function to wrap the specifics for reuse in both install/remove

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
  },

  unzip: async function(buffer) {
    return await ungzip(buffer);
  },

  untar: async function(target, buffer) {
    let reader = new ReadableStreamBuffer();

    // load the reader stream
    reader.put(buffer)

    // extract the tar contents
    reader.pipe(tar.extract(`${process.cwd()}/${target}`, { map: function(header) {
      const match = /^(.*?)\//.exec(header.name);
      header.name = header.name.substring(match[0].length - 1);
      return header;
    }}));
  }
}

module.exports = UNPACK;
