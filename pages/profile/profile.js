// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    collectNum:0
  },
  onShow(){
    const userInfo=wx.getStorageSync('userInfo')
    const collectNum=wx.getStorageSync('collect')
    this.setData({
      userInfo,
      collectNum:collectNum.length
    })
  },
  handleLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }
})