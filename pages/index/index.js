// pages/index/index.js
const { wordList } = require('../../data/word-list.js');

Page({
  startStudy() {
    // 显示级别选择对话框
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    wx.showActionSheet({
      itemList: levels,
      success: (res) => {
        const selectedLevel = levels[res.tapIndex];
        wx.navigateTo({
          url: `/pages/study/study?level=${selectedLevel}`,
        });
      },
      fail: (res) => {
        // 用户取消选择
      }
    });
  },

  goToMistakes() {
    wx.navigateTo({
      url: '/pages/mistake/mistake',
    })
  },

  goToFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites',
    })
  },

  // 上传本地数据到云数据库 (使用云函数版)
  initDatabase() {
    wx.showLoading({ title: '上传中...' });
    
    // 预处理数据：移除 id 字段，确保格式正确
    const cleanData = wordList.map(({ id, ...rest }) => rest);

    wx.cloud.callFunction({
      name: 'importData',
      data: {
        words: cleanData
      }
    }).then(res => {
      wx.hideLoading();
      console.log('云函数调用结果：', res);
      
      if (res.result &&(res.result.success || res.result.result)) { // 兼容不同的返回结构
         wx.showToast({
          title: '导入成功',
          icon: 'success'
        });
      } else {
         wx.showModal({
          title: '导入可能失败',
          content: JSON.stringify(res.result),
          showCancel: false
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error("云函数调用失败", err);
      wx.showModal({
        title: '调用失败',
        content: err.toString(),
        showCancel: false
      });
    });
  }
})
