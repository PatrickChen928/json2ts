import { assert, describe, expect, test, it } from 'vitest';
import json2ts from '../src';

// Edit an assertion and save to see HMR in action


const json0 = `{}`;
const json1 = `{
    "name": "aphto",
    "age": 18
}`;

describe('empty json', () => {
  it('expect', () => {
    expect(json2ts(json1)).toMatchInlineSnapshot(`
      "type Result\$0Type = {
      name:string
      age:number
      }"
    `)
  })
});

describe('semicolon end', () => {
  it('expect', () => {
    expect(json2ts(json1, { semicolon: true })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
      name:string;
      age:number;
      }"
    `)
  })
});