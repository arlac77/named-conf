/* global describe, it, xit */
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const {
  NamedParser
} = require('../dist/parser');

describe('read', () => {
  const parser = new NamedParser();
  it('empty', () => assert.deepEqual(parser.parse('{ }').value, {}));
});
