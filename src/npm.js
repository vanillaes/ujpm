const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

const NPM = {
  fetchPackage: async function(source) {
    console.log('fetching NPM package');
    const identity = this.formatIdentity(source);
    const version = await this.matchVersion(source.version, identity);
    console.log(version);
  },

  formatIdentity: function(source) {
    // rebuild the package identifier
    return `${source.scoped ? '@' : ''}${source.owner}/${source.name}`;
  },

  // npm view @vanillawc/wc-markdown versions --json
  getVersions: async function(identity) {
    // fetch the listing
    let output = '';
    try {
      const { stdout } = await execAsync(`npm view ${identity} versions --json`);
      output = stdout;
    } catch (err) {
      console.error(`NPM_ERROR: failed to fetch the version listing`, err);
    }

    // convert to JSON and return
    return JSON.parse(output);
  },

  // npm view @vanillawc/wc-markdown --json
  getLatest: async function(identity) {
    // fetch the listing
    let output = '';
    try {
      const { stdout } = await execAsync(`npm view ${identity} --json`);
      output = stdout;
    } catch (err) {
      console.error(`NPM_ERROR: failed to fetch the version listing`, err);
    }

    // convert to JSON and return
    return JSON.parse(output).version;
  },

  matchVersion: async function(version, identity) {
    // look up the latest version
    if (version === 'latest'){
      return await this.getLatest(identity);
    }

    // parse the version number further
    const parsed = this.parseVersion(version);

    // fetch the available versions
    const versions = await this.getVersions(identity);

    // no prefix, use as-is
    if (!parsed.prefix && this.isValidVersion(version, versions)) {
      return version;
    }

    // get the highest pinned version
    const pinned = this.pinnedVersion(parsed[0], versions, parsed[1]);
    if (pinned) {
      return pinned;
    }

    throw Error(`ERR_VERSION: '${version}' is not a valid version`);
  },

  parseVersion: function(version) {
    let prefix;
    let prerelease;
  
    // check for minor/patch prefix
    if (version[0] === '^' || version[0] === '~') {
      prefix = version[0];
      version = version.substring(1)
    }
  
    // check for prerelease
    if (/-(.*?)$/.test(version)) {
      const match = /-(.*?)$/.exec(version);
      version = version.substring(0, version.length - match[0].length);
      prerelease = (match[1]);
    }
  
    [major, minor, patch] = version.split('.');
    version = [major, minor || 0, patch || 0].join('.');
  
    return [ version, prefix, prerelease ];
  },

  isValidVersion: function(version, versions) {
    return !!versions.includes(version);
  },

  pinnedVersion: function(version, versions, prefix) {
    // match major
    versions = versions.filter(v => {
      return v[0] === version[0];
    });

    // return the greatest minor version
    if (prefix === '^') {
      return versions[versions.length - 1];
    }

    // match minor
    versions = versions.filter(v => {
      return v[2] === version[2];
    });

    if (prefix === '~') {
      return versions[versions.length - 1];
    }

    throw Error(`ERROR_VERSION: '${prefix}${version} not a valid version range`);
  }
}

module.exports = NPM;
