import { assert, describe, expect, test, it } from 'vitest';
import { parse } from '../src/parse';
import { 
  ARRAY_ITEM, 
  ARRAY_TYPE, 
  NULL_TYPE, 
  NUMBER_TYPE, 
  STRING_TYPE, 
  UNDEFINED_TYPE, 
  ARRAY_ERROR_MESSAGE, 
  COMMENT_ERROR_MESSAGE,
  VALUE_ILLEGAL_ERROR_MESSAGE,
  NEXT_COMMENT,
  LAST_COMMENT
} from '../src';
import type { AstChildNode } from '../src/types';

// Edit an assertion and save to see HMR in action


const json0 = `{}`;
const json1 = `{
    "name:": "aphto",
    "age": 18
}`;

describe('empty json', () => {
  it('expect', () => {
    expect(parse(json0)).toMatchObject({ key: 'root', type: 'Root', value: [] })
  })
});

describe('null parse', () => {
  const nullJson = {
    "name": null
  }
  const result = parse(JSON.stringify(nullJson)).value;
  const content = result[0] as AstChildNode;
  it('expect', () => {
    expect(result.length).toEqual(1);
    expect(content.value).toEqual('null');
    expect(content.key).toEqual('name');
    expect(content.type).toEqual(NULL_TYPE);
    expect(content.loc.source).toMatchInlineSnapshot('"\\"name\\":null"')
  })
})

describe('array should be closed', () => {
  // 数组没有闭合，会继续往下解析，把girlfriend当成value，所以会提示 VALUE_ILLEGAL_ERROR_MESSAGE
  const json1 = `{ 
    // 这是一个名字
    interest: [ 'swim', 'football', 22 
    girlfriend: {
      name: "qiaqia",
      age: 18,
      "exboyfriend": [
        {
        name: "uzzz",
          age: 40
        }
      ]
    }
  }`;
  const json2 = `{ 
    // 这是一个名字
    interest: [ 'swim', 'football', 22 
  }`;
  it('expect', () => {
    expect(() => parse(json1)).toThrow(VALUE_ILLEGAL_ERROR_MESSAGE);
    expect(() => parse(json2)).toThrow(ARRAY_ERROR_MESSAGE);
  })
})

describe('array item comment', () => {
  // 数组没有闭合，会继续往下解析，把girlfriend当成value，所以会提示 VALUE_ILLEGAL_ERROR_MESSAGE
  const json1 = `{ 
    // This is a name key
    name: "bengbeng", // His name is bengbeng
    age: 20, // This is his age
    interest: [ 
      // 2
      // 2-1
      'swim', // inline swim
      // 3
      'football', 
      // 4
      22 // 5 
    ]
  }`;
  let res = (parse(json1).value[5] as AstChildNode).value as AstChildNode[];
  console.log(res);
  it('expect', () => {
    expect(res[0].key).toEqual(NEXT_COMMENT);
    expect(res[1].key).toEqual(NEXT_COMMENT);
    expect(res[3].key).toEqual(LAST_COMMENT);
    expect(res[4].key).toEqual(NEXT_COMMENT);
    expect(res[6].key).toEqual(NEXT_COMMENT);
    expect(res[8].key).toEqual(LAST_COMMENT);
  })
})



describe('comment should be legal', () => {
  const nullJson = `{
    / is illegal
    "name": 1
  }`
  it('expect', () => {
    expect(() => parse(nullJson)).toThrow(COMMENT_ERROR_MESSAGE);
  })
})

describe('undefined parse', () => {
  const undefinedJson = `{
    name: undefined
  }`
  const result = parse(undefinedJson).value;
  const content = result[0] as AstChildNode;
  it('expect', () => {
    expect(result.length).toEqual(1);
    expect(content.value).toEqual('undefined');
    expect(content.key).toEqual('name');
    expect(content.type).toEqual(UNDEFINED_TYPE);
    expect(content.loc.source).toMatchInlineSnapshot('"name: undefined"')
  })
})


const json2 = {
  "a": 123,
  "b": {
    "c": "123"
  },
  d: [1, 2, 3]
}
describe('object + array + no quo', () => {
  it('expect', () => {
    expect(parse(JSON.stringify(json2))).toEqual({ "key": "root", "type": "Root", "value": [{ "key": "a", "value": "123", "type": "number", "loc": { "start": { "offset": 1, "column": 2, "line": 1 }, "end": { "offset": 8, "column": 9, "line": 1 }, "source": "\"a\":123" } }, { "key": "b", "value": [{ "key": "c", "value": "123", "type": "string", "loc": { "start": { "offset": 14, "column": 15, "line": 1 }, "end": { "offset": 23, "column": 24, "line": 1 }, "source": "\"c\":\"123\"" } }], "type": "Object", "loc": { "start": { "offset": 9, "column": 10, "line": 1 }, "end": { "offset": 24, "column": 25, "line": 1 }, "source": "\"b\":{\"c\":\"123\"}" } }, { "key": "d", "value": [{ "key": "$ARRAY_ITEM$", "value": "1", "type": "number", "loc": { "start": { "offset": 30, "column": 31, "line": 1 }, "end": { "offset": 31, "column": 32, "line": 1 }, "source": "1" } }, { "key": "$ARRAY_ITEM$", "value": "2", "type": "number", "loc": { "start": { "offset": 32, "column": 33, "line": 1 }, "end": { "offset": 33, "column": 34, "line": 1 }, "source": "2" } }, { "key": "$ARRAY_ITEM$", "value": "3", "type": "number", "loc": { "start": { "offset": 34, "column": 35, "line": 1 }, "end": { "offset": 35, "column": 36, "line": 1 }, "source": "3" } }], "type": "Array", "loc": { "start": { "offset": 25, "column": 26, "line": 1 }, "end": { "offset": 36, "column": 37, "line": 1 }, "source": "\"d\":[1,2,3]" } }] })
  })
})

describe('array any', () => {
  const jsonArr = {
    arr: [1, 2, '3']
  }
  const res = parse(JSON.stringify(jsonArr));
  const content = res.value[0] as AstChildNode;
  const value1 = content.value[0] as AstChildNode;
  const value2 = content.value[1] as AstChildNode;
  const value3 = content.value[2] as AstChildNode;
  it('expect', () => {
    expect(content.key).toEqual('arr');
    expect(content.type).toEqual(ARRAY_TYPE);
    expect(content.value.length).toEqual(3);
    expect(value1.type).toEqual(NUMBER_TYPE);
    expect(value1.value).toEqual('1');
    expect(value1.key).toEqual(ARRAY_ITEM);
    expect(value2.type).toEqual(NUMBER_TYPE);
    expect(value2.value).toEqual('2');
    expect(value2.key).toEqual(ARRAY_ITEM);
    expect(value3.type).toEqual(STRING_TYPE);
    expect(value3.value).toEqual('3');
    expect(value3.key).toEqual(ARRAY_ITEM);
  })
})