const fs = require('fs');
const { promisify } = require('util');
const fileExistsAsync = promisify(fs.exists);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const PKG_PATH = process.cwd() + '/package.json';

const CONFIG = {
  read: async function() {
    if (!await fileExistsAsync(PKG_PATH)) {
      throw Error('ERR_CONFIG: package.json not found, is this a package?');
    }

    try {
      return JSON.parse(await readFileAsync(PKG_PATH, 'utf-8'));
    } catch {
      throw Error('ERR_CONFIG: Failed to read package.json');
    }
  },

  write: async function(pkg) {
    try {
      await writeFileAsync(PKG_PATH, JSON.stringify(pkg, null, 2));
    } catch {
      throw Error('ERR_CONFIG: failed to write to package.json');
    }
  },

  exists: function(pkg) {
    if (pkg.ujpmDependencies) {
      throw Error(`ERR_CONFIG: Init failed, 'ujpmDependencies' already exists in package.json`);
    }

    return pkg;
  },

  // has ujpm been initialized for this project?
  isInitialized: function (pkg) {
    return !!(pkg.ujpmDependencies && pkg.ujpmDependencies.packages);
  },

  // fetch the names of installed packages
  isInstalled: function(pkg, name) {
    const keys = Object.keys(pkg.ujpmDependencies.packages);

    return keys.includes(name);
  }
}

module.exports = CONFIG;
