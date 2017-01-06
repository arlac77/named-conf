/* global describe, it, xit */
/* jslint node: true, esnext: true */
'use strict';

import {
  Parser
}
from 'pratt-parser';

function Value(value) {
  return Object.create(null, {
    value: {
      value: value
    }
  });
}

/**
 * https://www.centos.org/docs/5/html/Deployment_Guide-en-US/s1-bind-namedconf.html
 */
export class NamedParser extends Parser {
  constructor() {
    super({
      identifier(value, properties, context) {
        },
        prefix: {
          '{': {
            nud(grammar, left) {
              const object = {};

              if (grammar.token.value !== '}') {
                while (true) {
                  const key = grammar.expression(0).value;
                  const value = grammar.expression(0).value;
                  object[key] = value;
                  if (grammar.token.value === '}') {
                    break;
                  }
                  grammar.advance(';');
                }
              }
              grammar.advance('}');
              return Value(object);
            }
          }
        },
        infix: {
          ';': {},
          '}': {}
        }
    });
  }
}
