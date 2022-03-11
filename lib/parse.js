"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const contant_1 = require("./contant");
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
function parseData(context, keyName) {
    advanceSpaces(context);
    const start = getCursor(context);
    const key = keyName || parseKey(context);
    const { value, type } = parseValue(context);
    const loc = getLoc(context, start);
    advanceSpaces(context);
    if (context.source[0] === ',') {
        advanceBy(context, 1);
        advanceSpaces(context);
    }
    return { key, value, type, loc: loc };
}
/**
 * 解析 {} 里面的内容
 * @param context
 * @returns
 */
function parseChildren(context) {
    const nodes = [];
    while (!isEnd(context)) {
        advanceSpaces(context);
        const s = context.source;
        // 新的一行
        if (s[0] === '{') {
            advanceBy(context, 1);
        }
        else if (s[0] === '}') {
            advanceBy(context, 1);
            advanceSpaces(context);
            return nodes;
        }
        else if (s[0] === '/') {
            if (s[1] === '/') {
                const lastNode = nodes[nodes.length - 1];
                let lastLine = -1;
                if (lastNode) {
                    lastLine = lastNode.loc.end.line;
                }
                const currLine = getCursor(context).line;
                nodes.push(parseComment(context, currLine === lastLine));
                advanceSpaces(context);
            }
            else {
                throw new Error('错误的备注');
            }
        }
        else {
            nodes.push(parseData(context));
        }
    }
    return nodes;
}
function parseKey(context) {
    const match = /^["|']?([a-z0-9][^:]*)/i.exec(context.source);
    advanceBy(context, match[0].length + 1);
    advanceSpaces(context);
    const value = match[1];
    if (/["|']$/.test(value)) {
        // 最后的引号
        return value.slice(0, -1);
    }
    return value;
}
function parseNumber(context) {
    const match = /^([0-9]*)/i.exec(context.source);
    advanceBy(context, match[0].length);
    return match[1];
}
function parseString(context) {
    const match = /^["|']([^"|']*)/i.exec(context.source);
    advanceBy(context, match[0].length + 1);
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
    }
    else if (code === '[') {
        advanceBy(context, 1);
        value = parseArray(context);
        type = 'Array';
    }
    else if (code === '{') {
        value = parseChildren(context);
        type = 'Object';
    }
    return {
        value,
        type
    };
}
function parseArray(context) {
    const nodes = [];
    while (!isEnd(context)) {
        nodes.push(parseData(context, contant_1.ARRAY_ITEM));
        if (context.source[0] === ']') {
            advanceBy(context, 1);
            return nodes;
        }
    }
    return nodes;
}
function parseComment(context, isLast) {
    const match = /^\/\/\s*(.[^\t\n\r\f]*)/i.exec(context.source);
    const start = getCursor(context);
    const comment = match[1];
    const key = isLast ? contant_1.LAST_COMMENT : contant_1.NEXT_COMMENT;
    advanceBy(context, match[0].length);
    return { key, value: comment, type: contant_1.COMMENT_KEY, loc: getLoc(context, start) };
}
/**
 * parse to ast
 * @param input
 * @param options
 * @returns ast
 */
function parse(input, options) {
    const context = createContext(input, options);
    return createRoot(parseChildren(context));
}
exports.parse = parse;
