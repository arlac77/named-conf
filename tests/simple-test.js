import test from 'ava';

import {
  NamedParser
}
from '../src/parser';

test('read empty', t => {
  const parser = new NamedParser();
  t.deepEqual(parser.parse('{ }').value, {});
});

test('read one slot', t => {
  const parser = new NamedParser();
  t.deepEqual(parser.parse('{ type master ; }').value, {
    type: 'master'
  });
});

test('read two slots', t => {
  const parser = new NamedParser();
  t.deepEqual(parser.parse(
    `{ type master ; file "example.com.zone"; allow-update { none ; }; forwarders {
    		10.0.0.1;
    	};
}`
  ).value, {
    type: 'master',
    file: 'example.com.zone',
    'allow-update': {
      none: undefined
    },
    forwarders: {
      '10.0.0.1': undefined
    }
  });
});
