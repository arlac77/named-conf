/* global describe, it, xit */
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const parser = require('../dist/parser').parser;

describe('read', () => {
  it('empty', () => assert.equal(parser('{ }'), {}));
});
