// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: ['商品收藏', '品牌收藏', '店铺收藏','浏览足迹'],
    collect:{}
  },
  onShow:function(){
    const collect=wx.getStorageSync('collect')||[]
    this.setData({
      collect
    })
  },
  detail(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/index_detail/index_detail?iid=' + e.currentTarget.dataset.id,
    })
  }
})