// pages/index/index.js
// const { wordList } = require('../../data/word-list.js'); // 移除本地引用，减小包体积

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
      content: '这将清空云端词库并使用最新生成的预置数据重新填充，耗时约10秒，确定继续吗？',
      success: (res) => {
        if (res.confirm) {
          this.startImportProcess();
        }
      }
    });
  },

  startImportProcess() {
    wx.showLoading({ title: '正在云端初始化...' });
    
    // 直接调用云函数进行全量初始化 (清空+导入)
    // 这样前端不需要打包巨大的 word-list.js 文件
    wx.cloud.callFunction({
      name: 'importData',
      data: { action: 'init' }
    }).then(res => {
      wx.hideLoading();
      console.log('初始化结果:', res);
      
      if (res.result && res.result.success) {
        wx.showToast({
          title: '初始化成功',
          icon: 'success',
          duration: 2000
        });
        // 刷新进度
        setTimeout(() => {
          this.loadLevelProgress();
        }, 2000);
      } else {
        throw new Error(res.result ? res.result.msg : '未知错误');
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('初始化失败', err);
      wx.showModal({ 
        title: '初始化失败', 
        content: '请检查云函数日志或网络连接。\n' + (err.message || JSON.stringify(err)), 
        showCancel: false 
      });
    });
  },

  // uploadInBatches 已被弃用，因为数据现已内置在云函数中
  // uploadInBatches(index = 0) { ... }


  /* 
  // uploadInBatches 已被弃用，因为数据现已内置在云函数中
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
  */
})
