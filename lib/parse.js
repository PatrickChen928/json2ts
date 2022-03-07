"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
function getCursor(context) {
    const { offset, column, line } = context;
    return { offset, column, line };
}
function getLoc(context, start, end) {
    end = end || getCursor(context);
    return {
        start,
        end,
        source: context.originalSource.slice(start.offset, end.offset)
    };
}
function createContext(content, options) {
    return {
        options,
        column: 1,
        line: 1,
        offset: 0,
        originalSource: content,
        source: content
    };
}
function createRoot(nodes) {
    return {
        type: 0 /* ROOT */,
        children: nodes
    };
}
function isEnd(context) {
    return !context.source;
}
function advancePositionWithMutation(pos, source, numberOfCharacters = source.length) {
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
function advanceBy(context, numberOfCharacters) {
    const source = context.source;
    advancePositionWithMutation(context, source, numberOfCharacters);
    context.source = source.slice(numberOfCharacters);
}
function advanceSpaces(context) {
    const match = /^[\t\r\n\f ]+/.exec(context.source);
    if (match && match[0]) {
        advanceBy(context, match[0].length);
    }
}
function parseData(context) {
    let key = parseKey(context);
    let { value, type } = parseValue(context);
    advanceSpaces(context);
    if (context.source[0] === ',') {
        advanceBy(context, 1);
        advanceSpaces(context);
    }
    return { key, value, type, loc: getCursor(context) };
}
function parseChildren(context) {
    const nodes = [];
    while (!isEnd(context)) {
        let node = null;
        const s = context.source;
        // 新的一行
        if (s[0] === '{') {
            advanceBy(context, 1);
            nodes.push(parseData(context));
        }
        else if (s[0] === '}') {
            advanceBy(context, 1);
            advanceSpaces(context);
            return nodes;
        }
        else {
            // console.log(context)
            nodes.push(parseData(context));
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
function parseKey(context) {
    advanceSpaces(context);
    const match = /^"([a-z0-9][^"]*)/i.exec(context.source);
    advanceBy(context, match[0].length + 1);
    advanceSpaces(context);
    if (context.source[0] === ':') {
        advanceBy(context, 1);
        advanceSpaces(context);
    }
    else {
        console.error('key will with :');
    }
    return match[1];
}
function parseNumber(context) {
    const match = /^([0-9]*)/i.exec(context.source);
    advanceBy(context, match[0].length);
    return match[1];
}
function parseString(context) {
    const match = /^["|']([^"|']*)/i.exec(context.source);
    advanceBy(context, match[0].length);
    advanceBy(context, 1);
    return match[1];
}
function parseValue(context) {
    let value = null;
    let type = null;
    let code = context.source[0];
    if (/^[0-9]/.test(code)) {
        value = parseNumber(context);
        type = 'Number';
    }
    else if (code === '"' || code === '\'') {
        value = parseString(context);
        type = 'String';
        advanceBy(context, 1);
    }
    else if (code === '[') {
        value = parseChildren(context);
        advanceSpaces(context);
        advanceBy(context, 1);
        type = 'Array';
    }
    else if (code === '{') {
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
    };
}
function parseArray(context) {
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
    }
    else if (s === '{') {
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
function parse(input, options) {
    const context = createContext(input, options);
    return createRoot(parseChildren(context));
}
exports.parse = parse;
