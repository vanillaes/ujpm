import test from 'tape'
import fs from 'fs'
import mock from 'mock-fs'
import { exists, isInitialized, isInstalled, read, write } from '../src/util/config.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const fixtures = require('./__test__/config.json')

test('Config read() - throw when package.json is missing', async (t) => {
  mock()

  try {
    await read()
  } catch (e) {
    t.pass('should throw an exception')
    t.equal(e.message, 'ERR_CONFIG: package.json not found, is this a package?', 'should have the correct message')
  }

  mock.restore()
  t.end()
})

test('Config read() - read package.json contents', async (t) => {
  mock({
    'package.json': JSON.stringify(fixtures.npmInit)
  })

  const pkg = await read()

  t.deepEqual(pkg, { name: 'test' }, 'should read the package contents')

  mock.restore()
  t.end()
})

test('Config write() - throws when package.json is missing', async (t) => {
  mock()

  try {
    await write(fixtures.npmInit)
  } catch (e) {
    t.pass('should throw an exception')
    t.equal(e.message, 'ERR_CONFIG: package.json not found, is this a package?', 'should have the correct message')
  }

  mock.restore()
  t.end()
})

test('Config write(pkg) - write package.json contents', async (t) => {
  mock({
    'package.json': JSON.stringify(fixtures.emptyConfig)
  })

  await write(fixtures.npmInit)
  const expect = JSON.stringify(fixtures.npmInit, null, 2)
  const actual = fs.readFileSync('package.json', { encoding: 'utf-8' })

  t.equal(actual, expect, 'should write config to package.json')

  mock.restore()
  t.end()
})

test('Config exists(pkg) - no-op if the config has not been created yet', (t) => {
  const pkg = fixtures.emptyConfig
  const actual = exists(pkg)

  t.isEqual(actual, pkg, 'should no-op pass the package')

  t.end()
})

test('Config exists(pkg) - throw if config already exists', (t) => {
  const pkg = fixtures.ujpmInit
  try {
    exists(pkg)
  } catch (e) {
    t.pass('should throw an exception')
    t.equal(e.message, 'ERR_CONFIG: Init failed, \'pkg.modules\' already exists', 'should have the correct message')
  }

  t.end()
})

test('Config isInitialized(pkg) - true if the config has been initialized', (t) => {
  const pkg = fixtures.ujpmInit
  const actual = isInitialized(pkg)

  t.isEqual(actual, true, 'should return true if it has already been initialized')

  t.end()
})

test('Config isInitialized(pkg) - false if the config has not been initialized', (t) => {
  const pkg = fixtures.emptyConfig
  const actual = isInitialized(pkg)

  t.isEqual(actual, false, 'should return false if it has not been initialized')

  t.end()
})

test('Config isInstalled(pkg) - false if the package has not been installed', (t) => {
  const pkg = fixtures.ujpmInit
  const actual = isInstalled(pkg, 'wc-markdown')

  t.isEqual(actual, false, 'should return false if it has not been installed')

  t.end()
})

test('Config isInstalled(pkg) - true if the package has not been installed', (t) => {
  const pkg = fixtures.ujpmPackageExists
  const actual = isInstalled(pkg, 'wc-markdown')

  t.isEqual(actual, true, 'should return true if it has not been installed')

  t.end()
})
