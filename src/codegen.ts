import type { AstChildNode, CompileOptions } from './types';
import { isArray, isObject, upperCaseFirstChat } from './utils';

class Generate {
  private ast: AstChildNode
  private options: CompileOptions;
  private vars: string;
  private i: number;
  private prefix: string;
  private suffix: string;

  constructor(ast: AstChildNode, options: CompileOptions) {
    this.ast = ast;
    this.options = options;
    this.prefix = options.typePrefix || '';
    this.suffix = options.typeSuffix || 'Type';
    this.vars = '';
    this.i = 1;
  }

  beginGen() {
    const typeValue = this.ast.typeValue!;
    let code = ``;
    code += `{\n`;
    code += this.gen(typeValue);
    code += `}`;
    console.log(code);
    return `${this.vars}type ${this.prefix}Result$0${this.suffix} = ${code}`;
  }

  gen(typeValue: Record<string, string | Object> | Array<string | Object>) {
    let code = '';
    for (let key in typeValue) {
      const type = typeValue[key];
      code += this.genKey(key);
      if (isObject(type)) {
        const objType = this.gen(type);
        if (this.options.spiltType) {
          const varName = this.genName(key);
          this.vars += `type ${varName} = ${objType};\n `;
          this.i++;
          code += varName;
        } else {
          code += objType;
        }
      } else if (isArray(type)) {
        code += this.options.parseArray ? this.genArray(type) : 'Array<any>';
      } else {
        code += type;
      }
      if (this.options.semicolon) {
        code += ';';
      }
      code += '\n';
    }
    return code;
  }

  genName(key: string) {
    return `${this.prefix}${upperCaseFirstChat(key)}$${this.i}${this.suffix}`
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