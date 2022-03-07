const assert = require('assert');
const { parse } = require('../lib/index.js');

assert.deepEqual(parse(`{
    "status": {
        "name": 222, 
        "value": '333'
    },
    "data": {
        "name": 222, 
        "value": '333'
    }
}`), {"type":0,"children":[{"key":"status","value":[{"key":"name","value":"222","type":"Number","loc":{"offset":48,"column":9,"line":4}},{"key":"value","value":"333","type":"String","loc":{"offset":67,"column":5,"line":5}}],"type":"Object","loc":{"offset":74,"column":5,"line":6}},{"key":"data","value":[{"key":"name","value":"222","type":"Number","loc":{"offset":114,"column":9,"line":8}},{"key":"value","value":"333","type":"String","loc":{"offset":133,"column":5,"line":9}}],"type":"Object","loc":{"offset":135,"column":1,"line":10}}]})

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

