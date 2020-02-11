import { promisify } from 'util';
import rmrf from 'rimraf';
const rimrafAsync = promisify(rmrf);
import https from 'https';
import sb from 'stream-buffers';
import shasum from 'shasum';
import gzip from 'node-gzip';
import tar from 'tar-fs';

export async function download (url) {
  // setup an auto-resizing buffer
  let writer = new sb.WritableStreamBuffer({
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
}

export function parse (input) {
  const source = {};

  // extract source.strategy
  let strategy = /^(.*?):/.exec(input)
  input = input.substring(strategy[0].length);
  source.strategy = strategy[1];

  // remove leading @ from scoped packages
  if (input[0] === '@') {
    input = input.substring(1)
    source.scoped = true;
  }
  
  // extract source.owner
  let owner = /^(.*?)\//.exec(input);
  input = input.substring(owner[0].length);
  source.owner = owner[1];

  // return source.name if no version scope
  if (!/@/.test(input)) {
    // set scope.name
    source.name = input;

    // set scope.package
    source.package = `${source.scoped ? '@' : ''}${source.owner}/${source.name}`;

    // set scope.version
    source.version = 'latest';

    return source;
  }

  // extract source.name
  let name = /^(.*?)@/.exec(input);
  input = input.substring(name[0].length);
  source.name = name[1];

  // set scope.package
  source.package = `${source.scoped ? '@' : ''}${source.owner}/${source.name}`;

  // set scope.version
  source.version = input

  return source;
}

export async function rimraf (target) {
  try {
    await rimrafAsync(target);
  } catch {
    throw Error(`ERR_REMOVE: Failed to delete the package directory`);
  }
}

export async function untar (target, buffer) {
  let reader = new sb.ReadableStreamBuffer();

  // load the reader stream
  reader.put(buffer)

  // extract the tar contents
  reader.pipe(tar.extract(`${process.cwd()}/${target}`, { map: function(header) {
    const match = /^(.*?)\//.exec(header.name);
    header.name = header.name.substring(match[0].length - 1);
    return header;
  }}));
}

export async function unzip (buffer) {
  return await gzip.ungzip(buffer);
}

export function verify (input, buffer) {
  return (input === shasum(buffer));
}

export default { download, parse, rimraf, untar, unzip, verify };
