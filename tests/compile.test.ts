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


describe('not splitType', () => {
  const inputArray = `{
    "name": { 
      key: {
        val: 3
      }
    }
  }`;
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true, splitType: false })).toMatchInlineSnapshot(`
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

describe('indent', () => {
  const inputArray = `{
    "name": { 
      key: {
        val: 3
      }
    }
  }`;
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true, splitType: false, indent: 4 })).toMatchInlineSnapshot(`
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

describe('indent + splitType', () => {
  const inputArray = `{
    "name": { 
      key: {
        val: 3
      }
    }
  }`;
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true, indent: 4 })).toMatchInlineSnapshot(`
      "type Key\$1Type = {
          val: number;
      };
      
      type Name\$2Type = {
          key: Key\$1Type;
      };
      
      type Result\$0Type = {
          name: Name\$2Type;
      }"
    `)
  })
});

describe('object reuse', () => {
  const inputArray = `{
    name: "qiaqia",
    age: 18,
    girlfriend: [
      {
        age: 20,
        name: "bengbeng",
      },
      {
        name: "qiqi",
        age: 30
      }
    ]
  }`;
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true,  indent: 2 })).toMatchInlineSnapshot(`
      "type Girlfriend\$1Type = {
        age: number;
        name: string;
      };
      
      type Result\$0Type = {
        name: string;
        age: number;
        girlfriend: Array< Girlfriend\$1Type >;
      }"
    `)
  })
});

describe('comment false', () => {
  const inputArray = `{
    // This is 0 name
    // This is 1 name
    name: '1', 
    arr: [ 
      // this is arr 1
      1, 
      { 
      // this is arr n
      n: 2 } ], // This is arr
    girlfriend: {
      name: '2', // This is 2 name
      hh: {
        name: '3'  // This is 3 name,
      }
    } // This is girlfriend
  }`;
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true,  indent: 2 })).toMatchInlineSnapshot(`
      "type Arr\$1Type = {
        n: number;
      };
      
      type Hh\$2Type = {
        name: string;
      };
      
      type Girlfriend\$3Type = {
        name: string;
        hh: Hh\$2Type;
      };
      
      type Result\$0Type = {
        name: string;
        arr: Array< number | Arr\$1Type >;
        girlfriend: Girlfriend\$3Type;
      }"
    `)
  })
});

describe('comment block', () => {
  const inputArray = `{
    // This is 0 name
    // This is 1 name
    name: '1', 
    arr: [ 
      // this is arr 1
      1, 
      { 
      // this is arr n
      n: 2 } ], // This is arr
    girlfriend: {
      name: '2', // This is 2 name
      hh: {
        name: '3'  // This is 3 name,
      }
    } // This is girlfriend
  }`;
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true,  indent: 2, comment: 'block' })).toMatchInlineSnapshot(`
      "type Arr\$1Type = {
        // this is arr n
        n: number;
      };
      
      type Hh\$2Type = {
        // This is 3 name,
        name: string;
      };
      
      type Girlfriend\$3Type = {
        // This is 2 name
        name: string;
        hh: Hh\$2Type;
      };
      
      type Result\$0Type = {
        // This is 0 name
        // This is 1 name
        name: string;
        // This is arr
        arr: Array< number | Arr\$1Type >;
        // This is girlfriend
        girlfriend: Girlfriend\$3Type;
      }"
    `)
  })
});

describe('comment inline', () => {
  const inputArray = `{
    // This is 0 name
    // This is 1 name
    name: '1', 
    arr: [ 
      // this is arr 1
      1, 
      { 
      // this is arr n
      n: 2 } ], // This is arr
    girlfriend: {
      name: '2', // This is 2 name
      hh: {
        name: '3'  // This is 3 name,
      }
    } // This is girlfriend
  }`;
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true,  indent: 2, comment: 'inline' })).toMatchInlineSnapshot(`
      "type Arr\$1Type = {
        n: number; // this is arr n; 
      };
      
      type Hh\$2Type = {
        name: string; // This is 3 name,; 
      };
      
      type Girlfriend\$3Type = {
        name: string; // This is 2 name; 
        hh: Hh\$2Type;
      };
      
      type Result\$0Type = {
        name: string; // This is 0 name; This is 1 name; 
        arr: Array< number | Arr\$1Type >;
        girlfriend: Girlfriend\$3Type;
      }"
    `)
  })
});