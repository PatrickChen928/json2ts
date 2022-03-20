import { assert, describe, expect, test, it } from 'vitest';
import { parse } from '../src/parse';

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
// test('empty json', () => {
//   function 
//   // assert.deepEqual(parse(json0), { key: 'root', type: 'Root', value: [] })
//   // expect(Math.sqrt(144)).toBe(12)
//   // expect(Math.sqrt(2)).toBe(Math.SQRT2)
// })

// test('JSON', () => {
//   const input = {
//     foo: 'hello',
//     bar: 'world',
//   }

//   const output = JSON.stringify(input)

//   expect(output).eq('{"foo":"hello","bar":"world"}')
//   assert.deepEqual(JSON.parse(output), input, 'matches original')
// })
