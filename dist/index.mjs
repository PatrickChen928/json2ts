function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var ROOT_TYPE = "Root";
var STRING_TYPE = "string";
var NUMBER_TYPE = "number";
var NULL_TYPE = "null";
var BOOLEAN_TYPE = "boolean";
var UNDEFINED_TYPE = "undefined";
var OBJECT_TYPE = "Object";
var ARRAY_TYPE = "Array";
var COMMENT_TYPE = "Comment";
var ROOT_KEY = "root";
var ARRAY_ITEM = "$ARRAY_ITEM$";
var LAST_COMMENT = "$LAST_COMMENT$";
var NEXT_COMMENT = "$NEXT_COMMENT$";
var ARRAY_ERROR_MESSAGE = "array should be closed";
var COMMENT_ERROR_MESSAGE = "comment is illegal";
var VALUE_ILLEGAL_ERROR_MESSAGE = "value is illegal";

function getCursor(context) {
  var offset = context.offset,
      column = context.column,
      line = context.line;
  return {
    offset: offset,
    column: column,
    line: line
  };
}

function getLoc(context, start, end) {
  end = end || getCursor(context);
  return {
    start: start,
    end: end,
    source: context.originalSource.slice(start.offset, end.offset)
  };
}

function createContext(content, options) {
  return {
    options: options,
    column: 1,
    line: 1,
    offset: 0,
    originalSource: content,
    source: content
  };
}

function createRoot(nodes) {
  return {
    key: ROOT_KEY,
    type: ROOT_TYPE,
    value: nodes
  };
}

function isEnd(context) {
  return !context.source;
}

function advancePositionWithMutation(pos, source) {
  var numberOfCharacters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : source.length;
  var lineCount = 0;
  var lastNewLinePos = -1;

  for (var i = 0; i < numberOfCharacters; i++) {
    if (source.charCodeAt(i) === 10) {
      lineCount++;
      lastNewLinePos = i;
    }
  }

  pos.offset += numberOfCharacters;
  pos.line += lineCount;
  pos.column = lastNewLinePos === -1 ? pos.column + numberOfCharacters : numberOfCharacters - lastNewLinePos;
}

function advanceBy(context, numberOfCharacters) {
  var source = context.source;
  advancePositionWithMutation(context, source, numberOfCharacters);
  context.source = source.slice(numberOfCharacters);
}

function advanceSpaces(context) {
  var match = /^[\t\r\n\f ]+/.exec(context.source);

  if (match && match[0]) {
    advanceBy(context, match[0].length);
  }
}

function parseData(context, keyName) {
  advanceSpaces(context);
  var start = getCursor(context);
  var key = keyName || parseKey(context);

  var _parseValue = parseValue(context),
      value = _parseValue.value,
      type = _parseValue.type;

  var loc = getLoc(context, start);
  advanceSpaces(context);

  if (context.source[0] === ",") {
    advanceBy(context, 1);
    advanceSpaces(context);
  }

  return {
    key: key,
    value: value,
    type: type,
    loc: loc
  };
}

function parseChildren(context) {
  var nodes = [];

  while (!isEnd(context)) {
    advanceSpaces(context);
    var s = context.source;

    if (s[0] === "{") {
      advanceBy(context, 1);
    } else if (s[0] === "}") {
      advanceBy(context, 1);
      advanceSpaces(context);
      return nodes;
    } else if (s[0] === "/") {
      if (s[1] === "/") {
        var lastNode = nodes[nodes.length - 1];
        var lastLine = -1;

        if (lastNode) {
          lastLine = lastNode.loc.end.line;
        }

        nodes.push(parseComment(context, lastLine));
        advanceSpaces(context);
      } else {
        throw new Error(COMMENT_ERROR_MESSAGE);
      }
    } else {
      nodes.push(parseData(context));
    }
  }

  return nodes;
}

function parseKey(context) {
  var s = context.source[0];
  var match = [];

  if (s === '"') {
    match = /^"(.[^"]*)/i.exec(context.source);
  } else if (s === "'") {
    match = /^'(.[^']*)/i.exec(context.source);
  } else {
    match = /(.[^:]*)/i.exec(context.source);
    match[1] = match[1].trim();
  }

  advanceBy(context, match[0].length + 1);
  advanceSpaces(context);

  if (context.source[0] === ":") {
    advanceBy(context, 1);
    advanceSpaces(context);
  }

  return match[1];
}

