// pages/category/category.js
import { getCategory, getSubcategory} from '../../service/category.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    category:{},
    currentIndex:0,
    maitKey: 3627
  },
  onShow(){
  },
  onLoad: function (options){
    wx.showLoading({
      title: '加载中',
    })

    this._getCategory()
    this._getSubcategory(this.data.maitKey) 
  },
  // --------------网络请求------------
  // 左侧菜单
  _getCategory(){
    getCategory().then(res => {
      const list = res.data.data.category.list
      // console.log(list)
      this.setData({
        list
      })
      wx.hideLoading()
    })
  },


// 右侧内容
  _getSubcategory(maitKey) {
    getSubcategory(maitKey).then(res => {
        console.log(res,'分类')
      const category=res.data.requestDetail.data.list
      this.setData({
        category
      })
      wx.pageScrollTo({
        scrollTop: 0
      }) 
      })
    },



  handleMenu(e) {
    // console.log(e)
    const maitKey = e.currentTarget.dataset.id
    // console.log(maitKey)
    const currentIndex = e.currentTarget.dataset.index
    this.setData({
      currentIndex,
      maitKey
    })
    this._getSubcategory(this.data.maitKey) 
  },
})