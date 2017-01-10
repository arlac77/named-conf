/* global describe, it, xit */
/* jslint node: true, esnext: true */
'use strict';

import {
  Parser, Tokenizer, IdentifierToken
}
from 'pratt-parser';

function Value(value) {
  return Object.create(null, {
    value: {
      value: value
    }
  });
}

class NamedTokenizer extends Tokenizer {

  makeIdentifier(chunk, offset, context, contextProperties) {
    let i = offset;
    i += 1;
    for (;;) {
      const c = chunk[i];
      if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9') || c === '_' || c === '-') {
        i += 1;
      } else {
        break;
      }
    }

    contextProperties.value = {
      value: chunk.substring(offset, i)
    };
    return [Object.create(IdentifierToken, contextProperties), i - offset];
  }
}

const grammar = {
  common: {
    identifier: {
      regex: /([A-Z_][A-Za-z_\-]+)/
    },
    ipv4address: {
      regex: /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/
    },
    ipv6address: {
      regex: /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/
    }
  },
  prefix: {
    '{': {
      nud(grammar, left) {
        const object = {};

        if (grammar.token.value !== '}') {
          do {
            const key = grammar.expression(0).value;

            if (grammar.token.value === ';') {
              grammar.advance(';');
              object[key] = undefined;
              break;
            }

            const value = grammar.expression(0).value;

            object[key] = value;
            grammar.advance(';');
          }
          while (grammar.token.value !== '}');
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
};

/**
 * https://www.centos.org/docs/5/html/Deployment_Guide-en-US/s1-bind-namedconf.html
 */
export class NamedParser extends Parser {
  constructor() {
    super(grammar, {
      tokenizer: new NamedTokenizer(grammar)
    });
  }
}
