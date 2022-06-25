import { parse } from './parse';
import { transform, traverser } from './transform';
import { generate } from './codegen';

import type { CompileOptions } from './types';


function initOptions(options: CompileOptions): CompileOptions {
  const defaultOptions: CompileOptions = {
    splitType: true,
    parseArray: false,
    required: true,
    semicolon: false,
    typeSuffix: 'Type',
    typePrefix: '',
    indent: 2,
    comment: false,
    optimizeArrayOptional: false,
    genType: 'type',
  };
  Object.assign(defaultOptions, options)
  return defaultOptions;
}

export {
  traverser,
  parse,
  json2ts
};

export * from './contant';

export default function json2ts(code: string, options: CompileOptions = {}) {
  const finalOptions = initOptions(options);
  const ast = parse(code, finalOptions);
  // const 
  transform(ast, finalOptions);
  return generate(ast, finalOptions);
}