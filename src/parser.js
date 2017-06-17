import {
  Parser, IdentifierToken, NumberToken, WhiteSpaceToken,
  StringToken
}
from 'pratt-parser';

function Value(value) {
  return Object.create(null, {
    value: {
      value
    }
  });
}

const grammar = {
  tokens: [
    StringToken,
    WhiteSpaceToken,
    Object.create(NumberToken, {
      registerWithinTokenizer: {
        value(tokenizer) {
          for (const c of '012') {
            tokenizer.maxTokenLengthForFirstChar[c] = 1;
            tokenizer.registeredTokens[c] = this;
          }
        }
      },

      type: {
        value: 'ip-address'
      },
      parseString: {
        value(pp) {
          const str = pp.chunk.substring(pp.offset);
          const m = str.match(/([0-9\.]+)/);
          const value = m[1];

          const properties = pp.properties;
          properties.value = {
            value
          };

          pp.offset += value.length;
          return Object.create(this, properties);
        }
      }
    }), Object.create(IdentifierToken, {
      parseString: {
        value(pp) {
          let i = pp.offset + 1;
          for (;;) {
            const c = pp.chunk[i];
            if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
              (c >= '0' && c <= '9') || c === '_' || c === '-') {
              i += 1;
            } else {
              break;
            }
          }
          const value = pp.chunk.substring(pp.offset, i);
          const properties = pp.properties;

          if (value === 'true') {
            properties.value = {
              value: true
            };
          } else if (value === 'false') {
            properties.value = {
              value: false
            };
          } else {
            properties.value = {
              value
            };
          }

          pp.offset = i;
          return Object.create(this, properties);
        }
      }
    })
  ],
  prefix: {
    '{': {
      nud(grammar) {
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
    super(grammar);
  }
}
