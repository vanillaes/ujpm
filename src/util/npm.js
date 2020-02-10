import { promisify } from 'util';
import { exec } from 'child_process';
const execAsync = promisify(exec);

async function fetchDetails (source) {
  const identity = formatIdentity(source);
  const version = await matchVersion(identity, source.version);
  const { tarball, shasum } = await getDownload(identity, version);
  return { version, tarball, shasum }
}

// npm view @vanillawc/wc-markdown versions --json
async function getVersions (identity) {
  const command = `npm view ${identity} versions --json`;

  // fetch the listing
  let output = '';
  try {
    const { stdout } = await execAsync(command);
    output = stdout;
  } catch (err) {
    console.error(`NPM_ERROR: failed to fetch the version listing`, err);
  }

  // convert to JSON and return
  return JSON.parse(output);
}

// npm view @vanillawc/wc-markdown --json
async function getLatest (identity) {
  const command = `npm view ${identity} --json`;

  // fetch the listing
  let output = '';
  try {
    const { stdout } = await execAsync(command);
    output = stdout;
  } catch (err) {
    console.error(`NPM_ERROR: failed to fetch the version listing`, err);
  }

  // convert to JSON and return
  return JSON.parse(output).version;
}

// npm view @vanillawc/wc-markdown@1.0.0 --json
async function getDownload (identity, version) {
  const command = `npm view ${identity}@${version} --json`;

  // fetch the listing
  let output = '';
  try {
    const { stdout } = await execAsync(command);
    output = stdout;
  } catch (err) {
    console.error(`NPM_ERROR: failed to fetch the version details`, err);
  }

  // parse and return the details
  const details = JSON.parse(output);
  return { tarball: details.dist.tarball, shasum: details.dist.shasum };
}

function formatIdentity (source) {
  // rebuild the package identifier
  return `${source.scoped ? '@' : ''}${source.owner}/${source.name}`;
}

async function matchVersion (identity, version) {
  // easy path: no version specified so use the latest version
  if (version === 'latest'){
    return await getLatest(identity);
  }

  // mid path: is this version available?
  const versions = await getVersions(identity);
  if (isValidVersion(version, versions)) {
    return version;
  }

  // hard path: add support for version pinning, range selection, etc
  // https://nope.com/holy-ambiguous-complexity-batman.html

  throw Error(`ERR_VERSION: '${version}' is not a valid version`);
}

function isValidVersion (version, versions) {
  return !!versions.includes(version);
}

export default { fetchDetails, getVersions, getLatest };
