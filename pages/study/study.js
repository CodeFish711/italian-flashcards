// pages/study/study.js
// const { wordList } = require('../../data/word-list.js'); // 不再使用本地数据

// 简单的词性映射表
const POS_MAP = {
  'n.': '名词',
  'n.m.': '阳性名词',
  'n.f.': '阴性名词',
  'v.': '动词',
  'adj.': '形容词',
  'adv.': '副词',
  'prep.': '介词',
  'conj.': '连词',
  'int.': '感叹词',
  'pron.': '代词'
};

Page({

  /**
   * Page initial data
   */
  data: {
    currentIndex: 0,
    totalWords: 0,
    wordList: [], // Store fetched words locally for the session
    currentWord: {},
    hasAnswered: false,
    showFeedback: false, // Controls "Next" button visibility
    isCorrect: false,    // Track if the answer was correct
    showAnswer: false,   // Show correct answer when wrong
    showConfetti: false,  // Trigger for confetti animation
    confettiList: [],     // 彩带列表
    showCelebrationText: false, // 显示庆祝文字
    celebrationText: '',  // 庆祝文字内容
    isLoading: true,
    isFavorited: false,   // 当前单词是否已收藏
    slideOffset: 0,      // 滑动偏移量 (百分比)
    slideDirection: '',   // 滑动方向: 'slide-left' 或 'slide-right'
    showAddMistakeBtn: false, // 显示"加入错题本"按钮
    studyMode: 'normal',  // 'normal', 'mistake', 'favorite'
    currentWordProgressId: null, // 当前单词在 study_progress 中的 _id（用于删除）
    rotateY: 0,           // 3D旋转角度
    showRemoveFromMistake: false, // 显示"从错题本删除"按钮
    modeLabel: '正常学习'  // 模式标签文字
  },

  // 手势相关变量
  touchStartX: 0,
  touchStartY: 0,
  touchEndTime: 0,

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.options = options; // 保存 options 供后续使用
    
    // 如果只有 mode 参数（从错题本/收藏夹直接进入），加载整个列表
    if (options.mode && !options.wordId) {
      this.loadListByMode(options.mode);
    } else if (options.wordId) {
      // 如果有 wordId，加载指定单词（兼容旧逻辑）
      this.loadSpecificWord(options.wordId, options.mode);
    } else if (options.level) {
      // 如果指定了 level，加载该级别的单词
      this.fetchWordsByLevel(options.level);
    } else {
      // 正常模式：加载所有单词
      this.fetchWordsFromCloud();
    }
  },

  // 根据级别加载单词
  fetchWordsByLevel(level) {
    wx.showLoading({ title: '加载中...' });
    const db = wx.cloud.database();
    
    db.collection('words')
      .where({
        level: level
      })
      .get()
      .then(res => {
        wx.hideLoading();
        const words = res.data;
        
        if (words.length === 0) {
          wx.showModal({
            title: '提示',
            content: `没有找到 ${level} 级别的单词，请先初始化数据`,
            showCancel: false,
            success: () => wx.navigateBack()
          });
          return;
        }

        this.setData({
          wordList: words,
          totalWords: words.length,
          isLoading: false,
          modeLabel: '正常学习'
        });
        
        this.loadWord(0);
      })
      .catch(err => {
        wx.hideLoading();
        console.error(err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  // 根据 mode 加载整个列表（错题本或收藏夹）
  loadListByMode(mode) {
    wx.showLoading({ title: '加载中...' });
    const db = wx.cloud.database();
    
    if (mode === 'mistake') {
      // 加载所有错题
      db.collection('study_progress')
        .where({
          mistake_count: db.command.gt(0)
        })
        .orderBy('last_review_time', 'desc')
        .get()
        .then(res => {
          wx.hideLoading();
          const progressList = res.data;
          
          if (progressList.length === 0) {
            wx.showModal({
              title: '提示',
              content: '错题本为空',
              showCancel: false,
              success: () => wx.navigateBack()
            });
            return;
          }
          
          const wordIds = progressList.map(p => p.word_id);
          const promises = wordIds.map(id => db.collection('words').doc(id).get());
          
          Promise.all(promises).then(wordRes => {
            const words = wordRes.map((w, i) => ({
              ...w.data,
              _progressId: progressList[i]._id
            }));
            
            this.setData({
              wordList: words,
              totalWords: words.length,
              isLoading: false,
              studyMode: 'mistake',
              modeLabel: '错题本'
            });
            
            this.loadWord(0);
          }).catch(err => {
            wx.hideLoading();
            console.error(err);
            wx.showToast({ title: '加载失败', icon: 'none' });
            wx.navigateBack();
          });
        }).catch(err => {
          wx.hideLoading();
          console.error(err);
          wx.showToast({ title: '加载失败', icon: 'none' });
          wx.navigateBack();
        });
    } else if (mode === 'favorite') {
      // 加载所有收藏
      db.collection('favorites')
        .orderBy('added_at', 'desc')
        .get()
        .then(res => {
          wx.hideLoading();
          const favList = res.data;
          
          if (favList.length === 0) {
            wx.showModal({
              title: '提示',
              content: '收藏夹为空',
              showCancel: false,
              success: () => wx.navigateBack()
            });
            return;
          }
          
          const wordIds = favList.map(f => f.word_id);
          const promises = wordIds.map(id => db.collection('words').doc(id).get());
          
          Promise.all(promises).then(wordRes => {
            const words = wordRes.map(w => w.data);
            
            this.setData({
              wordList: words,
              totalWords: words.length,
              isLoading: false,
              studyMode: 'favorite'
            });
            
            this.loadWord(0);
          }).catch(err => {
            wx.hideLoading();
            console.error(err);
            wx.showToast({ title: '加载失败', icon: 'none' });
            wx.navigateBack();
          });
        }).catch(err => {
          wx.hideLoading();
          console.error(err);
          wx.showToast({ title: '加载失败', icon: 'none' });
          wx.navigateBack();
        });
    }
  },

  // 加载指定单词（从错题本或收藏夹进入）
  loadSpecificWord(wordId, mode = 'normal') {
    wx.showLoading({ title: '加载中...' });
    const db = wx.cloud.database();
    
    if (mode === 'mistake') {
      // 加载所有错题
      db.collection('study_progress')
        .where({
          mistake_count: db.command.gt(0)
        })
        .orderBy('last_review_time', 'desc')
        .get()
        .then(res => {
          wx.hideLoading();
          const progressList = res.data;
          
          // 获取所有 word_id
          const wordIds = progressList.map(p => p.word_id);
          
          // 批量获取单词详情
          const promises = wordIds.map(id => db.collection('words').doc(id).get());
          Promise.all(promises).then(wordRes => {
            const words = wordRes.map((w, i) => ({
              ...w.data,
              _progressId: progressList[i]._id // 保存 progress 的 _id，用于删除
            }));
            
            this.setData({
              wordList: words,
              totalWords: words.length,
              isLoading: false,
              studyMode: 'mistake',
              modeLabel: '错题本'
            });
            
            // 找到当前 wordId 的索引
            const targetIndex = words.findIndex(w => (w._id || w.id) === wordId);
            this.loadWord(targetIndex >= 0 ? targetIndex : 0);
          }).catch(err => {
            wx.hideLoading();
            console.error(err);
            wx.showToast({ title: '加载失败', icon: 'none' });
            wx.navigateBack();
          });
        }).catch(err => {
          wx.hideLoading();
          console.error(err);
          wx.showToast({ title: '加载失败', icon: 'none' });
          wx.navigateBack();
        });
    } else if (mode === 'favorite') {
      // 加载所有收藏
      db.collection('favorites')
        .orderBy('added_at', 'desc')
        .get()
        .then(res => {
          wx.hideLoading();
          const favList = res.data;
          const wordIds = favList.map(f => f.word_id);
          
          const promises = wordIds.map(id => db.collection('words').doc(id).get());
          Promise.all(promises).then(wordRes => {
            const words = wordRes.map(w => w.data);
            
            this.setData({
              wordList: words,
              totalWords: words.length,
              isLoading: false,
              studyMode: 'favorite',
              modeLabel: '收藏夹'
            });
            
            const targetIndex = words.findIndex(w => (w._id || w.id) === wordId);
            this.loadWord(targetIndex >= 0 ? targetIndex : 0);
          }).catch(err => {
            wx.hideLoading();
            console.error(err);
            wx.showToast({ title: '加载失败', icon: 'none' });
            wx.navigateBack();
          });
        }).catch(err => {
          wx.hideLoading();
          console.error(err);
          wx.showToast({ title: '加载失败', icon: 'none' });
          wx.navigateBack();
        });
    } else {
      // 单个单词
      db.collection('words').doc(wordId).get().then(res => {
        wx.hideLoading();
        const word = res.data;
        
        this.setData({
          wordList: [word],
          totalWords: 1,
          isLoading: false
        });
        
        this.loadWord(0);
      }).catch(err => {
        wx.hideLoading();
        console.error(err);
        wx.showToast({ title: '加载失败', icon: 'none' });
        wx.navigateBack();
      });
    }
  },

  fetchWordsFromCloud() {
    wx.showLoading({ title: '加载单词中...' });
    const db = wx.cloud.database();
    
    // 这里简单获取前20个单词。实际应用中可能需要随机获取或分页
    db.collection('words').get().then(res => {
      wx.hideLoading();
      const words = res.data;
      
      if (words.length === 0) {
        wx.showModal({
          title: '提示',
          content: '数据库为空，请先在首页点击“初始化云数据”',
          showCancel: false,
          success: () => wx.navigateBack()
        });
        return;
      }

      this.setData({
        wordList: words,
        totalWords: words.length,
        isLoading: false,
        modeLabel: '正常学习'
      });
      
      this.loadWord(0);
    }).catch(err => {
      wx.hideLoading();
      console.error(err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  loadWord(index) {
    if (index >= this.data.wordList.length) {
      wx.showModal({
        title: '恭喜',
        content: '你已经完成了本次加载的学习内容！',
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      });
      return;
    }

    if (index < 0) {
      wx.showToast({ title: '已经是第一个了', icon: 'none' });
      return;
    }

    const word = this.data.wordList[index];
    
    // 处理 options 状态
    const options = word.options.map(opt => ({ ...opt, selected: false }));
    
    // 处理词性显示 (中英双语)
    let rawPos = word.part_of_speech || '';
    let posObj = { abbr: rawPos, cn: '' };
    if (POS_MAP[rawPos]) {
      posObj.cn = POS_MAP[rawPos];
    }

    // 处理例句高亮
    let formattedExample = word.example || '';
    if (word.word && formattedExample) {
      const regex = new RegExp(`(${word.word})`, 'gi');
      formattedExample = formattedExample.replace(regex, '<span class="highlight">$1</span>');
    }

    this.setData({
      currentIndex: index,
      currentWord: { ...word, options, posObj, formattedExample }, 
      hasAnswered: false,
      showFeedback: false,
      isCorrect: false,
      showAnswer: false,
      showConfetti: false,
      confettiList: [],
      isFavorited: false, // Reset favorite state
      slideOffset: 0,     // 重置滑动位置
      slideDirection: '',  // 重置方向
      showAddMistakeBtn: false, // 重置
      currentWordProgressId: word._progressId || null, // 保存 progress ID
      rotateY: 0,          // 重置旋转
      showRemoveFromMistake: false // 重置
    });

    // 检查该单词是否已收藏
    this.checkFavoriteStatus(word._id || word.id);
  },

  selectOption(e) {
    if (this.data.hasAnswered) return;

    const index = e.currentTarget.dataset.index;
    const currentWord = this.data.currentWord;
    const selectedOption = currentWord.options[index];
    const isCorrect = selectedOption.isCorrect;

    // Mark selected
    const updatedOptions = currentWord.options.map((opt, i) => {
      if (i === index) {
        return { ...opt, selected: true };
      }
      return opt;
    });

    this.setData({
      ['currentWord.options']: updatedOptions,
      hasAnswered: true,
      isCorrect: isCorrect,
      showFeedback: true 
    });

    if (isCorrect) {
      // 触发彩带雨效果
      this.showConfettiRain();
      this.recordProgress(currentWord._id, true);
      
      // 如果是错题模式且做对了，显示删除按钮
      if (this.data.studyMode === 'mistake') {
        this.setData({ showRemoveFromMistake: true });
      }
      
      setTimeout(() => {
        this.nextWord();
      }, 1200); // 延长一点时间让彩带雨播放 

    } else {
       this.setData({ 
         showAnswer: true
       });
       
       // 检查该单词是否已在错题本中
       this.checkIfInMistakeBook(currentWord._id || currentWord.id);
       
       wx.vibrateLong();
    }
  },

  // 检查单词是否已在错题本中
  checkIfInMistakeBook(wordId) {
    if (!wordId) {
      this.setData({ showAddMistakeBtn: false });
      return;
    }

    const db = wx.cloud.database();
    db.collection('study_progress').where({
      word_id: wordId,
      mistake_count: db.command.gt(0) // 错误次数 > 0 表示在错题本中
    }).count().then(res => {
      // 如果不在错题本中，才显示"加入错题本"按钮
      this.setData({ 
        showAddMistakeBtn: res.total === 0 && this.data.studyMode !== 'mistake' 
      });
    }).catch(err => {
      console.error("检查错题本状态失败", err);
      // 出错时默认显示按钮
      this.setData({ showAddMistakeBtn: true });
    });
  },

  // 手动加入错题本
  addToMistakeBook() {
    const wordId = this.data.currentWord._id || this.data.currentWord.id;
    if (!wordId) return;

    const db = wx.cloud.database();
    const _ = db.command;
    const progressCollection = db.collection('study_progress');

    progressCollection.where({
      word_id: wordId
    }).get().then(res => {
      if (res.data.length > 0) {
        // 更新记录，增加错误次数
        progressCollection.doc(res.data[0]._id).update({
          data: {
            mistake_count: _.inc(1),
            is_mastered: false,
            last_review_time: db.serverDate()
          }
        });
      } else {
        // 新增记录
        progressCollection.add({
          data: {
            word_id: wordId,
            mistake_count: 1,
            is_mastered: false,
            last_review_time: db.serverDate(),
            word_snapshot: {
              word: this.data.currentWord.word,
              meaning: this.data.currentWord.meaning
            }
          }
        });
      }
      
      wx.showToast({ title: '已加入错题本', icon: 'success' });
      this.setData({ showAddMistakeBtn: false });
    });
  },

  // 从错题本删除（做对后）
  removeFromMistakeBook() {
    if (!this.data.currentWordProgressId) return;
    
    const db = wx.cloud.database();
    db.collection('study_progress').doc(this.data.currentWordProgressId).update({
      data: {
        mistake_count: 0,
        is_mastered: true
      }
    }).then(() => {
      wx.showToast({ title: '已从错题本移除', icon: 'success' });
      this.setData({ showRemoveFromMistake: false });
      
      // 从列表中移除
      const newList = this.data.wordList.filter((w, i) => i !== this.data.currentIndex);
      this.setData({
        wordList: newList,
        totalWords: newList.length
      });
      
      // 如果还有单词，继续下一个，否则返回
      if (newList.length > 0) {
        const nextIndex = this.data.currentIndex >= newList.length ? newList.length - 1 : this.data.currentIndex;
        this.loadWord(nextIndex);
      } else {
        setTimeout(() => wx.navigateBack(), 1000);
      }
    });
  },

  // --- 收藏功能 ---
  checkFavoriteStatus(wordId) {
    if (!wordId) return;
    const db = wx.cloud.database();
    db.collection('favorites').where({
      word_id: wordId
    }).count().then(res => {
      this.setData({ isFavorited: res.total > 0 });
    });
  },

  toggleFavorite() {
    const word = this.data.currentWord;
    const wordId = word._id || word.id;
    if (!wordId) return;

    const db = wx.cloud.database();
    const favorites = db.collection('favorites');

    if (this.data.isFavorited) {
      // 取消收藏
      favorites.where({ word_id: wordId }).remove().then(() => {
        this.setData({ isFavorited: false });
        wx.showToast({ title: '已取消', icon: 'none' });
      });
    } else {
      // 添加收藏
      favorites.add({
        data: {
          word_id: wordId,
          added_at: db.serverDate(),
          word_snapshot: {
            word: word.word,
            meaning: word.meaning
          }
        }
      }).then(() => {
        this.setData({ isFavorited: true });
        wx.showToast({ title: '收藏成功', icon: 'success' });
      });
    }
  },

  // --- 学习进度记录 ---
  recordProgress(wordId, isCorrect) {
    const realId = wordId || this.data.currentWord.id;
    if (!realId) return;

    const db = wx.cloud.database();
    const _ = db.command;
    const progressCollection = db.collection('study_progress');

    progressCollection.where({
      word_id: realId,
    }).get().then(res => {
      if (res.data.length > 0) {
        const docId = res.data[0]._id;
        const updateData = {
          last_review_time: db.serverDate()
        };
        
        if (!isCorrect) {
          updateData.mistake_count = _.inc(1);
          updateData.is_mastered = false; 
        }

        progressCollection.doc(docId).update({
          data: updateData
        });
      } else {
        progressCollection.add({
          data: {
            word_id: realId,
            mistake_count: isCorrect ? 0 : 1,
            is_mastered: isCorrect,
            last_review_time: db.serverDate(),
            word_snapshot: { 
              word: this.data.currentWord.word,
              meaning: this.data.currentWord.meaning
            }
          }
        });
      }
    }).catch(err => {
      console.error("记录进度失败", err);
    });
  },

  nextWord() {
    // 先滑出当前卡片（向左，带3D效果）
    this.setData({
      slideOffset: -100,
      slideDirection: 'slide-left',
      rotateY: -15 // 3D旋转
    });

    setTimeout(() => {
      const nextIndex = this.data.currentIndex + 1;
      this.loadWord(nextIndex);
      
      // 新单词从右侧滑入
      this.setData({
        slideOffset: 100,
        rotateY: 15
      });
      
      setTimeout(() => {
        this.setData({
          slideOffset: 0,
          rotateY: 0
        });
      }, 50);
    }, 300);
  },

  prevWord() {
    // 先滑出当前卡片（向右，带3D效果）
    this.setData({
      slideOffset: 100,
      slideDirection: 'slide-right',
      rotateY: 15
    });

    setTimeout(() => {
      const prevIndex = this.data.currentIndex - 1;
      this.loadWord(prevIndex);
      
      // 新单词从左侧滑入
      this.setData({
        slideOffset: -100,
        rotateY: -15
      });
      
      setTimeout(() => {
        this.setData({
          slideOffset: 0,
          rotateY: 0
        });
      }, 50);
    }, 300);
  },

  // 彩带雨效果 + 文字特效
  showConfettiRain() {
    // 生成30个彩带
    const colors = ['#60a5fa', '#34d399', '#22d3ee', '#fbbf24', '#fb7185', '#a78bfa', '#f472b6', '#14b8a6'];
    const confettiList = [];
    
    // 庆祝文字列表
    const celebrationTexts = ['Bravo!', 'Perfetto!', 'Ottimo!', 'Fantastico!', 'Eccellente!'];
    const randomText = celebrationTexts[Math.floor(Math.random() * celebrationTexts.length)];
    
    for (let i = 0; i < 30; i++) {
      confettiList.push({
        left: Math.random() * 100 + '%',
        top: -30 + 'rpx',
        delay: Math.random() * 0.5 + 's',
        duration: Math.random() * 0.5 + 1 + 's',
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360 + 'deg',
        size: (12 + Math.random() * 8) + 'rpx'
      });
    }
    
    this.setData({
      showConfetti: true,
      confettiList: confettiList,
      celebrationText: randomText,
      showCelebrationText: true
    });
    
    // 2秒后隐藏彩带
    setTimeout(() => {
      this.setData({
        showConfetti: false,
        confettiList: []
      });
    }, 2000);
    
    // 1.5秒后隐藏文字
    setTimeout(() => {
      this.setData({
        showCelebrationText: false
      });
    }, 1500);
  },

  // --- 手势处理 ---
  touchStart(e) {
    if (e.touches.length !== 1) return; // 只处理单指
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  },

  touchEnd(e) {
    if (e.changedTouches.length !== 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - this.touchStartX;
    const diffY = touchEndY - this.touchStartY;

    // 1. 水平滑动距离要大于 60px
    // 2. 水平距离要显著大于垂直距离 (防止斜着滑或下拉刷新误触)
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 2) {
      if (diffX < 0) {
        // 左滑 -> 下一个 (Next)
        if (this.data.hasAnswered) {
          this.nextWord();
        } else {
           wx.showToast({ title: '请先作答', icon: 'none' });
        }
      } else {
        // 右滑 -> 上一个 (Prev)
        this.prevWord();
      }
    }
  }
})
