#!/usr/bin/env node
import cli from 'commander'
import { init, install, remove } from '../src/ujpm.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

cli.version(pkg.version, '-v, --version')

cli.command('init')
  .description('Initialize the UJPM config')
  .option('-t, --target [value]', 'Set the target directory ', 'ujpm')
  .action((options) => {
    init(options.target)
  })

cli.command('install <pack>')
  .alias('i')
  .description('Install a package')
  .action((pack) => {
    install(pack)
  })

cli.command('remove <pack>')
  .alias('r')
  .description('Remove a package')
  .action((pack) => {
    remove(pack)
  })

cli.command('update <pack>')
  .alias('u')
  .description('Update a package')
  .action((pack) => {
    console.log('update')
    console.log(pack)
  })

cli.parse(process.argv)
