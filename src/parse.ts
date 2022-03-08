import { ARRAY_ITEM } from './contant';

const enum NodeTypes {
  ROOT,
  KEY,
  VALUE,
  COMMENT,
}

const enum ValueTypes { 
  STRING,
  ARRAY,
  OBJECT
}

interface Position {
  offset: number // from start of file
  line: number
  column: number
}

interface ParserContext {
  options: Record<string, unknown>
  readonly originalSource: string
  source: string
  offset: number
  line: number
  column: number
}

type AstChildNode = {
  // type: '',
  // loc
  // value: {
  //   content: 
  //   type: 
  // }
}

function getCursor(context: ParserContext) {
  const { offset, column, line } = context;
  return { offset, column, line };
}

function getLoc(context: ParserContext, start: Position, end?: Position) {
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

function createRoot(nodes) {
  return {
    type: NodeTypes.ROOT,
    children: nodes
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
  let start = getCursor(context);
  let key = keyName || parseKey(context);
  let { value, type } = parseValue(context);
  advanceSpaces(context);
  if (context.source[0] === ',') {
    advanceBy(context, 1);
    advanceSpaces(context);
  }
  return {key, value, type, loc: getLoc(context, start)};
}

function parseChildren(context: ParserContext) {
  const nodes = [];
  while(!isEnd(context)) {
    const s = context.source;
    // 新的一行
    if (s[0] === '{') {
      advanceBy(context, 1);
      nodes.push(parseData(context));
    } else if (s[0] === '}') {
      advanceBy(context, 1);
      advanceSpaces(context);
      return nodes;
    } else {
      nodes.push(parseData(context));
    }
  }
  return nodes;
}

function parseKey(context: ParserContext) {
  const match = /^"([a-z0-9][^"]*)/i.exec(context.source);
  advanceBy(context, match[0].length + 1);
  advanceSpaces(context);
  if (context.source[0] === ':') {
    advanceBy(context, 1);
    advanceSpaces(context);
  } else {
    console.error('key will with :');
  }
  return match[1];
}

function parseNumber(context: ParserContext) {
  const match = /^([0-9]*)/i.exec(context.source);
  advanceBy(context, match[0].length);
  return match[1];
}

function parseString(context: ParserContext) {
  const match = /^["|']([^"|']*)/i.exec(context.source);
  advanceBy(context, match[0].length + 1);
  return match[1];
}

function parseValue(context: ParserContext) {
  let value = null;
  let type = null;
  let code = context.source[0];
  if (/^[0-9]/.test(code)) {
    value = parseNumber(context);
    type = 'Number';
  } else if (code === '"' || code === '\'') {
    value = parseString(context);
    type = 'String';
  } else if (code === '[') {
    advanceBy(context, 1);
    value = parseArray(context);
    type = 'Array';
  } else if (code === '{') {
    value = parseChildren(context);
    type = 'Object';
  }
  advanceSpaces(context);
  if (context.source[0] === ',') {
    advanceBy(context, 1);
    advanceSpaces(context);
  }
  return {
    value,
    type
  }
}

function parseArray(context: ParserContext) {
  const nodes = [];
  while(!isEnd(context)) {
    nodes.push(parseData(context, ARRAY_ITEM))
    if (context.source[0] === ']') {
      advanceBy(context, 1);
      return nodes;
    }
  }
  return nodes;
}

/**
 * to ast 
 * {a: 'a' // a, b: []} 
 * => 
 * {type: 0, children: [
 *  {
 *    name: 'a', 
 *    comment: '',
 *    type: 'string'
 *    value: 'a'
 *  },
 *  {
 *    name: 'b', 
 *    comment: '',
 *    type: 'array'
 *    value: []
 *  }
 * ]}
 * 
 * @param input 
 * @param options 
 * @returns 
 */
 export function parse(input: string, options?: Record<string, unknown>) {
  const context = createContext(input, options);
  return createRoot(parseChildren(context));
}