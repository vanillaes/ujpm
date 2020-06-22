import test from 'tape'
import mock from 'mock-fs'
import fs from 'fs'
import ujpm from '../src/ujpm.js'
import { MockConsole } from '@vanillaes/mock-console'
import { createRequire } from 'module'

const logging = new MockConsole()
const require = createRequire(import.meta.url)
const fixtures = require('./__test__/init.json')

test('Init - throw if package.json does not exist', async (t) => {
  mock({})
  t.plan(1)

  try {
    await ujpm.init()
  } catch (e) {
    t.pass('should throw an exception if package.json does not exist')
  }

  mock.restore()
  t.end()
})

test('Init - by default should init with a generic config', async (t) => {
  mock({
    'package.json': JSON.stringify(fixtures.emptyConfig)
  })

  try {
    logging.disable()
    await ujpm.init()
    logging.restore()

    const result = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    const expect = fixtures.ujpmInit

    t.deepEqual(expect, result, 'should have the correct package.json contents')
  } catch {
    t.fail('should not throw an exception during initialization')
  }

  t.end()
})
