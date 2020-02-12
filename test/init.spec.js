import test from 'tape';
import mock from 'mock-fs';
import fs from 'fs';
import ujpm from '../src/ujpm.js';
import { MockConsole } from 'mock-console-es';
import { createRequire } from 'module';

const logging = new MockConsole();
const require = createRequire(import.meta.url);
const fixtures = require('./__test__/init.json');

test('Init - throw if package.json does not exist', async (t) => {
  mock(fixtures.emptyFile);
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
    logging.restore();

    const result = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const expect = JSON.parse(fixtures.ujpmInitData);

    t.deepEqual(expect, result, 'should have the correct package.json contents');
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
    logging.restore();

    const result = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const expect = JSON.parse(fixtures.ujpmInitData2);

    t.deepEqual(expect, result);
  } catch {
    t.fail('should not throw an exception during initialization');
  }

  t.end();
});
