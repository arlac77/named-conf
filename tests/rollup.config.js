export default {
  input: 'tests/simple-test.js',
  external: ['ava', 'pratt-parser'],

  plugins: [],

  output: {
    file: 'build/test-bundle.js',
    format: 'cjs',
    sourcemap: true,
    interop: false
  }
};
