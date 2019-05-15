const test = require('tape');
const mock = require('mock-fs');
const fs = require('fs');
const fixtures = require('./init.fixtures.json');
const fpm = require('../src/fpm');

const logger = {
  log: null,
  disable: () => {
    this.log = console.log; 
    console.log = msg => {};
  },
  enable: () => {
    console.log = this.log;
  }
}

test('Init - throw if package.json does not exist', async (t) => {
  mock(fixtures.emptyFile)
  t.plan(1);

  try {
    await fpm.init();
  } catch {
    t.pass();
  }

  mock.restore();
  t.end();
});

test('Init - by default should init with a generic config', async (t) => {
  mock(fixtures.emptyConfig);

  try {
    logger.disable();
    await fpm.init();
    logger.enable();
    const result = fs.readFileSync('package.json', 'utf-8');
    const expect = fixtures.fpmInitData;
    t.equals(expect, result);
  } catch (e) {
    console.log(e);
    t.fail();
  }

  t.end();
});

test('Init - supplied a target should init with the target prop set', async (t) => {
  mock(fixtures.emptyConfig);

  try {
    logger.disable();
    await fpm.init('vendor');
    logger.enable();
    const result = fs.readFileSync('package.json', 'utf-8');
    const expect = fixtures.fpmInitData2;
    t.equals(expect, result);
  } catch (e) {
    console.log(e);
    t.fail();
  }

  t.end();
});
