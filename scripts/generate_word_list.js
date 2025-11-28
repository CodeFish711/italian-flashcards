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
    
    // 生成详情 (如果数据中没有提供)
    // 根据用户需求：动词原型、复数/单数、阴阳性等
    let detail = item[5] || '';
    if (!detail) {
        // 如果数据源中没有 detail 字段，则进行简单的自动生成
        if (pos.includes('v.')) {
            detail = `原型：${word} (动词)。\n意大利语动词变位规则复杂，请注意根据语境的人称和时态进行变化。`;
        } else if (pos.includes('n.')) {
            // 简单的单复数推断 (非常基础，仅供参考)
            const lastChar = word.slice(-1);
            if (lastChar === 'o') detail = `阳性单数名词。\n复数形式通常以 'i' 结尾 (例如：${word.slice(0, -1)}i)。`;
            else if (lastChar === 'a') detail = `阴性单数名词。\n复数形式通常以 'e' 结尾 (例如：${word.slice(0, -1)}e)。`;
            else if (lastChar === 'e') detail = `单数名词 (阴性或阳性)。\n复数形式通常以 'i' 结尾 (例如：${word.slice(0, -1)}i)。`;
            else detail = `名词。\n请查阅词典确认其性和数的具体变化规则。`;
        } else if (pos.includes('adj.')) {
             detail = `形容词。\n需根据修饰的名词进行性数配合 (如: o/a/i/e)。`;
        } else {
            detail = `${POS_MAP[pos] || '词汇'}。\n常用基础词汇。`;
        }
    }

    fullWordList.push({
      id: globalId++,
      word: word,
      pronunciation: pronunciation,
      part_of_speech: pos,
      level: level,
      meaning: meaning,
      example: example,
      example_meaning: example_meaning,
      detail: detail, // 新增详情字段
      options: generateOptions(meaning, levelMeanings)
    });
  });
  
  // 补充剩余数量 (如果有的话)
  const remaining = targetCount - words.length;
  if (remaining > 0) {
    console.log(`等级 ${level} 单词不足 200 个，当前只有 ${words.length} 个。不再生成占位符。`);
  }
});

// 写入文件
// 修改为直接写入到 cloudfunctions/importData 目录，以便云函数直接读取，减少小程序端包体积
const outputPath = path.join(__dirname, '../cloudfunctions/importData/word-list.js');
// 同时也保留一份在 data 目录以备不时之需（稍后会在 project.config.json 中忽略它）
// const localOutputPath = path.join(__dirname, '../data/word-list.js'); 

// 生成文件内容
// 格式微调：直接导出一个数组，方便云函数 require
const fileContent = `module.exports = ${JSON.stringify(fullWordList, null, 2)};`;

fs.writeFileSync(outputPath, fileContent);
// fs.writeFileSync(localOutputPath, fileContent); // 暂时不需要本地副本，以免混淆

console.log(`已生成 ${fullWordList.length} 个单词到 ${outputPath}`);
