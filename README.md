## json2ts

json-parser > transform > codegen

```js

{
  "a": 123,
  "b": {
    "c": "123"
  },
  "d": [1, 2, 3]
} 

=>

[
  {key: 'a', value: 123, type: 'Number'},
  {key: 'b', value: [
    {key: 'c', value: '123', type: 'String'}
  ], type: 'Object'}
  {key: 'd', value: [1, 2, 3], type: 'Array'},
]

=>

{
  a: Number,
  b: {
    c: String
  },
  d: Array
}

```