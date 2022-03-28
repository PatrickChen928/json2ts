import { assert, describe, expect, test, it } from 'vitest';
import { parse } from '../src/parse';

import { ARRAY_ITEM, ARRAY_TYPE, NULL_TYPE, NUMBER_TYPE, STRING_TYPE, UNDEFINED_TYPE } from '../src';
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

// describe('undefined parse', () => {
//   const undefinedJson = {
//     name: undefined
//   }
//   console.log(JSON.stringify(undefinedJson))
//   const result = parse(JSON.stringify(undefinedJson)).value;
//   const content = result[0] as AstChildNode;
//   it('expect', () => {
//     expect(result.length).toEqual(1);
//     expect(content.value).toEqual('undefined');
//     expect(content.key).toEqual('name');
//     expect(content.type).toEqual(UNDEFINED_TYPE);
//     expect(content.loc.source).toMatchInlineSnapshot('"\\"name\\":null"')
//   })
// })


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

const jsonNull = {
  "status":{
    "code":0,
    "message":"OK",
    "description":""
},
"result":{
    "cabinetLists":null,
    "newSpuLists":null,
    "recycleAreaLists":[
        {
            "albumName":null,
            "feature":null,
            "likeCount":null,
            "price":11000, //价格 (分)
            "size":null,
            "spuId":9178, 
            "spuImg":"https://si.geilicdn.com/wdseller763727604-6b190000017b62dea7d90a20e7c7_1284_1712.jpg",
            "spuName":"Kiyo",
            "spuType":2,
            "wantCount":0 //spu订阅人数
        }
    ]
}
}