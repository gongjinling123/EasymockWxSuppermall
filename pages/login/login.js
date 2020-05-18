// pages/login/login.js
Page({
  handleGetUserInfo(e){
    const userInfo=e.detail.userInfo
    wx.setStorageSync('userInfo', userInfo)
    wx.navigateBack({
      detail:1
    })
  }
})