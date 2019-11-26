//index.js
//获取应用实例
const app = getApp()
var http = require("../../http.js");

Page({
  data: {
    //====搜索框参数====
    addflag: false,  //判断是否显示搜索框右侧部分
    searchstr: '',
    //=================

    tiezis:[],
    pagenum:1,
  },

  onShow:function(){
    var that = this;
    that.setData({
      tiezis:[],
      pagenum:1,
    })
    this.loadTieZis();

  },

  loadTieZis:function(){
    var that = this;
    http.post(
      "GetAllTieZiByPage.ashx",
      {
        page: that.data.pagenum,
      },
      (res1) => {
        console.log(res1);
        var tempArr = that.data.tiezis;

        Date.prototype.Format = function (fmt) { //author: meizz
          let o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
        };

        res1.data.data.forEach(function (item, index, a) {

          var title = item.title;
          if(item.title.length > 10){
            title = title.slice(0,9) + "......";
          }

          var content = item.content;
          if(item.content.length > 50){
            content = content.slice(0,49) + "......";
          }

          var data = {
            id: item.id,
            category: "",
            title: title,
            content: content,
            images: [],
            releasetime: new Date(item.releasetime).Format("yyyy年MM月dd日 hh:mm"),
            status: item.status,
            userInfo: {}
          }
          http.post(
            "GetCategoryById.ashx",
            {
              id: item.category
            },
            (res5) => {
              console.log(res5);

              data.category = res5.data.data.name;

              http.post(
                "GetUserById.ashx",
                {
                  id: item.userid
                },
                (res3) => {
                  console.log(res3);
                  data.userInfo = res3.data.data;
                  console.log(data);
                  if (item.status == 0) {
                    tempArr.push(data)
                  }


                  if (res1.data.data.length == index + 1) {
                    that.setData({
                      tiezis: tempArr,
                    })
                    wx.stopPullDownRefresh();
                  }
                },
                (res4) => {
                  console.log(res4);
                }
              );

            },
            (res6) => {

            }
          );



        });

      },
      (res2) => {
        console.log(res2);
      }
    );

    that.data.pagenum++;
  },

  //==============================搜索框事件列表==============================
  // 搜索框右侧 事件
  addhandle() {
    console.log('触发搜索框右侧事件')
  },

  //搜索框输入时触发
  searchList(ev) {
    let e = ev.detail;
    this.setData({
      searchstr: e.detail.value
    })
  },
  //搜索回调
  endsearchList(e) {
    console.log('查询数据')
  },
  // 取消搜索
  cancelsearch() {
    this.setData({
      searchstr: ''
    })
  },
  //清空搜索框
  activity_clear(e) {

    this.setData({
      searchstr: ''
    })
  },

  //================================================================


  plusBtnClick:(res)=>{
    console.log(res);
    wx.navigateTo({
      url: '/pages/addtiezi/addtiezi',
    })
  },

  onReachBottom:function(res){
    this.loadTieZis();
  },

  onPullDownRefresh:function(res){
    this.onShow();
    
  }
})
