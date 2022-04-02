import { describe, expect, it } from 'vitest';
import { parse } from '../src/parse';
import { transform } from '../src/transform';

const json0 = `{}`;
const json1 = `{
  "name": "aphto",
  "age": 18
}`;

describe('empty json', () => {
  it('expect', () => {
    expect(transform(parse(json0))).toMatchObject({ key: 'root', type: 'Root', value: [] })
  })
});

describe('simple json', () => {
  it('expect', () => {
    const ast = transform(parse(json1));
    expect(ast).toMatchInlineSnapshot(`
      {
        "comments": {},
        "key": "root",
        "type": "Root",
        "typeValue": {
          "age": "number",
          "name": "string",
        },
        "value": [
          {
            "i": 0,
            "key": "name",
            "loc": {
              "end": {
                "column": 18,
                "line": 2,
                "offset": 19,
              },
              "source": "\\"name\\": \\"aphto\\"",
              "start": {
                "column": 3,
                "line": 2,
                "offset": 4,
              },
            },
            "type": "string",
            "value": "aphto",
          },
          {
            "i": 0,
            "key": "age",
            "loc": {
              "end": {
                "column": 12,
                "line": 3,
                "offset": 32,
              },
              "source": "\\"age\\": 18",
              "start": {
                "column": 3,
                "line": 3,
                "offset": 23,
              },
            },
            "type": "number",
            "value": "18",
          },
        ],
      }
    `);
  })
});