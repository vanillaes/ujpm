import { join } from 'path'
import { download, parse, rimraf, untar, unzip, verify } from './util/core.js'
import CONFIG from './util/config.js'
import GITHUB from './util/github.js'
// import GPM from './util/gpm.js';
import NPM from './util/npm.js'

const TARGET_DIR = 'modules'

export async function init (target) {
  // read package.json
  let pkg = await CONFIG.read()

  // check if config already exists
  pkg = CONFIG.exists(pkg)

  // add basic config
  pkg.modules = {}

  // prettify and log the output
  console.log(JSON.stringify(pkg, null, 2))

  // save the config
  await CONFIG.write(pkg)
}

export async function install (input) {
  // read package.json
  const pkg = await CONFIG.read()

  // parse the input
  const source = parse(input)

  // exit if UJPM config not present
  if (!CONFIG.isInitialized(pkg)) {
    console.log('UJPM config missing in package.json, to initialize this package run \'ujpm init\'')
    process.exit(1)
  }

  // exit if package is already installed
  if (CONFIG.isInstalled(pkg, source.name)) {
    console.log(`'${source.name}' is already installed`)
    process.exit(1)
  }

  // fetch the package details
  const details = await fetchDetails(source)

  // download the tar
  const tgz = await download(details.tarball)

  // verify the contents
  if (!verify(details.shasum, tgz)) {
    throw Error('ERR_VERIFY: checksum verification of the package failed')
  }

  // unzip the package contents
  const tar = await unzip(tgz)

  // untar the package contents
  const target = join(TARGET_DIR, source.name)
  await untar(target, tar)

  // update package.json
  pkg.modules[source.package] = details.version
  await CONFIG.write(pkg)

  console.log(`${input} installed successfully`)
}

export async function remove (input) {
  // read package.json
  const pkg = await CONFIG.read()

  // parse the input
  const source = parse(input)

  if (!CONFIG.isInstalled(pkg, source.package)) {
    throw Error('ERR_REMOVE: package is not installed')
  }

  // delete the source
  const target = join(TARGET_DIR, source.name)
  await rimraf(target)

  // update package.json
  delete pkg.modules[source.package]
  await CONFIG.write(pkg)

  console.log(`${input} removed successfully`)
}

export async function update () {
  console.log('update')

  // TODO: should verify the package exists

  // TODO: verify the version is valid

  // TODO: if version is provided, verify it's greater than the previous version

  // TODO: update to latest or version provided

  // TODO: update package.json
}

async function fetchDetails (source) {
  // OMG THIS IS SO FETCH!!!
  switch (source.strategy) {
    case 'github':
      return GITHUB.fetchDetails(source)
    case 'npm':
      return NPM.fetchDetails(source)
    // case 'gpm':
    //   return GPM.fetchDetails(source);
    default:
      console.log(`'${source.strategy}' strategy not supported`)
      process.exit(1)
  }
}

export default { init, install, remove, update }
