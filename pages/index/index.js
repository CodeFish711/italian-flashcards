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
    const db = wx.cloud.database();
    
    // 获取所有单词，按级别分组统计
    db.collection('words').get().then(res => {
      const allWords = res.data;
      
      // 获取学习进度（只要有学习记录就算已学）
      db.collection('study_progress').get().then(progressRes => {
        const learnedWords = new Set();
        progressRes.data.forEach(p => {
          // 只要有学习记录就算已学（不一定要mastered）
          if (p.word_id) {
            learnedWords.add(p.word_id);
          }
        });

        // 计算每个级别的进度
        const levelStats = {};
        allWords.forEach(word => {
          const level = word.level || 'A1';
          if (!levelStats[level]) {
            levelStats[level] = { total: 0, learned: 0 };
          }
          levelStats[level].total++;
          if (learnedWords.has(word._id)) {
            levelStats[level].learned++;
          }
        });

        // 更新数据
        const updatedLevels = this.data.levels.map(item => {
          const stats = levelStats[item.level] || { total: 0, learned: 0 };
          const progress = stats.total > 0 ? Math.round((stats.learned / stats.total) * 100) : 0;
          return {
            ...item,
            total: stats.total,
            learned: stats.learned,
            progress: progress
          };
        });

        this.setData({ levels: updatedLevels });
      }).catch(err => {
        console.error('加载进度失败', err);
        // 如果加载失败，至少显示总数
        const levelStats = {};
        allWords.forEach(word => {
          const level = word.level || 'A1';
          if (!levelStats[level]) {
            levelStats[level] = { total: 0, learned: 0 };
          }
          levelStats[level].total++;
        });
        const updatedLevels = this.data.levels.map(item => {
          const stats = levelStats[item.level] || { total: 0, learned: 0 };
          return {
            ...item,
            total: stats.total,
            learned: 0,
            progress: 0
          };
        });
        this.setData({ levels: updatedLevels });
      });
    }).catch(err => {
      console.error('加载单词失败', err);
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
  },

  // 导入 Wiktionary 数据（从本地文件读取）
  importWiktionaryData() {
    wx.showActionSheet({
      itemList: ['导入 A1 级别', '导入 A2 级别', '导入 B1 级别', '导入 B2 级别', '导入 C1 级别', '导入 C2 级别'],
      success: (res) => {
        const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const selectedLevel = levels[res.tapIndex];
        
        wx.showModal({
          title: '导入 Wiktionary 数据',
          content: `确定要导入 ${selectedLevel} 级别的单词吗？\n\n注意：需要先将转换后的 JSON 文件放在 data/ 目录下，命名为 wiktionary_words_${selectedLevel}.json`,
          success: (modalRes) => {
            if (modalRes.confirm) {
              this.loadWiktionaryFromFile(selectedLevel);
            }
          }
        });
      }
    });
  },

  // 从本地文件加载 Wiktionary 数据
  loadWiktionaryFromFile(level) {
    wx.showLoading({ title: '读取文件中...' });
    
    // 尝试读取本地文件（需要将文件放在 data 目录下）
    // 注意：小程序中无法直接读取项目外的文件，需要将 JSON 文件放在项目中
    try {
      // 方案：将转换后的 JSON 文件内容复制到 JS 文件中，然后导入
      // 或者使用 require 导入（如果文件在项目中）
      const filePath = `../../data/wiktionary_words_${level}.js`;
      
      // 由于小程序限制，建议使用以下方式：
      // 1. 将 JSON 数据复制到 JS 文件中作为模块导出
      // 2. 或者通过云存储上传文件后读取
      
      wx.showModal({
        title: '提示',
        content: `请使用以下方式导入：\n\n1. 运行 Python 脚本生成 JSON 文件\n2. 将 JSON 内容复制到 data/wiktionary_words_${level}.js 中\n3. 在小程序中 require 该文件并调用云函数导入\n\n或者直接调用云函数，传入单词数组。`,
        showCancel: false
      });
      
      wx.hideLoading();
      
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: '读取失败',
        icon: 'none'
      });
    }
  }
})
