import type { AstChildNode, CompileOptions } from './types';
import { isArray, isObject, upperCaseFirstChat, stringifyObjAndSort } from './utils';

class Generate {
  private ast: AstChildNode
  private options: CompileOptions;
  private vars: string;
  private i: number;
  private level: number;
  private prefix: string;
  private suffix: string;
  private objValueMap: Map<string, string>;

  constructor(ast: AstChildNode, options: CompileOptions) {
    this.ast = ast;
    this.options = options;
    this.prefix = options.typePrefix;
    this.suffix = options.typeSuffix;
    this.vars = '';
    this.i = -1;
    this.level = 1;
    this.objValueMap = new Map();
  }

  beginGen() {
    const originName = this.genName('Result');
    const typeValue = this.ast.typeValue!;
    const code = this.gen(typeValue);
    return `${this.vars}type ${originName} = ${code}`;
  }

  gen(typeValue: Record<string, string | Object> | Array<string | Object>) {
    let code = `{\n`;
    for (const key in typeValue) {
      const type = typeValue[key];
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
      code += '\n';
    }
    if (!this.options.splitType) {
      code += this.genFormatChat(this.level - 1);
    }
    code += '}'
    return code;
  }

  genName(key: string) {
    this.i++;
    return `${this.prefix}${upperCaseFirstChat(key)}$${this.i}${this.suffix}`
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

  genObjcet(key:string, type: Record<string, string | Object>) {
    let code = '';
    this.level++;
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
    this.vars += `type ${varName} = ${objType};\n\n`;
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

export function generate(ast: AstChildNode, options: CompileOptions) {
  return new Generate(ast, options).beginGen();
}