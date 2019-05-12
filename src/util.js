const fs = require('fs');
const GITHUB = require('./github');
const GPM = require('./gpm');
const NPM = require('./npm');
const PKG_PATH = process.cwd() + '/package.json';
const UTIL = {
  readPackage: function() {
    let pkg;
    if (fs.existsSync(PKG_PATH)) {
      pkg = require(PKG_PATH);
    } else {
      throw Error('ERR_CONFIG: package.json not found, is this a package?');
    }

    return pkg;
  },

  writePackage: function(pkg) {
    fs.writeFile(PKG_PATH, JSON.stringify(pkg, null, 2), (err) => {
      if (err) {
        throw Error('ERR_CONFIG: failed to write to package.json', err);
      }
    });
    
  },

  configExists: function(pkg) {
    if (pkg.fpmDependencies) {
      throw Error(`ERR_CONFIG: Init failed, 'fpmDependencies' already exists in package.json`);
    }

    return pkg;
  },

  parseInput: function(input) {
    const source = {};

    // extract source.strategy
    let strategy = /^(.*?):/.exec(input)
    input = input.substring(strategy[0].length);
    source.strategy = strategy[1];

    // remove leading @ from scoped packages
    input = (input[0] === '@') ? input.substring(1) : input;
    
    // extract source.owner
    let owner = /^(.*?)\//.exec(input);
    input = input.substring(owner[0].length);
    source.owner = owner[1];

    // return source.name if no version scope
    if (!/@/.test(input)) {
      source.name = input;
      source.version = 'latest';
      return source;
    }

    // extract source.name
    let name = /^(.*?)@/.exec(input);
    input = input.substring(name[0].length);
    source.name = name[1];

    // remains are the version
    source.version = input;

    return source;
  },

  isInitialized: function (pkg) {
    // has fpm been initialized for this project?
    return pkg.fpmDependencies && pkg.fpmDependencies.packages;
  },

  isInstalled: function(pkg, name) {
    // fetch the names of installed packages
    const keys = Object.keys(pkg.fpmDependencies.packages);

    return keys.includes(name);
  },

  fetchPackage: function(pkg, source) {
    switch(source.strategy) {
      case 'github':
        GITHUB.fetchPackage(pkg, source);
        break;
      case 'gpm':
        GPM.fetchPackage(pkg, source);
        break
      case 'npm':
        NPM.fetchPackage(pkg, source);
        break;
      default:
        console.log(`'${source.strategy}' strategy not supported`);
        exit(1);
    }
  }
}

module.exports = UTIL;
