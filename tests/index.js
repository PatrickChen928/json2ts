const assert = require('assert');
const { parse, transform } = require('../lib/index.js');

let json100 = `{
    status: {
        'name': 222,  //这是一个名字
        "value": {
            "key": "value"
        }
    },
    //   这是data数据  
    "data": {
        // 这是一个数组
        arr: [12, '13', {
            "arrName": [22]
        }],
        "name": 222, 
        "value": '333'
    }
}`

const json0 = `{}`;
const json1 = `{
    "name": "aphto",
    "age": 18
}`;

console.log(parse(json0));
console.log(transform(parse(json0)))

assert.deepEqual(parse(json0), { key: 'root', type: 'Root', value: [] });
assert.deepEqual(transform(parse(json0)), { key: 'root', type: 'Root', value: [] });

assert.deepEqual(parse(json1), {
    key: 'root',
    type: 'Root',
    value: [
      {
        key: 'name',
        value: 'aphto',
        type: 'String',
        loc: {
          start: { offset: 6, column: 5, line: 2 },
          end: { offset: 21, column: 20, line: 2 },
          source: '"name": "aphto"'
        }
      },
      {
        key: 'age',
        value: '18',
        type: 'Number',
        loc: {
          start: { offset: 27, column: 5, line: 3 },
          end: { offset: 36, column: 14, line: 3 },
          source: '"age": 18'
        }
      }
    ]
  });

assert.deepEqual(transform(parse(json1)), {"key":"root","type":"Root","value":[{"key":"name","value":"aphto","type":"String","loc":{"start":{"offset":6,"column":5,"line":2},"end":{"offset":21,"column":20,"line":2},"source":"\"name\": \"aphto\""}},{"key":"age","value":"18","type":"Number","loc":{"start":{"offset":27,"column":5,"line":3},"end":{"offset":36,"column":14,"line":3},"source":"\"age\": 18"}}]});