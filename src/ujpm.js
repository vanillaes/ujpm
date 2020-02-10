const CONFIG = require('./util/config');
const GITHUB = require('./util/github');
const GPM = require('./util/gpm');
const NPM = require('./util/npm');
const PARSE = require('./util/parse');
const RM = require('./util/rm');
const UNPACK = require('./util/unpack');

const TARGET_PATH = process.cwd() + '/package.json';

const UJPM = {
  init: async (target) => {
    // read package.json
    let pkg = await CONFIG.read();
    
    // check if config already exists
    pkg = CONFIG.exists(pkg);

    // add basic config
    pkg.ujpmDependencies = {};
    pkg.ujpmDependencies.target = target;
    pkg.ujpmDependencies.packages = {};

    // prettify and log the output
    console.log(JSON.stringify(pkg, null, 2));

    // save the config
    await CONFIG.write(pkg);
  },

  install: async function(input) {
    // read package.json
    let pkg = await CONFIG.read();

    // parse the input
    const source = PARSE.input(input);

    // exit if UJPM config not present
    if (!CONFIG.isInitialized(pkg)) {
      console.log(`UJPM config missing in package.json, to initialize this package run 'ujpm init'`);
      process.exit(1);
    }

    // exit if package is already installed
    if (CONFIG.isInstalled(pkg, source.name)) {
      console.log(`'${source.name}' is already installed`);
      process.exit(1);
    };

    // fetch the package details
    const details = await this.fetchDetails(source);

    // download the tar
    const tgz = await UNPACK.download(details.tarball);

    // verify the contents
    if (!UNPACK.verifyContents(details.shasum, tgz)) {
      throw Error(`ERR_VERIFY: checksum verification of the package failed`); 
    };

    // unzip the package contents
    const tar = await UNPACK.unzip(tgz);

    // untar the package contents
    const target = `${pkg.ujpmDependencies.target}/${source.name}`;
    await UNPACK.untar(target, tar);

    // update package.json
    pkg.ujpmDependencies.packages[source.package] = details.version;
    await CONFIG.write(pkg);

    console.log(`${input} installed successfully` );
  },

  remove: async (input) => {
    // read package.json
    let pkg = await CONFIG.read();

    // parse the input
    const source = PARSE.input(input);

    if (!CONFIG.isInstalled(pkg, source.package)) {
      throw Error(`ERR_REMOVE: package is not installed`)
    }

    // delete the source
    const target = `${process.cwd()}/${pkg.ujpmDependencies.target}/${source.name}`;
    await RM.rf(target);

    // update package.json
    delete pkg.ujpmDependencies.packages[source.package];
    await CONFIG.write(pkg);
    
    console.log(`${input} removed successfully` );
  },

  update: async function() {
    console.log('update');

    // TODO: should verify the package exists

    // TODO: verify the version is valid

    // TODO: if version is provided, verify it's greater than the previous version

    // TODO: update to latest or version provided

    // TODO: update package.json

  },

  fetchDetails: async function(source) {
    // OMG THIS IS SO FETCH!!!
      switch(source.strategy) {
        case 'github':
          return await GITHUB.fetchDetails(source);
        case 'npm':
          return await NPM.fetchDetails(source);
        case 'gpm':
          // #SomeDay
          // return await GPM.fetchDetails(source);
        default:
          console.log(`'${source.strategy}' strategy not supported`);
          exit(1);
      }
    }
};

module.exports = UJPM;
