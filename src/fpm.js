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

  install: function(input) {
    console.log('install');
    const { strategy, owner, name, version } = UTIL.parseInput(input);
    console.log(strategy);
    console.log(owner);
    console.log(name);
    console.log(version);
  },

  remove: function(input) {
    console.log('remove');
  },

  update: function() {
    console.log('update');
  }
};

module.exports = FPM;
