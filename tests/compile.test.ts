import { assert, describe, expect, test, it } from 'vitest';
import json2ts, { VALUE_ILLEGAL_ERROR_MESSAGE } from '../src';

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
      }
      "
    `)
  })
});

describe('semicolon end', () => {
  it('expect', () => {
    expect(json2ts(json1, { semicolon: true })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: string;
        age: number;
      };
      "
    `)
  })
});

describe('null', () => {
  it('expect', () => {
    expect(json2ts(`{ name: null }`, { semicolon: true })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: null;
      };
      "
    `)
  })
});

describe('undefined', () => {
  it('expect', () => {
    expect(json2ts(`{ name: undefined }`, { semicolon: true })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: undefined;
      };
      "
    `)
  })
});

describe('boolean', () => {
  it('expect', () => {
    expect(json2ts(`{ name: true, key: false }`, { semicolon: true })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: boolean;
        key: boolean;
      };
      "
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
      };
      "
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
      };
      "
    `)

    expect(json2ts(`{"foo": [{"bar": ""}]}`, {parseArray: true})).toMatchInlineSnapshot(`
    "type Foo\$1Type = {
      bar: string
    }
    
    type Result\$0Type = {
      foo: Array< Foo\$1Type >
    }
    "
  `);
  })
});


describe('not splitType', () => {
  const inputArray = `{ 
    // This is a name key
    name: "bengbeng", // His name is bengbeng
    age: 20, // This is his age
    interest: [ 'swim', 'football', 22 ]
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
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true, splitType: false, comment: 'inline' })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: string; // This is a name key; His name is bengbeng
        age: number; // This is his age
        interest: Array< string | number >;
        girlfriend: {
          name: string;
          age: number;
          exboyfriend: Array< {
            name: string;
            age: number;
          } >;
        };
      };
      "
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
      };
      "
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
      };
      "
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
      };
      "
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
      };
      "
    `)
  })
});

describe('comment block', () => {
  const inputArray = `{
    // This is 0 name
    // This is 1 name
    name: '1', 
    // This is prefix arr
    arr: [ 
      // this is arr 1
      1, 
      { 
      // this is arr n
      n: 2 } ], // This is arr
    // girlfriend prefix comment
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
        // This is prefix arr
        // This is arr
        arr: Array< number | Arr\$1Type >;
        // girlfriend prefix comment
        // This is girlfriend
        girlfriend: Girlfriend\$3Type;
      };
      "
    `)
    expect(json2ts(`{
      "foo": [{
        "bar": 1 //
        "baz": 2
      }],
    }`, { semicolon: true, parseArray: true,  indent: 2, comment: 'block' })).toMatchInlineSnapshot(`
      "type Foo\$1Type = {
        bar: number;
        baz: number;
      };
      
      type Result\$0Type = {
        foo: Array< Foo\$1Type >;
      };
      "
    `)
    expect(json2ts(`{
      "foo": 1 //
    }`, { semicolon: true, parseArray: true,  indent: 2, comment: 'block' })).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        foo: number;
      };
      "
    `)
  });
})

describe('comment inline', () => {
  const inputArray = `{
    // This is 0 name
    // This is 1 name
    name: '1', 
    // This is prefix arr
    arr: [ 
      // this is arr 1
      1, 
      { 
      // this is arr n
      n: 2 } ], // This is arr
      // girlfriend prefix comment
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
        n: number; // this is arr n
      };
      
      type Hh\$2Type = {
        name: string; // This is 3 name,
      };
      
      type Girlfriend\$3Type = {
        name: string; // This is 2 name
        hh: Hh\$2Type;
      };
      
      type Result\$0Type = {
        name: string; // This is 0 name; This is 1 name
        arr: Array< number | Arr\$1Type >; // This is prefix arr; This is arr
        girlfriend: Girlfriend\$3Type; // girlfriend prefix comment; This is girlfriend
      };
      "
    `)
    expect(json2ts(inputArray, { semicolon: true, parseArray: false,  indent: 2, comment: 'inline' })).toMatchInlineSnapshot(`
      "type Hh\$1Type = {
        name: string; // This is 3 name,
      };
      
      type Girlfriend\$2Type = {
        name: string; // This is 2 name
        hh: Hh\$1Type;
      };
      
      type Result\$0Type = {
        name: string; // This is 0 name; This is 1 name
        arr: Array<any>; // This is prefix arr; This is arr
        girlfriend: Girlfriend\$2Type; // girlfriend prefix comment; This is girlfriend
      };
      "
    `)
  })
});

describe('empty array', () => {
  const inputArray = `{
    name: '1', 
    arr: []
  }`;
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true})).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        name: string;
        arr: Array< unknown >;
      };
      "
    `)
  })
});

describe('array with different Object', () => {
  const inputArray = `{
    arr: [
      {
        a: 'name',
        b: 'age'
      },
      {
        a: 'name',
      }
    ]
  }`;
  it('expect', () => {
    expect(json2ts(inputArray, { semicolon: true, parseArray: true, optimizeArrayOptional: true })).toMatchInlineSnapshot(`
      "type Arr\$1Type = {
        a: string;
        b?: string;
      };
      
      type Result\$0Type = {
        arr: Array< Arr\$1Type >;
      };
      "
    `)
  })
});

describe('array with different Object', () => {
  const inputArray = `{
    name: 'name',
    obj: {
      name: 'name',
    }
  }`;
  it('expect', () => {
    expect(json2ts(inputArray, { genType: 'interface' })).toMatchInlineSnapshot(`
      "interface Obj\$1Type {
        name: string
      }
      
      interface Result\$0Type {
        name: string
        obj: Obj\$1Type
      }
      "
    `)
  })
});

describe("parse number with digit", () => {

  it('compile number with digit', () => {
    expect(json2ts(`{num: 0.2}`)).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        num: number
      }
      "
    `)
  })

  it('compile number with -', () => {
    expect(json2ts(`{num: -0.2}`)).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        num: number
      }
      "
    `)
  })

  it('compile number with +', () => {
    expect(json2ts(`{num: +0.2}`)).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        num: number
      }
      "
    `)
  })
})

describe("scientific notation", () => {
  it("compile scientific notation", () => {
    expect(json2ts(`{num: 3.14E+10}`)).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        num: number
      }
      "
    `);
  });

  it("compile scientific notation with -", () => {
    expect(json2ts(`{num: 2.71828e-05}`)).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        num: number
      }
      "
    `);
  });

  it("JSON does not support scientific notation starting with decimal point", () => {
    expect(() => json2ts(`{num: .71828e-05}`)).toThrowError(
      VALUE_ILLEGAL_ERROR_MESSAGE
    );
  });
});

describe("parse with quotes", () => {
  it("compile with quotes", () => {
    expect(json2ts(`{ "foo": "''" }`)).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        foo: string
      }
      "
    `);
    expect(json2ts(`{ "foo": "'', ''" }	`)).toMatchInlineSnapshot(`
      "type Result\$0Type = {
        foo: string
      }
      "
    `);
  });
});