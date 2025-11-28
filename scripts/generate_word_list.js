const fs = require('fs');
const path = require('path');

// 读取外部词汇数据
function loadVocabData() {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const vocab = {};
  
  levels.forEach(level => {
    try {
      const dataPath = path.join(__dirname, 'vocab_data', `${level}.js`);
      if (fs.existsSync(dataPath)) {
        vocab[level] = require(dataPath);
        console.log(`已加载 ${level} 级词汇: ${vocab[level].length} 个`);
      } else {
        console.warn(`警告: 未找到 ${level} 级词汇文件`);
        vocab[level] = [];
      }
    } catch (e) {
      console.error(`加载 ${level} 级词汇失败:`, e);
      vocab[level] = [];
    }
  });
  
  return vocab;
}

const baseVocab = loadVocabData();

// 辅助函数：生成错误选项
function generateOptions(correctMeaning, allMeanings) {
  const options = [{ text: correctMeaning, isCorrect: true }];
  const otherMeanings = allMeanings.filter(m => m !== correctMeaning);
  
  // 随机选择3个错误选项
  for (let i = 0; i < 3; i++) {
    if (otherMeanings.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherMeanings.length);
      options.push({ text: otherMeanings[randomIndex], isCorrect: false });
      otherMeanings.splice(randomIndex, 1); // 避免重复
    } else {
      options.push({ text: "其他意思", isCorrect: false });
    }
  }
  
  // 打乱选项顺序
  return options.sort(() => Math.random() - 0.5);
}

// 主生成逻辑
const fullWordList = [];
let globalId = 1;

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

levels.forEach(level => {
  const words = baseVocab[level] || [];
  const targetCount = 200;
  
  // 收集当前等级所有含义用于生成选项
  const levelMeanings = words.map(w => w[2]);
  
  // 添加真实单词
  words.forEach(item => {
    // 新格式包含例句：[word, pos, meaning, example, example_meaning]
    const word = item[0];
    const pos = item[1];
    const meaning = item[2];
    const example = item[3] || `Ecco un esempio con la parola ${word}.`; // 优先使用数据中的例句
    const example_meaning = item[4] || `这是单词 ${word} 的一个例子。`;
    
    // 简单的发音模拟
    const pronunciation = `/${word.toLowerCase()}/`; 
    
    fullWordList.push({
      id: globalId++,
      word: word,
      pronunciation: pronunciation,
      part_of_speech: pos,
      level: level,
      meaning: meaning,
      example: example,
      example_meaning: example_meaning,
      options: generateOptions(meaning, levelMeanings)
    });
  });
  
  // 补充剩余数量 (如果有的话)
  const remaining = targetCount - words.length;
  if (remaining > 0) {
    console.log(`等级 ${level} 单词不足 200 个，当前只有 ${words.length} 个。不再生成占位符。`);
  }
});

// 生成文件内容
const fileContent = `const wordList = ${JSON.stringify(fullWordList, null, 2)};

module.exports = {
  wordList: wordList
};
`;

// 写入文件
const outputPath = path.join(__dirname, '../data/word-list.js');
fs.writeFileSync(outputPath, fileContent);

console.log(`已生成 ${fullWordList.length} 个单词到 ${outputPath}`);
