const test = require('tape');
const mock = require('mock-fs');
const fs = require('fs');
const fixtures = require('./init.fixtures.json');
const ujpm = require('../src/ujpm');

const logging = {
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
    await ujpm.init();
  } catch {
    t.pass(' should throw an exception if package.json does not exist');
  }

  mock.restore();
  t.end();
});

test('Init - by default should init with a generic config', async (t) => {
  mock(fixtures.emptyConfig);

  try {
    logging.disable();
    await ujpm.init();
    logging.enable();
    const result = fs.readFileSync('package.json', 'utf-8');
    const expect = fixtures.ujpmInitData;
    t.equals(expect, result, 'should have the correct package.json contents');
  } catch {
    t.fail('should not throw an exception during initialization');
  }

  t.end();
});

test('Init - supplied a target should init with the target prop set', async (t) => {
  mock(fixtures.emptyConfig);

  try {
    logging.disable();
    await ujpm.init('vendor');
    logging.enable();
    const result = fs.readFileSync('package.json', 'utf-8');
    const expect = fixtures.ujpmInitData2;
    t.equals(expect, result);
  } catch {
    t.fail('should not throw an exception during initialization');
  }

  t.end();
});
