/* global describe, it, xit */
/* jslint node: true, esnext: true */
'use strict';

import {
  createGrammar
}
from 'pratt-parser';


function parser() {
  return createGrammar({
    identifier(value, properties, context) {
        console.log(`create identifier: ${value} ${context}`);
      },
      prefix: {},
      infix: {
        ',': {},
        '{': {},
        '}': {}
      }
  });
}

export {
  parser
};
