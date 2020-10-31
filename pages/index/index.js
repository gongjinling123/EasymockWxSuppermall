//index.js
import { getMultiData, getGoodsData} from "../../service/index.js"
const TOP=1000
const types=['pop','new','sell']
//获取应用实例
const app = getApp()

Page({ 
  data:{ 
    banner:[],
    recommend:[],
    titles:['流行','新款','精选'],
    goods:{
      'pop': { page: 0, list: [] },
      'new': { page: 0, list: [] },
      'sell': { page: 0, list: [] }
    },
    currentType:'pop',
    isTabFixed:false,
    tabScrollTop:0,
    showBackTop:false

  },
  onLoad:function(options){
    wx.showLoading({
      title: '加载中',
    })

    // 请求轮播图和推荐数据
    this._getMultiData()

    // 请求商品数据
    this._getGoodsData('pop')
    this._getGoodsData('new')
    this._getGoodsData('sell')
  },
  onShow(){
  },
  // ----------------------网络请求函数---------------------------
  _getMultiData(){
    getMultiData().then(res => {
      console.log(res,'轮播图')
      const banner = res.data.data.banner.list
      const recommend = res.data.data.recommend.list
      this.setData({
        banner,
        recommend 
      })
    })  
  },
  _getGoodsData(type){
    // 获取页码
    const page=this.data.goods[type].page+1
    // 发送网络请求
    getGoodsData(type,page).then(res => {
      console.log(res.data.requestDetail,'商品列表')
      // 获取数据
      const list=res.data.requestDetail.data.list
      // 将数据设置到type的list中
      const oldList=this.data.goods[type].list
      oldList.push(...list)
      // 将数据设置在data中的goods
      const typeKey=`goods.${type}.list`
      const pageKey=`goods.${type}.page`
      this.setData({
        [typeKey]: oldList,
        [pageKey]:page
      })
      wx.hideLoading()
    })
  },

  // ----------------------事件监听函数----------------------------
  handleTabClick(e){
    // 获取流行 新款 精选 的index
    const index=e.detail.index
    console.log(index)
    // 设置currentType
    this.setData({
      currentType:types[index]
    })
  },
  // 流行 新款 精选 停留效果  图片加载完成后计算距离顶部的高度
  handleImageLoad(){
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      this.data.tabScrollTop=rect.top
    }).exec()
  },
 

  // 监听页面滚到底部
  onReachBottom(){
    // 加载下一页数据
    this._getGoodsData(this.data.currentType )
  },

  // 监听页面滚动
  onPageScroll(option){
    // 获取页面滚动的位置
    const scrollTop=option.scrollTop;
  // 页面滚到一定位置时显示 返回顶部
    const flag=scrollTop>=800;
    if(flag!=this.data.showBackTop){
      this.setData({
        showBackTop:flag
      })
    }
// 流行 新款 精选停留在顶部
    const flag1 = scrollTop >= this.data.tabScrollTop;
    if (flag1 != this.data.isTabFixed) {
      this.setData({
        isTabFixed: flag1
      })
    }
  }, 
  // 页面跳转
  detail(e){
    console.log(e.target.dataset.iid)
    wx.navigateTo({
      url: '/pages/index_detail/index_detail?iid='+e.target.dataset.iid,
    })
  },

  // 滚到顶部
  goTo(e){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 600
    }) 
  }
})

