const assert = require('assert');
const { parse, transform } = require('../lib/index.js');

let json1 = `{
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

console.log(parse(json1));
console.log(transform(parse(json1)))

// assert.deepEqual(parse(json1), {"type":0,"children":[{"key":"status","value":[{"key":"name","value":"222","type":"Number","loc":{"start":{"offset":26,"column":9,"line":3},"end":{"offset":48,"column":9,"line":4},"source":"\"name\": 222, \n        "}},{"key":"value","value":[{"key":"key","value":"value","type":"String","loc":{"start":{"offset":71,"column":13,"line":5},"end":{"offset":94,"column":9,"line":6},"source":"\"key\": \"value\"\n        "}}],"type":"Object","loc":{"start":{"offset":48,"column":9,"line":4},"end":{"offset":100,"column":5,"line":7},"source":"\"value\": {\n            \"key\": \"value\"\n        }\n    "}}],"type":"Object","loc":{"start":{"offset":6,"column":5,"line":2},"end":{"offset":107,"column":5,"line":8},"source":"\"status\": {\n        \"name\": 222, \n        \"value\": {\n            \"key\": \"value\"\n        }\n    },\n    "}},{"key":"data","value":[{"key":"name","value":"222","type":"Number","loc":{"start":{"offset":125,"column":9,"line":9},"end":{"offset":147,"column":9,"line":10},"source":"\"name\": 222, \n        "}},{"key":"value","value":"333","type":"String","loc":{"start":{"offset":147,"column":9,"line":10},"end":{"offset":166,"column":5,"line":11},"source":"\"value\": '333'\n    "}}],"type":"Object","loc":{"start":{"offset":107,"column":5,"line":8},"end":{"offset":168,"column":1,"line":12},"source":"\"data\": {\n        \"name\": 222, \n        \"value\": '333'\n    }\n"}}]})

// console.log(JSON.stringify(parse(`{
//     "status": {
//         "name": 222, 
//         "value": '333'
//     },
//     "data": {
//         "name": 222, 
//         "value": '333'
//     }
// }`)));

// const input = `{
//   "status": {
//       "code": 0,
//       "message": "OK",
//       "description": "",
//       "subCode": 0
//   },
//   "data": {
//       "backImg":"http://www.baidu.com", //主图
//       "topicList":[
//           {
//               "tagId":11111, //话题id
//               "pic":"http://www.baidu.com", //话题图片
//               "title":"测试话题", //话题名称
//               "feedCount":100, //话题下动态数
//               "viewCount":555, //话题浏览量
//               "benefitPointIcon":"http://wererewr.png", //利益点图标 ，即"奖""热"等图标  
//               "jumpUrl":"https://h5.weidian.com/m/dynamic/tag-topic.html#/selected?tagName=%s", //跳转链接
//               "headImgList":["http://www.baidu.com"] //参与话题的用户头像
//           }
//       ],
//       "hasMore":true, //true表示还有下一页
//       "totalNum":20 //数据总数
//   }
// }`;

