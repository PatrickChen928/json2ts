# Json2ts

中文 | [English](./README.md) 

使用`编译原理`，解析Json，输出 TS 类型

json-parse > transform > codegen

在线体验：https://chpshy.github.io/json2ts/index.html

## Features

- 支持层级嵌套
- 支持数组解析
- 支持行内和换行的注释解析
- 支持key值无引号模式

## Install

```javascript
npm i @cyly/json2ts

// or

yarn add @cyly/json2ts

// or 

pnpm i @cyly/json2ts

// or

<script src="index.umd.min.js"></script>

json2ts.json2ts('{ name: 'apha' }', {
    semicolon: true
});
```

## Document
### json2ts

```javascript
import json2ts from '@cyly/json2ts';

const json = {
  "a": 123,
  "b": {
    "c": "123"
  },
  d: [1, 2, 3]
};

const result = json2ts(JSON.stringify(json), {
    semicolon: true
});
```

### options
#### spiltType
`boolean`。默认：`true`。是否分离对象，分离的话，会将json内的对象作为单独的 type 类型

#### parseArray
`boolean`。默认：`false`。是否解析数组。默认返回Array< any >

#### required
`boolean`。默认：`true`。是否都是必须。设为`false`则为：`{ a?: number}`;
#### semicolon
`boolean`。默认：`false`。是否使用分号结尾。设为`true`则为：`{a: number; b: string;}`

#### typePrefix
`string`。默认：''。命名的前缀。如设为`User`：`UserKeyName$0`
#### typeSuffix
`string`。默认：`Type`。命名的后缀。如设为`Temp`：`KeyName$0Temp`

### parse

```javascript
import { parse } from '@cyly/json2ts';

const json = {
  "a": 123,
  "b": {
    "c": "123"
  },
  d: [1, 2, 3]
};

const ast = parse(JSON.stringify(json));
```

### traverser

```javascript
import { traverser, STRING_TYPE, ARRAY_TYPE } from '@cyly/json2ts';

const json = {
  "a": 123,
  "b": {
    "c": "123"
  },
  d: [1, 2, 3]
};

const ast = parse(JSON.stringify(json));

traverser(ast, {
  [STRING_TYPE]: {
    entry(node, parent) {},
    exit(node, parent) {}
  },
  [ARRAY_TYPE]: {
    entry(node, parent) {},
    exit(node, parent) {}
  }
});
```

```javascript

{
  "a": 123,
  "b": {
    "c": "123"
  },
  d: [1, 2, 3]
} 

=>

{
    "key": "root",
    "type": "Root",
    "value": [{
        "key": "a",
        "value": "123",
        "type": "number",
        "loc": {
            "start": {
                "offset": 1,
                "column": 2,
                "line": 1
            },
            "end": {
                "offset": 8,
                "column": 9,
                "line": 1
            },
            "source": "\"a\":123"
        }
    },
    {
        "key": "b",
        "value": [{
            "key": "c",
            "value": "123",
            "type": "string",
            "loc": {
                "start": {
                    "offset": 14,
                    "column": 15,
                    "line": 1
                },
                "end": {
                    "offset": 23,
                    "column": 24,
                    "line": 1
                },
                "source": "\"c\":\"123\""
            }
        }],
        "type": "Object",
        "loc": {
            "start": {
                "offset": 9,
                "column": 10,
                "line": 1
            },
            "end": {
                "offset": 24,
                "column": 25,
                "line": 1
            },
            "source": "\"b\":{\"c\":\"123\"}"
        }
    },
    {
        "key": "d",
        "value": [{
            "key": "$ARRAY_ITEM$",
            "value": "1",
            "type": "number",
            "loc": {
                "start": {
                    "offset": 30,
                    "column": 31,
                    "line": 1
                },
                "end": {
                    "offset": 31,
                    "column": 32,
                    "line": 1
                },
                "source": "1"
            }
        },
        {
            "key": "$ARRAY_ITEM$",
            "value": "2",
            "type": "number",
            "loc": {
                "start": {
                    "offset": 32,
                    "column": 33,
                    "line": 1
                },
                "end": {
                    "offset": 33,
                    "column": 34,
                    "line": 1
                },
                "source": "2"
            }
        },
        {
            "key": "$ARRAY_ITEM$",
            "value": "3",
            "type": "number",
            "loc": {
                "start": {
                    "offset": 34,
                    "column": 35,
                    "line": 1
                },
                "end": {
                    "offset": 35,
                    "column": 36,
                    "line": 1
                },
                "source": "3"
            }
        }],
        "type": "Array",
        "loc": {
            "start": {
                "offset": 25,
                "column": 26,
                "line": 1
            },
            "end": {
                "offset": 36,
                "column": 37,
                "line": 1
            },
            "source": "\"d\":[1,2,3]"
        }
    }]
}

=>

{
  a: number,
  b: {
    c: string
  },
  d: Array< number >;
}

```
