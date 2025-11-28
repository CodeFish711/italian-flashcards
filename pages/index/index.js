// pages/index/index.js
const { wordList } = require('../../data/word-list.js');

Page({
  data: {
    levels: [
      { level: 'A1', progress: 0, learned: 0, total: 0 },
      { level: 'A2', progress: 0, learned: 0, total: 0 },
      { level: 'B1', progress: 0, learned: 0, total: 0 },
      { level: 'B2', progress: 0, learned: 0, total: 0 },
      { level: 'C1', progress: 0, learned: 0, total: 0 },
      { level: 'C2', progress: 0, learned: 0, total: 0 }
    ]
  },

  onLoad() {
    // 页面加载时获取进度
    this.loadLevelProgress();
  },

  onShow() {
    // 每次显示页面时刷新进度
    this.loadLevelProgress();
  },

  // 加载每个级别的进度
  loadLevelProgress() {
    // 使用聚合云函数获取统计数据，替代前端多次查询
    wx.cloud.callFunction({
      name: 'getStudyStats'
    }).then(res => {
      console.log('getStudyStats result:', res); // 添加日志方便调试
      if (res.result && res.result.success) {
        this.setData({
          levels: res.result.data
        });
      } else {
        console.error('获取统计数据失败', res);
        // 如果云函数报错，可以尝试降级为本地计算（如果有本地缓存的话），或者保持 0
        wx.showToast({
          title: '同步进度失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('调用统计云函数失败', err);
    });
  },

  startLevelStudy(e) {
    const level = e.currentTarget.dataset.level;
    wx.navigateTo({
      url: `/pages/study/study?level=${level}`,
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
    wx.showModal({
      title: '确认初始化',
      content: '这将清空现有云端词库并重新上传，确定继续吗？',
      success: (res) => {
        if (res.confirm) {
          this.startImportProcess();
        }
      }
    });
  },

  startImportProcess() {
    wx.showLoading({ title: '正在强力清空旧数据...' });
    
    // 1. 调用新的强力清空云函数
    wx.cloud.callFunction({
      name: 'forceClear'
    }).then(res => {
      console.log('清空结果:', res);
      if (res.result && res.result.success) {
        wx.showToast({ title: `清理完成: ${res.result.deleted}`, icon: 'none' });
        // 2. 开始分批上传
        this.uploadInBatches();
      } else {
        throw new Error('清空返回失败');
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('清空失败', err);
      // 如果云函数调用失败，提示用户手动清空
      wx.showModal({ 
        title: '自动清空失败', 
        content: '请进入“云开发控制台 -> 数据库 -> words 集合”，手动删除所有数据，然后再点击初始化。', 
        showCancel: false 
      });
    });
  },

  uploadInBatches() {
    wx.showLoading({ title: '准备上传...' });
    
    // 预处理数据：移除 id 字段
    const cleanData = wordList.map(({ id, ...rest }) => rest);
    
    // 分批次上传，每次 100 条（云函数单次调用有大小限制）
    const BATCH_SIZE = 100;
    const totalBatches = Math.ceil(cleanData.length / BATCH_SIZE);
    let currentBatch = 0;
    
    const uploadBatch = () => {
      if (currentBatch >= totalBatches) {
        wx.hideLoading();
        wx.showToast({
          title: '全部导入完成',
          icon: 'success'
        });
        this.loadLevelProgress(); // 刷新进度
        return;
      }
      
      const start = currentBatch * BATCH_SIZE;
      const end = start + BATCH_SIZE;
      const batchData = cleanData.slice(start, end);
      
      wx.showLoading({ 
        title: `上传中 ${currentBatch + 1}/${totalBatches}` 
      });
      
      wx.cloud.callFunction({
        name: 'importData',
        data: {
          words: batchData
        }
      }).then(res => {
        console.log(`Batch ${currentBatch + 1} result:`, res);
        
        if (res.result && (res.result.success || res.result.result)) {
          currentBatch++;
          uploadBatch(); // 递归上传下一批
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '部分导入失败',
            content: `第 ${currentBatch + 1} 批次失败: ` + JSON.stringify(res.result),
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
    };
    
    // 开始第一批上传
    uploadBatch();
  }
})
