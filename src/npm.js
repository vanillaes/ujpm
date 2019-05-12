const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

const NPM = {
  fetchDetails: async function(source) {
    console.log('fetching NPM package');
    const identity = this.formatIdentity(source);
    const version = await this.matchVersion(identity, source.version);
    const { tarball, shasum } = await this.getDownload(identity, version);
    return { version, tarball, shasum }
  },

  // npm view @vanillawc/wc-markdown versions --json
  getVersions: async function(identity) {
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
  },

  // npm view @vanillawc/wc-markdown --json
  getLatest: async function(identity) {
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
  },

  // npm view @vanillawc/wc-markdown@1.0.0 --json
  getDownload: async function(identity, version) {
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
  },

  formatIdentity: function(source) {
    // rebuild the package identifier
    return `${source.scoped ? '@' : ''}${source.owner}/${source.name}`;
  },

  matchVersion: async function(identity, version) {
    // easy path: no version specified so use the latest version
    if (version === 'latest'){
      return await this.getLatest(identity);
    }

    // mid path: is this version available?
    const versions = await this.getVersions(identity);
    if (this.isValidVersion(version, versions)) {
      return version;
    }

    // hard path: add support for version pinning, range selection, etc
    // https://nope.com/holy-ambiguous-complexity-batman.html

    throw Error(`ERR_VERSION: '${version}' is not a valid version`);
  },

  isValidVersion: function(version, versions) {
    return !!versions.includes(version);
  }
}

module.exports = NPM;
