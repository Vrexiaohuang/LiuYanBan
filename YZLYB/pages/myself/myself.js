// pages/myself/myself.js
var http = require("../../http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
  },

  

  login: function(d){
    console.log(d);
    wx.showLoading({
      title: '登陆中',
    })
    wx.login({
      success:(res1)=>{
        http.post(
          "GetOpenID.ashx",
          {code:res1.code},
          (res2)=>{
            console.log(res2);
            http.post(
              "AddUser.ashx",
              {
                openid:res2.data.data.openid,
                nickName:d.detail.userInfo.nickName,
                avatarUrl: d.detail.userInfo.avatarUrl,
                gender: d.detail.userInfo.gender,
                studyNumber: -1,
                realName:'',
                grade:''
              },
              (res11)=>{
                console.log(res11);
                wx.hideLoading();
                wx.showToast({
                  title: '登陆成功',
                })
                if(res11.data.code == 200){
                  wx.setStorage({
                    key: 'openID',
                    data: res2.data.data.openid,
                  })
                  wx.setStorage({
                    key: 'userInfo',
                    data: d.detail.userInfo,
                  })
                  this.onShow();
                } else if (res11.data.code == 600){
                  wx.setStorage({
                    key: 'openID',
                    data: res2.data.data.openid,
                  })
                  wx.setStorage({
                    key: 'userInfo',
                    data: d.detail.userInfo,
                  })
                  this.onShow();
                }
              }
            );
          },
          (res3)=>{
            console.log(res3);
            wx.hideLoading();
            wx.showToast({
              title: '登陆失败，系统错误！',
              icon:'none'
            })
          }
        );

      }
    })
  },

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
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.data
        })
      },
      fail: (res2) => {
        console.log(res2);
      }
    })
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

  }
})