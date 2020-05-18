// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart1: {},
    totalPrice: 0,
    totalNum: 0
  },

  onShow: function () {
    // 获取缓存中的收货地址
    const address = wx.getStorageSync('address')
    // 获取购物车数据
    let cart1 = wx.getStorageSync('cart') || []
    cart1=cart1.filter(v=>v.checked)
    let totalPrice = 0
    let totalNum = 0
    cart1.forEach(v => {
        totalPrice += v.num * v.newPrice
        totalNum += v.num
    })
    totalPrice=totalPrice.toFixed(2)
    this.setData({
      cart1,
      address,
      totalNum,
      totalPrice
    })
    wx.setStorageSync("cart1", cart1)
  },
  detail(e){
    // console.log(e.currentTarget.dataset.iid)
    wx.navigateTo({
      url: '/pages/index_detail/index_detail?iid=' + e.currentTarget.dataset.iid,
    })
  }
})