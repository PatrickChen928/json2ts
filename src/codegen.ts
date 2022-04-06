import type { TransformNodeType, CompileOptions } from './types';
import { isArray, isObject, upperCaseFirstChat, stringifyObjAndSort } from './utils';

class Generate {
  private ast: TransformNodeType
  private options: CompileOptions;
  private vars: string;
  private i: number;
  private j: number;
  private level: number;
  private prefix: string;
  private suffix: string;
  private objValueMap: Map<string, string>;

  constructor(ast: TransformNodeType, options: CompileOptions) {
    this.ast = ast;
    this.options = options;
    this.prefix = options.typePrefix;
    this.suffix = options.typeSuffix;
    this.vars = '';
    this.i = 0;
    this.j = -1;
    this.level = 1;
    this.objValueMap = new Map();
  }

  beginGen() {
    const originName = this.genName('Result');
    const typeValue = this.ast.typeValue!;
    const code = this.gen(typeValue);
    return `${this.vars}type ${originName} = ${code}${this.options.semicolon ? ';' : ''}\n`;
  }

  gen(typeValue: Record<string, string | Object> | Array<string | Object>) {
    let code = `{\n`;
    for (const key in typeValue) {
      const type = typeValue[key];
      if (this.options.comment === 'block') {
        code += this.genBlockComment(key);
      }
      code += this.genKey(key);
      if (isObject(type)) {
        code += this.genObjcet(key, type);
      } else if (isArray(type)) {
        code += this.options.parseArray ? this.genArray(key, type) : 'Array<any>';
      } else {
        code += type;
      }
      if (this.options.semicolon) {
        code += ';';
      }
      if (this.options.comment === 'inline') {
        code += this.genInlineComment(key);
      }
      code += '\n';
    }
    if (!this.options.splitType) {
      code += this.genFormatChat(this.level - 1);
    }
    code += '}'
    return code;
  }

  genName(key: string) {
    this.j++;
    return `${this.prefix}${upperCaseFirstChat(key)}$${this.j}${this.suffix}`
  }

  genKey(key: string) {
    return `${this.genFormatChat(this.level)}${key}${this.options.required ? ': ' : '?: '}`;
  }

  genFormatChat(level: number) {
    const indent = this.options.indent;
    if (this.options.splitType) {
      return ' '.repeat(indent);
    }
    return ' '.repeat(level * indent);
  }

  genInlineComment(key: string) {
    const name = key + this.i;
    const comments = this.ast.comments[name];
    if (comments && comments.length) {
      let code = ' // ';
      comments.forEach(comment => {
        code += comment + '; ';
      })
      code = code.substring(0, code.length - 2)
      return code;
    }
    return '';
  }

  genBlockComment(key: string) {
    let code = '';
    const name = key + this.i;
    const comments = this.ast.comments[name];
    if (comments && comments.length) {
      comments.forEach(comment => {
        code += this.genFormatChat(this.level) + '// ' + comment + '\n';
      })
    }
    return code;
  }

  genObjcet(key:string, type: Record<string, string | Object>) {
    let code = '';
    this.level++;
    this.i++;
    const objType = this.gen(type);
    if (this.options.splitType) {
      code += this.genObjectCodeWithVar(objType, key, type as Record<string, string>);
    } else {
      code += objType;
    }
    this.level--;
    return code;
  }

  genObjectCodeWithVar(objType: string, key: string, type: Record<string, string>) {
    const val = stringifyObjAndSort(type);
    if (this.objValueMap.has(val)) {
      return this.objValueMap.get(val);
    }
    const varName = this.genName(key);
    this.objValueMap.set(val, varName);
    this.vars += `type ${varName} = ${objType}${this.options.semicolon ? ';' : ''}\n\n`;
    return varName;
  }

  genArray(key: string, types: Array<any>) {
    let code = `Array< `;
    // 使用 set 过滤重复类型
    const arrTypes = new Set();
    types.forEach(type => {
      if (isArray(type)) {
        arrTypes.add(this.genArray(key, type));
      } if (isObject(type)) {
        arrTypes.add(this.genObjcet(key, type));
      } else {
        arrTypes.add(type);
      }
    });
    code += Array.from(arrTypes).join(' | ');
    code += ' >';
    return code;
  }
}

export function generate(ast: TransformNodeType, options: CompileOptions) {
  return new Generate(ast, options).beginGen();
}