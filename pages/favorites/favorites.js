// pages/favorites/favorites.js
Page({
  data: {
    isLoading: true
  },

  onLoad() {
    // 直接跳转到学习页面，学习页面会根据 mode 自动加载收藏列表
    wx.redirectTo({
      url: '/pages/study/study?mode=favorite'
    });
  }
})

