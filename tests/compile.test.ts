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
        name: string
        age: number
        }"
    `)
  })
});

describe('semicolon end', () => {
  it('expect', () => {
    expect(json2ts(json1, { semicolon: true })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: string;
        age: number;
        }"
    `)
  })
});

describe('null', () => {
  it('expect', () => {
    expect(json2ts(`{ name: null }`, { semicolon: true })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: null;
        }"
    `)
  })
});

describe('undefined', () => {
  it('expect', () => {
    expect(json2ts(`{ name: undefined }`, { semicolon: true })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: undefined;
        }"
    `)
  })
});

describe('boolean', () => {
  it('expect', () => {
    expect(json2ts(`{ name: true, key: false }`, { semicolon: true })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: boolean;
        key: boolean;
        }"
    `)
  })
});

const inputArray = `{
  "name": "aphto",
  "arrName": ["fu", 18, { name: 'fu', age: 18 }]
}`;
describe('array any', () => {
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: string;
        arrName: Array<any>;
        }"
    `)
  })
});

describe('array parse', () => {
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true })).toMatchInlineSnapshot(`
      "type ArrName\$1Type = {
        name: string;
        age: number;
        };
      
      type Result\$0Type = {
        name: string;
        arrName: Array< string | number | ArrName\$1Type >;
        }"
    `)
  })
});


describe('not spiltType', () => {
  const inputArray = `{
    "name": { 
      key: {
        val: 3
      }
    }
  }`;
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true, spiltType: false })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: {
          key: {
            val: number;
          };
        };
      }"
    `)
  })
});