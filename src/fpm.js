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

    // prettify and log the output
    console.log(JSON.stringify(pkg, null, 2));

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
      console.log(`'${source.name}' is already installed`);
      process.exit(1);
    };

    // fetch the package details
    const details = await UTIL.fetchDetails(source);

    // download the tar
    const tgz = await UNPACK.download(details.tarball);

    // verify the contents
    if (!UNPACK.verifyContents(details.shasum, tgz)) {
      throw Error(`ERR_VERIFY: checksum verification of the package failed`); 
    };

    // unzip the package contents
    const tar = await UNPACK.unzip(tgz);

    // untar the package contents
    const target = `${pkg.fpmDependencies.target}/${source.name}`;
    await UNPACK.untar(target, tar);

    // update package.json
    pkg.fpmDependencies.packages[source.name] = details.version;
    UTIL.writePackage(pkg);

    console.log(`${input} installed successfully` );
  },

  remove: function(input) {
    console.log('remove');
  },

  update: function() {
    console.log('update');
  }
};

module.exports = FPM;
