const UTIL = require('./util');
const FPM = {
  init: function (target) {
    // read package.json
    let pkg = UTIL.readPackage();
    
    // check if config already exists
    pkg = UTIL.configExists(pkg);

    // add basic config
    pkg.fpmDependencies = {};
    pkg.fpmDependencies.target = target;
    pkg.fpmDependencies.packages = {};

    // log the output
    console.log(pkg);

    // save the config
    UTIL.writePackage(pkg);
  },

  install: function() {
    console.log('install');
  },

  remove: function() {
    console.log('remove');
  },

  update: function() {
    console.log('update');
  }
};

module.exports = FPM;
