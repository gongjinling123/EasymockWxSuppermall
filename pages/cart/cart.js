// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:{},
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },

  onShow:function(){
    // 获取缓存中的收货地址
    const address=wx.getStorageSync('address')
    // 获取购物车数据
    const cart = wx.getStorageSync('cart')||[]
    this.setData({
      address
    }) 
    this.setCart(cart)
  },

  // 获取收货地址
  /**
   * 获取用户对小程序授予获取地址的权限状态 scope
   * 1、当点击获取收货地址的提示框 确定 authSetting scope.address
   * scopt值 true 直接调用获取收货地址的api
   * 2、当用户重来没有调用过获取地址的API
   * scopt值 undefined 直接调用获取地址的API
   * 3、当点击获取收货地址的提示框 取消 
   * scopt值 false
   * (1) 诱导用户自己打开授权页面 
   * (2) 获取收货地址
   */
  handleChooseAddress() {
    // 获取权限状态
    wx.getSetting({
      success: (result) => {
        // 获取权限状态 只要发现一些 属性名很怪异的时候 都要使用[]形式来获取属性值
        const scopeAddress = result.authSetting["scope.address"]
        if (scopeAddress === true || scopeAddress === undefined) {
          wx.chooseAddress({
            success: (result1) => {
              console.log(result1)
              wx.setStorageSync('address', result1)
            }
          })
        }
        else {
          // 诱导用户打开授权页面
          wx.openSetting({
            success: (result2) => {
              // 获取收货地址
              wx.chooseAddress({
                success: (result1) => {
                  console.log(result1)
                  wx.setStorageSync('address', result1)
                }
              })
            }
          })
        }
      }
    })
  },

  // 点击商品的选中
  handleCheck(e){
    // 点击商品的id
    const goods_id = e.target.dataset.id   
    const cart=this.data.cart
    const index=cart.findIndex(v=>v.iid===goods_id)
    cart[index].checked=!cart[index].checked
    this.setCart(cart)
  },

  // 全选
  handleAllChack() {
    let cart =this.data.cart
    let allChecked = this.data.allChecked
    allChecked =! allChecked
    cart.forEach(v=>v.checked=allChecked)
    this.setCart(cart)
  },

  // 封装购物车的状态 价格 数量
  setCart(cart){
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.newPrice
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    totalPrice = totalPrice.toFixed(2)

    // 判断是否为空数组 
    // 空数组调用every这个方法 也是返回true
    allChecked = cart.length != 0 ? allChecked : false
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })
    wx.setStorageSync("cart", cart)
  },

// 编辑商品数量
  handleNumEdit(e){
    const operation=e.currentTarget.dataset.operation
    const goods_id=e.currentTarget.dataset.id
    let cart=this.data.cart
    const index=cart.findIndex(v=>v.iid===goods_id)
    if(cart[index].num===1&&operation===-1){
      wx.showModal({
        title: '温馨提示',
        content: '把该商品从购物车中删除', 
        success:(res)=> {
          if (res.confirm) {
            // 删除商品
            console.log('用户点击确定')
            cart.splice(index,1)
            this.setCart(cart)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      cart[index].num += operation
      this.setCart(cart)
    }
  },

  handlePay(){
    const address=this.data.address
    const totalNum=this.data.totalNum
    if(!address.userName){
      wx.showToast({
        title: '还没添加收货地址',
        icon: 'none'
      })
      return
    }
    if(totalNum===0){
      wx.showToast({
        title: '请选择要购买的商品',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  },
// 返回详情页
  handleDetail(e){
    // console.log(e)
    wx.navigateTo({
      url: '/pages/index_detail/index_detail?iid=' + e.currentTarget.dataset.id,
    })
  }

})