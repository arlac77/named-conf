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

  it('one slot', () => assert.deepEqual(parser.parse('{ type master ; }').value, {
    type: 'master'
  }));
  it.only('two slots', () => assert.deepEqual(parser.parse(
    '{ type master ; file "example.com.zone"; allow-update { none ; };}').value, {
    type: 'master',
    file: 'example.com.zone',
    'allow-update': {
      none: undefined
    }
  }));

});
