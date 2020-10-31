// pages/index_detail/index_detail.js
import { getIndexDetail, getRecommend } from "../../service/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:{},
    shopLogo:"",
    shopName:"",
    cGoods:0,
    cSells:0, 
    score:[],
    desc:"",
    descKey:"",
    detailImage:[],
    rate:{},
    recommend: [], 
    showBackTop: false,
    isCollect:false,
    userInfo:{}
  },
  // onLoad:function(option){
  //   this._getIndexDetail(option.iid)
  //   this._getRecommend()
  // },
goodsInfo:{},

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
  },
onShow:function(){

    let pages=getCurrentPages()  //页面栈
    let currentPage=pages[pages.length-1]
    let option=currentPage.options
    this._getIndexDetail(option.iid)
    this._getRecommend()

    const userInfo=wx.getStorageSync('userInfo')
    this.setData({
      userInfo
    })
  },
 
   // --------------------发送网络请求--------------------------
  _getIndexDetail(iid){
    getIndexDetail(iid).then(res => {
      console.log(res,'详情页')
      const result=res.data.requestDetail.result
      const iid=res.data.requestDetail.iid
      const checked=true
      const banner=result.itemInfo.topImages
      const img=banner[0]
      const title=result.skuInfo.title
      const newPrice=result.itemInfo.lowNowPrice
      const oldPrice=result.itemInfo.oldPrice
      const discountDesc=result.itemInfo.discountDesc

      const shopInfo=result.shopInfo
      const shopLogo=shopInfo.shopLogo
      const shopName=shopInfo.name
      const cGoods=shopInfo.cGoods
      const cSells=shopInfo.cSells
      const score=shopInfo.score

      const desc=result.detailInfo.detailImage[0].desc
      const descKey=result.detailInfo.detailImage[0].key
      const detailImage=result.detailInfo.detailImage[0].list

      this.setData({
        goods:{
          iid,
          banner,
          img,
          checked,
          title,
          newPrice,
          oldPrice,
          discountDesc
        },
        shopLogo,
        shopName,
        cGoods,
        cSells,
        score,
        desc,
        descKey,
        detailImage,

        // banner,
        // title,
        // newPrice,
        // oldPrice,
        // discountDesc,
      })

      wx.hideLoading()
      
      // 商品是否收藏
      let collect = wx.getStorageSync('collect') || []
      // console.log(collect)
      const isCollect = collect.some(v => v.iid === this.data.goods.iid)
this.setData({
  isCollect
})
      // // 商品是否收藏
      // let collect = wx.getStorageSync('collect') || []
      // console.log(collect)
      // const isCollect = collect.some(v => v.id === this.data.goods.iid)
      // console.log(this.data.goods.iid)
      // this.setData({
      //   isCollect
      // })
       // 判断是否有评论信息
      if (res.data.result.rate.cRate !== 0) {
        const rate = res.data.result.rate.list[0]
        this.setData({
          rate: {
            user_avatar: rate.user.avatar,
            user_name: rate.user.uname,
            content: rate.content,
            images: rate.images,
            style: rate.style,
            explain: rate.explain
          }
        })
      }

      // console.log(this.data.goods)
    })
  },

  _getRecommend(){
    getRecommend().then(res=>{
      // console.log(res)
      const recommend=res.data.data.list

      this.setData({
        recommend
      })
    })
  },

  // ----------------------事件处理---------------------------
  // 监听页面滚动
  onPageScroll(option) {
    // 获取页面滚动的位置
    const scrollTop = option.scrollTop;
    // 页面滚到一定位置时显示 返回顶部
    const flag = scrollTop >= 800;
    if (flag != this.data.showBackTop) {
      this.setData({
        showBackTop: flag
      })
    }
  },
  // 滚到顶部
  goTo(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 600
    })
  },

  // 加入购物车
  handleCartAdd(){
     // 判断用户是否登录
    if(!this.data.userInfo.nickName){
      // console.log('还没登录')
      wx.showToast({
        icon:'none',
        title: '还没登录', 
        mask:true,
        duration:2000
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else{
      // 获取缓存中购物车数组
      const cart = wx.getStorageSync("cart") || []
      // 判断商品对象是否存在于购物车
      let index = cart.findIndex(v => v.iid === this.data.goods.iid)
      if (index === -1) {
        this.data.goods.num = 1
        cart.push(this.data.goods)
      } else {
        cart[index].num++
      }
      wx.setStorageSync('cart', cart)
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        mask: true
      })

    }
  },
  // 点击收藏
  handleCollect(){
    let isCollect=false
    let collect=wx.getStorageSync('collect')||[]
    const index=collect.findIndex(v=>v.iid===this.data.goods.iid)
    if(index!==-1){
      // 商品收藏过  取消收藏
      collect.splice(index,1)
      isCollect=false
      wx.showToast({
        title: '取消成功',
        icon:'success',
        mask:true
      })
    }else{
      collect.push(this.data.goods)
      isCollect=true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
  wx.setStorageSync('collect', collect)
  this.setData({
    isCollect
  })
  console.log(this.data.isCollect)
  }
})