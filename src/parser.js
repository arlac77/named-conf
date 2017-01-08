/* global describe, it, xit */
/* jslint node: true, esnext: true */
'use strict';

import {
  Parser, Tokenizer
}
from 'pratt-parser';

function Value(value) {
  return Object.create(null, {
    value: {
      value: value
    }
  });
}

NamedTokenizer extens Tokenizer {

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

		const value = chunk.substring(offset, i);

		contextProperties.value = {
			value: value
		};
		this._identifier(value, contextProperties, context);
		return [Object.create(IdentifierToken, contextProperties), i - offset];
	}
}

const grammar = {
      identifier(value, properties, context) {},
        prefix: {
          '{': {
            nud(grammar, left) {
              const object = {};

              if (grammar.token.value !== '}') {
                do {
                  const key = grammar.expression(0).value;

                  /*
                  if (grammar.token.value === ';') {
                    object[key] = undefined;
                    break;
                  }*/

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
    super(grammar,{ tokenizer : new NamedTokenizer(grammar) });
  }
}
