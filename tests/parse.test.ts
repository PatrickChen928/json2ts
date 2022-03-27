import { assert, describe, expect, test, it } from 'vitest';
import { parse } from '../src/parse';

import { ARRAY_ITEM, ARRAY_TYPE, NUMBER_TYPE, STRING_TYPE } from '../src';
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
  const content = res.value[0];
  it('expect', () => {
    expect((content as AstChildNode).key).toEqual('arr');
    expect((content as AstChildNode).type).toEqual(ARRAY_TYPE);
    expect((content as AstChildNode).value.length).toEqual(3);
    expect((content as AstChildNode).value[0].type).toEqual(NUMBER_TYPE);
    expect((content as AstChildNode).value[0].value).toEqual('1');
    expect((content as AstChildNode).value[0].key).toEqual(ARRAY_ITEM);
    expect((content as AstChildNode).value[1].type).toEqual(NUMBER_TYPE);
    expect((content as AstChildNode).value[1].value).toEqual('2');
    expect((content as AstChildNode).value[1].key).toEqual(ARRAY_ITEM);
    expect((content as AstChildNode).value[2].type).toEqual(STRING_TYPE);
    expect((content as AstChildNode).value[2].value).toEqual('3');
    expect((content as AstChildNode).value[2].key).toEqual(ARRAY_ITEM);
  })
})
