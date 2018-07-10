import pkg from './package.json';

export default {
  plugins: [],

  output: {
    file: pkg.main,
    format: 'cjs',
    interop: false
  },

  external: ['pratt-parser'],
  input: pkg.module
};
