import clear from 'rollup-plugin-clear';
import esbuild from 'rollup-plugin-esbuild';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';

const useBabelPlugin = function(options = {}) {
  return getBabelOutputPlugin({ presets: [['@babel/preset-env', options]] });
} 

const esbuildPlugin = esbuild({
  sourceMap: true,
  target: 'es2015'
});

const esbuildMinifer = (options) => {
  const { renderChunk } = esbuild(options)

  return {
    name: 'esbuild-minifer',
    renderChunk,
  }
}

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'es',
        target: 'es2015',
        plugins: [ useBabelPlugin() ]
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        plugins: [ useBabelPlugin() ]
      },
      {
        file: `dist/index.umd.js`,
        name: 'json2ts',
        extend: true,
        plugins: [ useBabelPlugin({ modules: 'umd' }), ]
      },
      {
        file: `dist/index.umd.min.js`,
        name: 'json2ts',
        extend: true,
        plugins: [
          useBabelPlugin({ modules: 'umd' }),
          esbuildMinifer({
            minify: true,
          }),
        ],
      },
    ],
    plugins: [
      clear({
        targets: ['./dist']
      }),
      esbuildPlugin
    ]
  },
  {
    input: "./src/index.ts",
    output: [{ file: "types/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
  {
    input: "./src/parse.ts",
    output: [{ file: "types/parse.d.ts", format: "es" }],
    plugins: [dts()],
  },
  {
    input: "./src/transform.ts",
    output: [{ file: "types/transform.d.ts", format: "es" }],
    plugins: [dts()],
  }
]