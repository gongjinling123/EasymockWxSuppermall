// components/w-tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap(e){
      const index=e.currentTarget.dataset.index
      this.setData({
        currentIndex:index
      })
      // 通知页面内部的点击事件
      this.triggerEvent('itemclick',{index,title:this.properties.title[index]},{})
    }
  }
})
