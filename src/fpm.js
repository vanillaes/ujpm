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
    // read package.json
    let pkg = UTIL.readPackage();

    // parse the input
    const source = UTIL.parseInput(input);

    // exit if FPM config not present
    if (!UTIL.isInitialized(pkg)) {
      console.log(`FPM config missing in package.json, to initialize this package run 'fpm init'`);
      process.exit(1);
    }

    // exit if package is already installed
    if (UTIL.isInstalled(pkg, source.name)) {
      console.log(`'${name}' is already installed`);
      process.exit(1);
    };

    // fetch the package
    UTIL.fetchPackage(source);
  },

  remove: function(input) {
    console.log('remove');
  },

  update: function() {
    console.log('update');
  }
};

module.exports = FPM;
