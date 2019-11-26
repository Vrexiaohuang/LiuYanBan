// pages/addtiezi/addtiezi.js
var http = require("../../http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //===================================
    start: "请选择分类.....",
    nowid:-1,
    slist: null,
    isstart: false,
    openimg: "../../images/list.png",
    offimg: "../../images/list1.png",
    //====================================
    chooseImages:[],

  },

  //=================================================================
  opens: function (e) {
    console.log(e);
    switch (e.currentTarget.dataset.item) {
      case "1":
        if (this.data.isstart) {
          this.setData({
            isstart: false,
          });
        }
        else {
          this.setData({
            isstart: true,
          });
        }
        break;
    }
  },
  onclicks1: function (e) {
    var index = e.currentTarget.dataset.index;
    let name = this.data.slist[index].name;
    this.setData({
      isstart: false,
      isfinish: false,
      isdates: false,
      nowid: this.data.slist[index].id,
      start: this.data.slist[index].name,
      finish: "目的地"
    })
    console.log(this.data.nowid);
  },
  //=================================================================

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    http.post(
      "GetAllCategory.ashx",
      {},
      (res)=>{
        console.log(res);
        wx.hideLoading();
        this.setData({
          slist:res.data.data,
        });
      },
      (res1)=>{
        wx.hideLoading();
        wx.showToast({
          title: '加载活动失败',
          icon:'none'
        })
      }
    )
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //选择图片
  chooseImages:function(){
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      success: (res)=> {
        console.log(res);
        let tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        if (that.data.chooseImages.length + tempFilePaths.length > 9){
          wx.showToast({
            title: '图片最大数量不超过9张！',
            icon: 'none',
          })
          return;
        }
        var tempArray = that.data.chooseImages;
        tempFilePaths.forEach(function(item,index,a){
          tempArray.push(item);
        });
        
        this.setData({
          chooseImages: tempArray,
        });
        console.log(that.data.chooseImages);
      },
    })
  },

  closeBtn:function(res){
    console.log(res);
    var tempArray = this.data.chooseImages;
    tempArray.splice(res.target.dataset.index,1);
    this.setData({
      chooseImages:tempArray,
    });
  },

  fabuBtn:function(res){
    console.log(res);

    var imageUrls = [];
    var that = this;

    wx.showLoading({
      title: '发帖中',
    });
    var title = res.detail.value.title;
    var category = that.data.nowid;
    var content = res.detail.value.content;
    var openid = null;
    wx.getStorage({
      key: 'openID',
      success: function(res) {
        openid = res.data;

        if (title.length == 0) {
          wx.hideLoading();
          wx.showToast({
            title: '请输入标题',
            icon: 'none'
          })
          return;
        }
        if (category == -1) {
          wx.hideLoading();
          wx.showToast({
            title: '请选择分类',
            icon: 'none'
          })
          return;
        }
        if (content.length == 0) {
          wx.hideLoading();
          wx.showToast({
            title: '请输入内容',
            icon: 'none'
          })
          return;
        }

        if (that.data.chooseImages.length > 0) {
          that.data.chooseImages.forEach(function (item, index, a) {
            console.log(item);
            console.log('image' + index);
            wx.uploadFile({
              url: 'http://localhost:44329/API/AddImage.ashx',
              filePath: item,
              name: 'image' + index,
              success: function (res1) {
                console.log(res1);
                var data = JSON.parse(res1.data);
                console.log(data.imageurl);
                imageUrls.push(data.imageurl);
                if (index == that.data.chooseImages.length - 1) {
                  wx.hideLoading();
                  console.log(imageUrls);

                  http.post(
                    "AddImageGroup.ashx",
                    {},
                    (res3) => {
                      console.log(res3);

                      http.post(
                        "AddImages.ashx",
                        {
                          imagegroupid: res3.data.id,
                          images: JSON.stringify(imageUrls)
                        },
                        (res5) => {
                          console.log(res5);

                          http.post(
                            "AddTieZi.ashx",
                            {
                              "openid": openid,
                              "title": title,
                              "category": category,
                              "content": content,
                              "imagegroup": res3.data.id
                            },
                            (res7) => {
                              console.log(res7);
                              wx.hideLoading();
                              wx.showToast({
                                title: '发帖成功！',
                                duration: 2000,
                              })
                              setTimeout(function () {
                                wx.switchTab({
                                  url: '/pages/index/index'
                                })
                              }, 2001);
                            },
                            (res8) => {
                              console.log(res8);
                              wx.hideLoading();
                              wx.showToast({
                                title: '发帖失败！',
                                icon: "none"
                              })
                            }
                          )

                        },
                        (res6) => {
                          console.log(res6);
                        }
                      )

                    },
                    (res4) => {
                      console.log(res4);
                    }
                  )
                }
              },
              fail: function (res2) {
                console.log(res2);
              }
            })
          })
        } else {
          http.post(
            "AddTieZi.ashx",
            {
              "openid": openid,
              "title": title,
              "category": category,
              "content": content,
              "imagegroup": -1
            },
            (res7) => {
              console.log(res7);
              wx.hideLoading();
              wx.showToast({
                title: '发帖成功！',
                duration: 2000,
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }, 2001);
            },
            (res8) => {
              console.log(res8);
              wx.hideLoading();
              wx.showToast({
                title: '发帖失败！',
                icon: "none"
              })
            }
          )
        }


      },
      fail:function(res1){
        wx.showToast({
          title: '发帖之前，请先登陆！',
          icon:'none',
          duration:2000,
          success:(res)=>{
            setTimeout(function(){
              console.log(res);
              wx.switchTab({
                url: '/pages/myself/myself'
              })
            },2001);
          }
        });
        // wx.navigateTo({
        //   url: '',
        // });
        
      }
    })
    



    
    
    
    return;



    

    // var that = this;
    // console.log(document);
    // var title = document.getElementById("title").value;
    // console.log(title);
  },

})