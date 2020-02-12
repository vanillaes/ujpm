import test from 'tape';
import mock from 'mock-fs';
import { exists, isInitialized, isInstalled, read, write } from '../src/util/config.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fixtures = require('./__test__/config.json');

test('read() - throw when package.json is missing', async (t) => {
  mock(fixtures.emptyFile);

  try {
    await read();
  } catch(e) {
    t.pass('should throw an exception');
    t.equal(e.message, `ERR_CONFIG: package.json not found, is this a package?`, 'should have the correct message');
  }

  mock.restore();
  t.end();
});

test('read() - read package.json contents', async (t) => {
  mock(fixtures.npmInit);

  const pkg = await read();
  t.deepEqual(pkg, { name: "tmp"}, 'should read the package contents')

  mock.restore();
  t.end();
});

// TODO: How can this be made to throw an exception?
// test('write() - throws when package.json is missing', async (t) => {
//   mock(fixtures.emptyFile);

//   try {
//     await write(fixtures.npmInit2)
//     console.log(await read());
//   } catch(e) {
//     t.pass('should throw an exception');
//     t.equal(e.message, 'ERR_CONFIG: failed to write to package.json', 'should have the correct message');
//   }

//   mock.restore();
//   t.end();
// });

test('write(pkg) - write package.json contents', async (t) => {
  mock(fixtures.emptyConfig);

  try {
    await write(fixtures.npmInit2);
    // TODO: assert package contents
  } catch {
    t.fail();
  }

  mock.restore();
  t.end();
});

test('exists(pkg) - throw if config already exists', (t) => {
  const pkg = JSON.parse(fixtures.ujpmInitData);
  try {
    exists(pkg);
  } catch(e) {
    t.pass('should throw an exception');
    t.equal(e.message, `ERR_CONFIG: Init failed, 'ujpmDependencies' already exists in package.json`, 'should have the correct message');
  }

  t.end();
});

test('exists(pkg) - no-op if the config has not been created yet', (t) => {
  const pkg = JSON.parse(fixtures.emptyConfigData);
  const actual = exists(pkg);

  t.isEqual(actual, pkg, 'should no-op pass the package');

  t.end();
});

test('isInitialized(pkg) - true if the config has been initialized', (t) => {
  const pkg = JSON.parse(fixtures.ujpmInitData);
  const actual = isInitialized(pkg);

  t.isEqual(actual, true, 'should return true if it has already been initalized');

  t.end();
});

test('isInitialized(pkg) - false if the config has not been initialized', (t) => {
  const pkg = JSON.parse(fixtures.emptyConfigData);
  const actual = isInitialized(pkg);

  t.isEqual(actual, false, 'should return false if it has not been initalized');

  t.end();
});

test('isInstalled(pkg) - false if the package has not been installed', (t) => {
  const pkg = JSON.parse(fixtures.ujpmInitData);
  const actual = isInstalled(pkg, "wc-markdown");

  t.isEqual(actual, false, 'should return false if it has not been installed');

  t.end();
});

test('isInstalled(pkg) - true if the package has not been installed', (t) => {
  const pkg = JSON.parse(fixtures.ujpmPackageExistsData);
  const actual = isInstalled(pkg, "wc-markdown");

  t.isEqual(actual, true, 'should return true if it has not been installed');

  t.end();
});
