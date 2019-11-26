// pages/tiezi/tiezi.js
var http = require("../../http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:-1,
    tieziInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id:options.id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    http.post(
      "GetTieZiById.ashx",
      {
        id:this.data.id
      },
      (res1)=>{
        console.log(res1);
        that.setData({
          tieziInfo:res1.data.data
        })
      },
      (res2)=>{
        console.log(res2);
      }
    )
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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