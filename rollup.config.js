import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/hbs-commander.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/hbs-commander.esm.js',
      format: 'es',
    },
  ],
  plugins: [nodeResolve(), commonjs()],
  external: ['handlebars', 'fs', 'path'],
}
