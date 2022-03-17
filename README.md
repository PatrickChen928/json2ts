# Json2ts

一个`编译原理`的实践项目，解析Json，输出 TS 类型

json-parser > transform > codegen

## Features

- 支持层级嵌套
- 支持数组解析
- 支持行内和换行的注释解析
- 支持key值无引号模式

## demo 

```js

{
  "a": 123,
  "b": {
    "c": "123"
  },
  d: [1, 2, 3]
} 

=>

[
  {key: 'a', value: 123, type: 'Number'},
  {key: 'b', value: [
    {key: 'c', value: '123', type: 'String'}
  ], type: 'Object'}
  {key: 'd', value: [1, 2, {e: '222'}], type: 'Array'},
]

=>

{
  a: number,
  b: {
    c: string
  },
  d: Array<number | {e: string}>;
}

```

## TODO

- [ ] 类型复用、继承
- [ ] required个性化