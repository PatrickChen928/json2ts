import type { ParserContext, Position, LocType, AstChildNode, CompileOptions } from './types';
import { 
  ROOT_TYPE,
  ARRAY_TYPE, 
  STRING_TYPE, 
  NUMBER_TYPE, 
  NULL_TYPE,
  UNDEFINED_TYPE,
  BOOLEAN_TYPE,
  OBJECT_TYPE ,
  ROOT_KEY,
  ARRAY_ITEM, 
  COMMENT_TYPE, 
  LAST_COMMENT, 
  NEXT_COMMENT,
  ARRAY_ERROR_MESSAGE,
  COMMENT_ERROR_MESSAGE,
  VALUE_ILLEGAL_ERROR_MESSAGE
} from './contant';

const NUMBER_REGX = /^[-|+]?([0-9]+\.?\d*)/;

function getCursor(context: ParserContext) {
  const { offset, column, line } = context;
  return { offset, column, line };
}

function getLoc(context: ParserContext, start: Position, end?: Position): LocType {
  end = end || getCursor(context);
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset)
  }
}

function createContext(content: string, options?: Record<string, unknown>): ParserContext {
  return {
    options,
    column: 1,
    line: 1,
    offset: 0,
    originalSource: content,
    source: content
  }
}

function createRoot(nodes: AstChildNode[]): AstChildNode {
  return {
    key: ROOT_KEY,
    type: ROOT_TYPE,
    value: nodes
  }
}

function isEnd(context: ParserContext) {
  return !context.source;
}


function advancePositionWithMutation(
  pos: Position, 
  source: string, 
  numberOfCharacters: number = source.length
) {
  let lineCount = 0;
  let lastNewLinePos = -1;
  for (let i = 0; i < numberOfCharacters; i++) {
    if (source.charCodeAt(i) === 10 /* newline char code */) {
      lineCount++;
      lastNewLinePos = i;
    }
  }
  pos.offset += numberOfCharacters;
  pos.line += lineCount;
  pos.column = 
    lastNewLinePos === -1 
      ? pos.column + numberOfCharacters
      : numberOfCharacters - lastNewLinePos;
}

function advanceBy(context: ParserContext, numberOfCharacters: number) {
  const source = context.source;
  advancePositionWithMutation(context, source, numberOfCharacters);
  context.source = source.slice(numberOfCharacters);
}

function advanceSpaces(context: ParserContext) {
  const match = /^[\t\r\n\f ]+/.exec(context.source);
  if (match && match[0]) {
    advanceBy(context, match[0].length);
  }
}

function parseData(context: ParserContext, keyName?: string) {
  advanceSpaces(context);
  const start = getCursor(context);
  let key = keyName || parseKey(context);
  // let value, type, loc;
  const { value, type } = parseValue(context);
  const loc = getLoc(context, start);
  // if (context.source.indexOf('//') === 0) {
  //   const cv = parseComment(context, lastLine);
  //   value = cv.value;
  //   type = cv.type;
  //   loc = cv.loc;
  //   key = cv.key;
  // } else {
  //   const { value: v, type: t } = parseValue(context);
  //   value = v;
  //   type = t;
  //   loc = getLoc(context, start);
  // }
  advanceSpaces(context);
  if (context.source[0] === ',') {
    advanceBy(context, 1);
    advanceSpaces(context);
  }
  return {key, value, type, loc: loc};
}
/**
 * 解析 {} 里面的内容
 * @param context 
 * @returns 
 */
function parseChildren(context: ParserContext) {
  const nodes: AstChildNode[] = [];
  while(!isEnd(context)) {
    advanceSpaces(context);
    const s = context.source;
    // 新的一行
    if (s[0] === '{') {
      advanceBy(context, 1);
    } else if (s[0] === '}') {
      advanceBy(context, 1);
      advanceSpaces(context);
      return nodes;
    } else if (s[0] === '/') {
      if (s[1] === '/') {
        const lastNode = nodes[nodes.length - 1];
        let lastLine = -1;
        if (lastNode) {
          lastLine = lastNode.loc.end.line;
        }
        nodes.push(parseComment(context, lastLine));
        advanceSpaces(context);
      } else {
        throw new Error(COMMENT_ERROR_MESSAGE)
      }
    } else {
      nodes.push(parseData(context));
    }
  }
  return nodes;
}

