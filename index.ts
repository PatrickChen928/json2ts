import { parse } from './parse';

const input = `{
  "status": {
      "code": 0,
      "message": "OK",
      "description": "",
      "subCode": 0
  },
  "data": {
      "backImg":"http://www.baidu.com", //主图
      "topicList":[
          {
              "tagId":11111, //话题id
              "pic":"http://www.baidu.com", //话题图片
              "title":"测试话题", //话题名称
              "feedCount":100, //话题下动态数
              "viewCount":555, //话题浏览量
              "benefitPointIcon":"http://wererewr.png", //利益点图标 ，即"奖""热"等图标  
              "jumpUrl":"https://h5.weidian.com/m/dynamic/tag-topic.html#/selected?tagName=%s", //跳转链接
              "headImgList":["http://www.baidu.com"] //参与话题的用户头像
          }
      ],
      "hasMore":true, //true表示还有下一页
      "totalNum":20 //数据总数
  }
}`;

console.log(JSON.stringify(parse(`{"status":  ["aaa", "bbb"]}`)));

