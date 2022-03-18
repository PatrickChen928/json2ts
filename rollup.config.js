// const configs = [];
// output.push({
//   file: `packages/${name}/dist/${fn}.mjs`,
//   format: 'es',
// });
import esbuild from 'rollup-plugin-esbuild';
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

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.mjs',
      format: 'es',
      target: 'es2015'
      // plugins: [
      //   babel({
      //     presets: [
      //       [
      //         '@babel/env',
      //         {
      //           useBuiltIns: 'usage',
      //           corejs: 2,
      //           bugfixes: true,
      //         },
      //       ],
      //     ],
      //     plugins: ['@babel/plugin-proposal-class-properties'],
      //     babelrc: false,
      //     exclude: [/\/core-js\//]
      //   })
      // ]
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      file: `dist/index.iife.js`,
      format: 'iife',
      name: 'json2ts',
      extend: true,
    },
    {
      file: `dist/index.iife.min.js`,
      format: 'iife',
      name: 'json2ts',
      extend: true,
      plugins: [
        esbuildMinifer({
          minify: true,
        }),
      ],
    },
  ],

  plugins: [
    esbuildPlugin
  ]
}