/* global describe, it, xit */
/* jslint node: true, esnext: true */
'use strict';

import {
  create
}
from 'pratt-parser';


function Value(value) {
  return Object.create(null, {
    value: {
      value: value
    }
  });
}


function parser() {
  return create({
    identifier(value, properties, context) {
        if (value === 'true') {
          properties.type.value = 'constant';
          properties.value.value = true;
        } else if (value === 'false') {
          properties.type.value = 'constant';
          properties.value.value = false;
        }
      },
      prefix: {
        '[': {
          nud(grammar, left) {
            const values = [];

            if (grammar.token.value !== ']') {
              while (true) {
                values.push(grammar.expression(0).value);

                if (grammar.token.value !== ',') {
                  break;
                }
                grammar.advance(',');
              }
            }
            grammar.advance(']');
            return Value(values);
          }
        },
        '{': {
          nud(grammar, left) {
            const object = {};

            if (grammar.token.value !== '}') {
              while (true) {
                const key = grammar.expression(0).value;

                if (grammar.token.value !== ':') {
                  break;
                }
                grammar.advance(':');

                const value = grammar.expression(0).value;
                object[key] = value;
                if (grammar.token.value === '}') {
                  break;
                }
                grammar.advance(',');
              }
            }
            grammar.advance('}');
            return Value(object);
          }
        }
      },
      infix: {
        ',': {},
        ':': {},
        '}': {},
        ']': {}
      }
  });
}

export {
  parser
};
