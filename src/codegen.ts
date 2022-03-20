import type { AstChildNode, CompileOptions } from './types';
import { isArray, isObject } from './utils';

class Generate {
  private ast: AstChildNode
  private options: CompileOptions;

  constructor(ast: AstChildNode, options: CompileOptions) {
    this.ast = ast;
    this.options = options;
  }

  beginGen() {
    const typeValue = this.ast.typeValue!;
    let code = ``;
    code += `{`;
    code += this.gen(typeValue);
    code += `}`;
    console.log(code);
    return code;
  }

  gen(typeValue: Record<string, string | Object> | Array<string | Object>) {
    let code = '';
    for (let key in typeValue) {
      const type = typeValue[key];
      code += this.genKey(key);
      if (isObject(type)) {
        code += this.gen(type);
      } else if (isArray(type)) {
        code += this.options.parseArray ? this.genArray(type) : 'Array<any>';
      } else {
        code += type;
      }
      if (this.options.semicolon) {
        code += ';';
      }
    }
    return code;
  }

  genKey(key: string) {
    return `${key}${this.options.required ? ':' : '?:'}`;
  }

  genArray(types) {
    let code = ``;
    let arr = new Set();
    types.forEach(type => {
      if (isArray(type)) {
        code += this.genArray(type);
      } if (isObject(type)) {
        code += this.gen(type);
      } else {
        arr.add(type);
      }
    })
    return 
  }
}

export function generate(ast: AstChildNode, options: CompileOptions) {
  return new Generate(ast, options).beginGen();
}