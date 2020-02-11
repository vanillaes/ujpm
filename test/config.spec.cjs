const test = require('tape');
const mock = require('mock-fs');
const fixtures = require('./config.fixtures.json');
const CONFIG = require('../src/util/config.js');

test('CONFIG.read() - throw when package.json is missing', async (t) => {
  mock(fixtures.emptyFile);

  try {
    await CONFIG.read();
  } catch(e) {
    t.pass('should throw an exception');
    t.equal(e.message, `ERR_CONFIG: package.json not found, is this a package?`, 'should have the correct message');
  }

  mock.restore();
  t.end();
});

test('CONFIG.read() - read package.json contents', async (t) => {
  mock(fixtures.npmInit);

  const pkg = await CONFIG.read();
  t.deepEqual(pkg, { name: "tmp"}, 'should read the package contents')

  mock.restore();
  t.end();
});

// TODO: How can this be made to throw an exception?
// test('CONFIG.write() - throws when package.json is missing', async (t) => {
//   mock(fixtures.emptyFile);

//   try {
//     await CONFIG.write(fixtures.npmInit2)
//     console.log(await CONFIG.read());
//   } catch(e) {
//     t.pass('should throw an exception');
//     t.equal(e.message, 'ERR_CONFIG: failed to write to package.json', 'should have the correct message');
//   }

//   mock.restore();
//   t.end();
// });

test('CONFIG.write(pkg) - write package.json contents', async (t) => {
  mock(fixtures.emptyConfig);

  try {
    await CONFIG.write(fixtures.npmInit2);
    // TODO: assert package contents
  } catch {
    t.fail();
  }

  mock.restore();
  t.end();
});

test('CONFIG.exists(pkg) - throw if config already exists', (t) => {
  const pkg = JSON.parse(fixtures.ujpmInitData);
  try {
    CONFIG.exists(pkg);
  } catch(e) {
    t.pass('should throw an exception');
    t.equal(e.message, `ERR_CONFIG: Init failed, 'ujpmDependencies' already exists in package.json`, 'should have the correct message');
  }

  t.end();
});

test('CONFIG.exists(pkg) - no-op if the config has not been created yet', (t) => {
  const pkg = JSON.parse(fixtures.emptyConfigData);
  const exists = CONFIG.exists(pkg);
  t.isEqual(exists, pkg, 'should no-op pass the package');

  t.end();
});

test('CONFIG.isInitialized(pkg) - true if the config has been initialized', (t) => {
  const pkg = JSON.parse(fixtures.ujpmInitData);
  const exists = CONFIG.isInitialized(pkg);
  t.isEqual(exists, true, 'should return true if it has already been initalized');

  t.end();
});

test('CONFIG.isInitialized(pkg) - false if the config has not been initialized', (t) => {
  const pkg = JSON.parse(fixtures.emptyConfigData);
  const exists = CONFIG.isInitialized(pkg);
  t.isEqual(exists, false, 'should return false if it has not been initalized');

  t.end();
});

test('CONFIG.isInstalled(pkg) - false if the package has not been installed', (t) => {
  const pkg = JSON.parse(fixtures.ujpmInitData);
  const exists = CONFIG.isInstalled(pkg, "wc-markdown");
  t.isEqual(exists, false, 'should return false if it has not been installed');

  t.end();
});

test('CONFIG.isInstalled(pkg) - true if the package has not been installed', (t) => {
  const pkg = JSON.parse(fixtures.ujpmPackageExistsData);
  const exists = CONFIG.isInstalled(pkg, "wc-markdown");
  t.isEqual(exists, true, 'should return true if it has not been installed');

  t.end();
});
