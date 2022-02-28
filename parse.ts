
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
    children: nodes,
    // loc: getLoc(con)
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

function parseChildren(context: ParserContext) {
  const nodes = [];
  while(!isEnd(context)) {
    let node = null;
    const s = context.source;
    // 新的一行
    if (s[0] === '{' || s[0] === '}') {
      // node = 
      advanceBy(context, 1);
    } else if (s[0] === '"') {
      // parse key
      node = parseKey(context);
    } else if (s[0] === ':') {
      // 去掉分号
      advanceBy(context, 1);
      node = parseValue(context);
    }
    
    if (!node) {
      node = advanceSpaces(context);
    }
    if (node) {
      nodes.push(node);
    }
  }
  return nodes;
}

function parseKey(context: ParserContext) {
  const match = /^"([a-z0-9][^"]*)/i.exec(context.source);
  console.log(match);
  advanceBy(context, match[0].length + 1)
  return {
    type: NodeTypes.KEY,
    content: match[1],
    // loc: getLoc(context, )
  }
}

function parseValue(context: ParserContext) {
  let value = null;
  let type = null;
  // 去掉分号前的空格
  advanceSpaces(context);
  const s = context.source;
  if (s[0] === '"') {
    type = ValueTypes.STRING;
    const match = /^"(.[^"]*)/i.exec(context.source)
    value = match[1];
    advanceBy(context, match[0].length + 1);
  } else if (s[0] === '{') {
    type = ValueTypes.OBJECT;
    value = parseChildren(context);
  } else if (s[0] === '[') {
    type = ValueTypes.ARRAY;
    advanceBy(context, 1);
    value = parseArray(context);
  }
  return {
    type: NodeTypes.VALUE,
    content: {
      type,
      value
    }
  }
}

function parseArray(context: ParserContext) {
  advanceSpaces(context);
  const s = context.source;
  let nodes = [];
  if (s[0] === '"') {
    // ["a", "b"]
    const match = /^".[^"]*/.exec(s);
    if (match && match[0]) {
      nodes.push({
        type: 'string',
        content: match[1]
      });
      advanceBy(context, match[0].length);
    }
    console.log(match);
  } else if (s === '{') {
    nodes = parseChildren(context);
  }
  advanceSpaces(context);
  if (context.source[0] === ',') {
    advanceBy(context, 1);
    nodes = nodes.concat(parseArray(context));
  }
  advanceSpaces(context);
  return nodes;
}