function parseNumber(context) {
  var match = /^([0-9]*)/i.exec(context.source);
  advanceBy(context, match[0].length);
  return match[1];
}

function parseString(context) {
  var match = /^["|']([^"|']*)/i.exec(context.source);
  advanceBy(context, match[0].length + 1);
  return match[1];
}

function parseNull(context) {
  advanceBy(context, 4);
  return "null";
}

function parseBoolean(context) {
  var match = /^(true|false)/i.exec(context.source);
  advanceBy(context, match[0].length);
  return match[1];
}

function parseUndefined(context) {
  advanceBy(context, 9);
  return "undefined";
}

function parseValue(context) {
  var value = null;
  var type = null;
  var code = context.source[0];

  if (/^[0-9]/.test(code)) {
    value = parseNumber(context);
    type = NUMBER_TYPE;
  } else if (code === '"' || code === "'") {
    value = parseString(context);
    type = STRING_TYPE;
  } else if (code === "[") {
    advanceBy(context, 1);
    value = parseArray(context);
    type = ARRAY_TYPE;
  } else if (code === "{") {
    value = parseChildren(context);
    type = OBJECT_TYPE;
  } else if (context.source.indexOf("null") === 0) {
    value = parseNull(context);
    type = NULL_TYPE;
  } else if (context.source.indexOf("true") === 0 || context.source.indexOf("false") === 0) {
    value = parseBoolean(context);
    type = BOOLEAN_TYPE;
  } else if (context.source.indexOf("undefined") === 0) {
    value = parseUndefined(context);
    type = UNDEFINED_TYPE;
  } else {
    throw new Error(VALUE_ILLEGAL_ERROR_MESSAGE);
  }

  return {
    value: value,
    type: type
  };
}

function parseArray(context) {
  var nodes = [];
  var lastLine = getCursor(context).line;
  advanceSpaces(context);

  while (!isEnd(context)) {
    if (context.source.indexOf("//") === 0) {
      var cv = parseComment(context, lastLine);
      nodes.push(cv);
      advanceSpaces(context);
    } else {
      var itemValue = parseData(context, ARRAY_ITEM);
      lastLine = itemValue.loc.end.line;
      nodes.push(itemValue);
    }

    var s = context.source[0];

    if (s === "]") {
      advanceBy(context, 1);
      return nodes;
    }

    if (s === "}" || s === ":") {
      throw new Error(ARRAY_ERROR_MESSAGE);
    }
  }

  throw new Error(ARRAY_ERROR_MESSAGE);
}

function parseComment(context, lastLine) {
  var currLine = getCursor(context).line;
  var key = lastLine === currLine ? LAST_COMMENT : NEXT_COMMENT;
  var match = /^\/\/\s*(.[^\t\n\r\f]*)/i.exec(context.source);
  var start = getCursor(context);
  var comment = match[1];
  advanceBy(context, match[0].length);
  return {
    key: key,
    value: comment,
    type: COMMENT_TYPE,
    loc: getLoc(context, start)
  };
}

function parse(input, options) {
  var context = createContext(input, options);
  return createRoot(parseChildren(context));
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function isArray(value) {
  return _typeof(value) === "object" && objectToString(value).slice(8, -1) === "Array";
}

function isObject(value) {
  return _typeof(value) === "object" && objectToString(value).slice(8, -1) === "Object";
}

function upperCaseFirstChat(str) {
  return str.replace(/( |^)[a-z]/g, function (L) {
    return L.toUpperCase();
  });
}

function stringifyObjAndSort(obj) {
  var keys = Object.keys(obj).sort();
  var res = "{";

  var _iterator = _createForOfIteratorHelper(keys),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var val = _step.value;
      res += "".concat(val, ":").concat(obj[val], ",");
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  res.replace(/,$/, "");
  res += "}";
  return res;
}

var cache = resetCache();

function resetCache() {
  return {
    comments: {},
    i: 0,
    lastI: null,
    lastNode: null,
    nextComment: []
  };
}

function normalEntryHandle(node, parent) {
  node.i = cache.i;

  if (node.key === ARRAY_ITEM) {
    cache.nextComment = [];
    parent.typeValue = parent.typeValue || [];
    parent.typeValue.push(node.type);
  } else {
    parent.typeValue = parent.typeValue || {};
    parent.typeValue[node.key] = node.type;
    handleComment(node);
  }
}

function handleComment(node) {
  cache.lastNode = node;

  if (cache.nextComment.length) {
    var comments = cache.comments;
    var key = node.key + cache.i;
    comments[key] = comments[key] || [];
    comments[key] = comments[key].concat(cache.nextComment);
    cache.nextComment = [];
  }
}

function traverseNode(nodes, parent, visiter) {
  nodes.forEach(function (node) {
    var visit = visiter[node.type];

    if (visit) {
      visit.entry && visit.entry(node, parent);
    }

    if (isArray(node.value)) {
      traverseNode(node.value, node, visiter);
    }

    if (visit) {
      visit.exit && visit.exit(node, parent);
    }
  });
}

function traverser(ast, visiter) {
  var root = visiter.Root;

  if (root) {
    root.entry && root.entry(ast, null);
  }

  traverseNode(ast.value, ast, visiter);

  if (root) {
    root.exit && root.exit(ast, null);
  }

  return ast;
}

function transform(ast, options) {
  var _traverser;

  traverser(ast, (_traverser = {}, _defineProperty(_traverser, STRING_TYPE, {
    entry: function entry(node, parent) {
      normalEntryHandle(node, parent);
    }
  }), _defineProperty(_traverser, NUMBER_TYPE, {
    entry: function entry(node, parent) {
      normalEntryHandle(node, parent);
    }
  }), _defineProperty(_traverser, OBJECT_TYPE, {
    entry: function entry(node, parent) {
      node.i = cache.i;
      cache.i++;

      if (node.key === ARRAY_ITEM) {
        cache.nextComment = [];
        parent.typeValue = parent.typeValue || [];
        node.typeValue = {};
        parent.typeValue.push(node.typeValue);
      } else {
        parent.typeValue = parent.typeValue || {};
        parent.typeValue[node.key] = node.typeValue = {};
        handleComment(node);
      }
    },
    exit: function exit(node) {
      cache.lastNode = node;
    }
  }), _defineProperty(_traverser, ARRAY_TYPE, {
    entry: function entry(node, parent) {
      node.i = cache.i;

      if (node.key === ARRAY_ITEM) {
        cache.nextComment = [];
        parent.typeValue = parent.typeValue || [];
        node.typeValue = [];
        parent.typeValue.push(node.typeValue);
      } else {
        parent.typeValue = parent.typeValue || {};
        parent.typeValue[node.key] = node.typeValue = [];
        handleComment(node);
      }
    },
    exit: function exit(node) {
      cache.lastNode = node;
    }
  }), _defineProperty(_traverser, NULL_TYPE, {
    entry: function entry(node, parent) {
      normalEntryHandle(node, parent);
    }
  }), _defineProperty(_traverser, BOOLEAN_TYPE, {
    entry: function entry(node, parent) {
      normalEntryHandle(node, parent);
    }
  }), _defineProperty(_traverser, UNDEFINED_TYPE, {
    entry: function entry(node, parent) {
      normalEntryHandle(node, parent);
    }
  }), _defineProperty(_traverser, COMMENT_TYPE, {
    entry: function entry(node) {
      if (node.key === LAST_COMMENT) {
        var key = cache.lastNode.key + cache.lastNode.i;
        cache.comments[key] = cache.comments[key] || [];
        cache.comments[key].push(node.value);
      } else {
        cache.nextComment.push(node.value);
      }
    }
  }), _traverser));
  ast.comments = cache.comments;
  console.log(ast.comments);
  cache = resetCache();
  return ast;
}

var Generate = /*#__PURE__*/function () {
  function Generate(ast, options) {
    _classCallCheck(this, Generate);

    this.ast = ast;
    this.options = options;
    this.prefix = options.typePrefix;
    this.suffix = options.typeSuffix;
    this.vars = "";
    this.i = 0;
    this.j = -1;
    this.level = 1;
    this.objValueMap = /* @__PURE__ */new Map();
  }

  _createClass(Generate, [{
    key: "beginGen",
    value: function beginGen() {
      var originName = this.genName("Result");
      var typeValue = this.ast.typeValue;
      var code = this.gen(typeValue);
      return "".concat(this.vars, "type ").concat(originName, " = ").concat(code);
    }
  }, {
    key: "gen",
    value: function gen(typeValue) {
      var code = "{\n";

      for (var key in typeValue) {
        var type = typeValue[key];

        if (this.options.comment === "block") {
          code += this.genBlockComment(key);
        }

        code += this.genKey(key);

        if (isObject(type)) {
          code += this.genObjcet(key, type);
        } else if (isArray(type)) {
          code += this.options.parseArray ? this.genArray(key, type) : "Array<any>";
        } else {
          code += type;
        }

        if (this.options.semicolon) {
          code += ";";
        }

        if (this.options.comment === "inline") {
          code += this.genInlineComment(key);
        }

        code += "\n";
      }

      if (!this.options.splitType) {
        code += this.genFormatChat(this.level - 1);
      }

      code += "}";
      return code;
    }
  }, {
    key: "genName",
    value: function genName(key) {
      this.j++;
      return "".concat(this.prefix).concat(upperCaseFirstChat(key), "$").concat(this.j).concat(this.suffix);
    }
  }, {
    key: "genKey",
    value: function genKey(key) {
      return "".concat(this.genFormatChat(this.level)).concat(key).concat(this.options.required ? ": " : "?: ");
    }
  }, {
    key: "genFormatChat",
    value: function genFormatChat(level) {
      var indent = this.options.indent;

      if (this.options.splitType) {
        return " ".repeat(indent);
      }

      return " ".repeat(level * indent);
    }
  }, {
    key: "genInlineComment",
    value: function genInlineComment(key) {
      var name = key + this.i;
      var comments = this.ast.comments[name];

      if (comments && comments.length) {
        var code = " // ";
        comments.forEach(function (comment) {
          code += comment + "; ";
        });
        code = code.substring(0, code.length - 2);
        return code;
      }

      return "";
    }
  }, {
    key: "genBlockComment",
    value: function genBlockComment(key) {
      var _this = this;

      var code = "";
      var name = key + this.i;
      var comments = this.ast.comments[name];

      if (comments && comments.length) {
        comments.forEach(function (comment) {
          code += _this.genFormatChat(_this.level) + "// " + comment + "\n";
        });
      }

      return code;
    }
  }, {
    key: "genObjcet",
    value: function genObjcet(key, type) {
      var code = "";
      this.level++;
      this.i++;
      var objType = this.gen(type);

      if (this.options.splitType) {
        code += this.genObjectCodeWithVar(objType, key, type);
      } else {
        code += objType;
      }

      this.level--;
      return code;
    }
  }, {
    key: "genObjectCodeWithVar",
    value: function genObjectCodeWithVar(objType, key, type) {
      var val = stringifyObjAndSort(type);

      if (this.objValueMap.has(val)) {
        return this.objValueMap.get(val);
      }

      var varName = this.genName(key);
      this.objValueMap.set(val, varName);
      this.vars += "type ".concat(varName, " = ").concat(objType, ";\n\n");
      return varName;
    }
  }, {
    key: "genArray",
    value: function genArray(key, types) {
      var _this2 = this;

      var code = "Array< ";
      var arrTypes = /* @__PURE__ */new Set();
      types.forEach(function (type) {
        if (isArray(type)) {
          arrTypes.add(_this2.genArray(key, type));
        }

        if (isObject(type)) {
          arrTypes.add(_this2.genObjcet(key, type));
        } else {
          arrTypes.add(type);
        }
      });
      code += Array.from(arrTypes).join(" | ");
      code += " >";
      return code;
    }
  }]);

  return Generate;
}();

function generate(ast, options) {
  return new Generate(ast, options).beginGen();
}

function initOptions(options) {
  var defaultOptions = {
    splitType: true,
    parseArray: false,
    required: true,
    semicolon: false,
    typeSuffix: "Type",
    typePrefix: "",
    indent: 2,
    comment: false
  };
  Object.assign(defaultOptions, options);
  return defaultOptions;
}

function json2ts(code) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var finalOptions = initOptions(options);
  var ast = parse(code, finalOptions);
  transform(ast);
  return generate(ast, finalOptions);
}

export { ARRAY_ERROR_MESSAGE, ARRAY_ITEM, ARRAY_TYPE, BOOLEAN_TYPE, COMMENT_ERROR_MESSAGE, COMMENT_TYPE, LAST_COMMENT, NEXT_COMMENT, NULL_TYPE, NUMBER_TYPE, OBJECT_TYPE, ROOT_KEY, ROOT_TYPE, STRING_TYPE, UNDEFINED_TYPE, VALUE_ILLEGAL_ERROR_MESSAGE, json2ts as default, json2ts, parse, traverser };
