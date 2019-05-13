const UTIL = require('./util');
const UNPACK = require('./unpack');
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

  install: async function(input) {
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

    // fetch the package details
    const details = await UTIL.fetchDetails(source);

    // download the tar
    const tar = await UNPACK.download(details.tarball);

    // verify the contents
    if (!UNPACK.verifyContents(details.shasum, tar)) {
      throw Error(`ERR_VERIFY: checksum verification of the package failed`); 
    };

    console.log('download and checksum good');
  },

  remove: function(input) {
    console.log('remove');
  },

  update: function() {
    console.log('update');
  }
};

module.exports = FPM;
