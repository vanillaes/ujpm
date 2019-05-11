const fs = require('fs');

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
  }
}

module.exports = UTIL;