function parseKey(context: ParserContext) {
  const s = context.source[0];
  let match = [];
  // ([^:]*)
  // "xxx" 类型的key
  if (s === '"') {
    match = /^"(.[^"]*)/i.exec(context.source);
  } else if (s === `'`) {
    // 'xxx' 类型的key
    match = /^'(.[^']*)/i.exec(context.source);
  } else {
    // xxx:  类型的key
    match = /(.[^:]*)/i.exec(context.source);
    match[1] = match[1].trim();
  }
  // 去掉末尾的" 或 ' 或 :
  advanceBy(context, match[0].length + 1);
  advanceSpaces(context);
  // 去掉 " 和 ' 后面的冒号
  if (context.source[0] === ':') {
    advanceBy(context, 1);
    advanceSpaces(context);
  }
  return match[1];
}

function parseNumber(context: ParserContext) {
  const match = NUMBER_REGX.exec(context.source);
  advanceBy(context, match[0].length);
  return match[1];
}

function parseString(context: ParserContext) {
  const match = /^["|']([^"|']*)/i.exec(context.source);
  advanceBy(context, match[0].length + 1);
  return match[1];
}

function parseNull(context: ParserContext) {
  advanceBy(context, 4);
  return 'null';
}

function parseBoolean(context: ParserContext) {
  const match = /^(true|false)/i.exec(context.source);
  advanceBy(context, match[0].length);
  return match[1];
}

function parseUndefined(context: ParserContext) {
  advanceBy(context, 9);
  return 'undefined';
}

function parseValue(context: ParserContext) {
  let value = null;
  let type = null;
  let code = context.source[0];
  if (NUMBER_REGX.test(context.source)) {
    value = parseNumber(context);
    type = NUMBER_TYPE;
  } else if (code === '"' || code === '\'') {
    value = parseString(context);
    type = STRING_TYPE;
  } else if (code === '[') {
    advanceBy(context, 1);
    value = parseArray(context);
    type = ARRAY_TYPE;
  } else if (code === '{') {
    value = parseChildren(context);
    type = OBJECT_TYPE;
  } else if (context.source.indexOf('null') === 0) {
    value = parseNull(context);
    type = NULL_TYPE;
  } else if (context.source.indexOf('true') === 0 || context.source.indexOf('false') === 0) {
    value = parseBoolean(context);
    type = BOOLEAN_TYPE;
  } else if (context.source.indexOf('undefined') === 0) {
    value = parseUndefined(context);
    type = UNDEFINED_TYPE;
  } else {
    throw new Error(VALUE_ILLEGAL_ERROR_MESSAGE)
  }
  return {
    value,
    type
  }
}

function parseArray(context: ParserContext) {
  const nodes = [];
  let lastLine = getCursor(context).line;
  advanceSpaces(context);
  while(!isEnd(context)) {
    const s = context.source[0];
    if (s === ']') {
      advanceBy(context, 1);
      return nodes;
    }
    if (s === '}' || s === ':') {
      throw new Error(ARRAY_ERROR_MESSAGE);
    }
    // array item 的注释
    if (context.source.indexOf('//') === 0) {
      const cv = parseComment(context, lastLine);
      nodes.push(cv);
      // 这里不需要重置lastLine， 因为如果下一个还是注释，肯定是next_comment，
      advanceSpaces(context);
    } else {
      const itemValue = parseData(context, ARRAY_ITEM);
      // 缓存上一个node的注释
      lastLine = itemValue.loc.end.line;
      nodes.push(itemValue);
    }
  }
  throw new Error(ARRAY_ERROR_MESSAGE);
}

function parseComment(context: ParserContext, lastLine: number) {
  const currLine = getCursor(context).line;
  const key = lastLine === currLine ? LAST_COMMENT : NEXT_COMMENT;
  const match = /^\/\/\s*(.[^\t\n\r\f]*)/i.exec(context.source);
  const start = getCursor(context);
  const comment = match[1];
  advanceBy(context, match[0].length);
  return {key, value: comment, type: COMMENT_TYPE, loc: getLoc(context, start)};
}

/**
 * parse to ast 
 * @param input 
 * @param options 
 * @returns ast
 */
 export function parse(input: string, options?: CompileOptions): AstChildNode {
  const context = createContext(input, options);
  return createRoot(parseChildren(context));
}