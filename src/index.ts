import { parse } from './parse';
import { transform, traverser } from './transform';
import { generate } from './codegen';

import type { CompileOptions } from './types';


function initOptions(options: CompileOptions): CompileOptions {
  const defaultOptions = {
    spiltType: true,
    parseArray: false,
    required: true,
    semicolon: false
  };
  Object.assign(defaultOptions, options)
  return defaultOptions;
}

export {
  traverser,
  parse,
  json2ts
};

export default function json2ts(code: string, options: CompileOptions = {}) {
  const finalOptions = initOptions(options);
  const ast = parse(code, finalOptions);
  // const 
  transform(ast, finalOptions);
  return generate(ast, finalOptions);
}