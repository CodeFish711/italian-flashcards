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

// 常见不规则动词变位表 (直陈式现在时)
const irregularVerbs = {
  'essere': 'sono, sei, è, siamo, siete, sono',
  'avere': 'ho, hai, ha, abbiamo, avete, hanno',
  'andare': 'vado, vai, va, andiamo, andate, vanno',
  'venire': 'vengo, vieni, viene, veniamo, venite, vengono',
  'fare': 'faccio, fai, fa, facciamo, fate, fanno',
  'dire': 'dico, dici, dice, diciamo, dite, dicono',
  'dare': 'do, dai, dà, diamo, date, danno',
  'stare': 'sto, stai, sta, stiamo, state, stanno',
  'dovere': 'devo, devi, deve, dobbiamo, dovete, devono',
  'potere': 'posso, puoi, può, possiamo, potete, possono',
  'volere': 'voglio, vuoi, vuole, vogliamo, volete, vogliono',
  'sapere': 'so, sai, sa, sappiamo, sapete, sanno',
  'bere': 'bevo, bevi, beve, beviamo, bevete, bevono',
  'uscire': 'esco, esci, esce, usciamo, uscite, escono',
  'riuscire': 'riesco, riesci, riesce, riusciamo, riuscite, riescono'
};

// 辅助函数：生成动词详情
function getVerbDetail(word) {
  const lowerWord = word.toLowerCase();
  
  // 1. 检查不规则动词
  if (irregularVerbs[lowerWord]) {
    return `原型：${word} (不规则动词)。\n\n直陈式现在时变位：\n${irregularVerbs[lowerWord]}`;
  }
  
  // 2. 规则变位提示
  let conjugation = "";
  let group = "";
  
  if (lowerWord.endsWith('are')) {
    group = "第一组 (-are)";
    const root = word.slice(0, -3);
    conjugation = `${root}o, ${root}i, ${root}a, ${root}iamo, ${root}ate, ${root}ano`;
  } else if (lowerWord.endsWith('ere')) {
    group = "第二组 (-ere)";
    const root = word.slice(0, -3);
    conjugation = `${root}o, ${root}i, ${root}e, ${root}iamo, ${root}ete, ${root}ono`;
  } else if (lowerWord.endsWith('ire')) {
    group = "第三组 (-ire)";
    // 简单处理，不做 -isco 区分，提示一般规则
    const root = word.slice(0, -3);
    conjugation = `${root}o, ${root}i, ${root}e, ${root}iamo, ${root}ite, ${root}ono\n(注意：部分第三组动词如 capire 需要加 -isc-，如 capisco)`;
  } else if (lowerWord.endsWith('rre')) {
      return `原型：${word}。\n这是一个缩略形式的不规则动词 (源自拉丁语)，变位通常不规则。`;
  }
  
  if (conjugation) {
    return `原型：${word} (${group})。\n\n规则变位示例 (直陈式现在时)：\n${conjugation}`;
  }
  
  return `原型：${word} (动词)。\n请注意根据语境的人称和时态进行变化。`;
}

// 辅助函数：生成名词详情
function getNounDetail(word, pos) {
  const lowerWord = word.toLowerCase();
  const lastChar = lowerWord.slice(-1);
  const root = word.slice(0, -1);
  
  // 辅音结尾（外来词）
  const consonants = ['b','c','d','f','g','h','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];
  // 简单判断是否以辅音结尾 (排除元音)
  const vowels = ['a','e','i','o','u','à','è','ì','ò','ù'];
  if (!vowels.includes(lastChar)) {
     return `外来词/辅音结尾名词。\n通常为阳性，复数形式保持不变 (il ${word} -> i ${word})。`;
  }

  // 重音结尾
  if (['à','è','ì','ò','ù'].includes(lastChar)) {
      return `重音结尾名词。\n复数形式保持不变 (la ${word} -> le ${word})。`;
  }
  
  if (pos === 'n.m.' || (pos === 'n.' && lastChar === 'o')) {
     return `阳性单数名词。\n复数形式通常变成 -i：\n${word} -> ${root}i`;
  }
  
  if (pos === 'n.f.' || (pos === 'n.' && lastChar === 'a')) {
     if (lowerWord.endsWith('ca') || lowerWord.endsWith('ga')) {
         return `阴性单数名词 (-ca/-ga)。\n复数形式通常加 h 保持发音：\n${word} -> ${word.slice(0,-1)}he`;
     }
     return `阴性单数名词。\n复数形式通常变成 -e：\n${word} -> ${root}e`;
  }
  
  if (lastChar === 'e') {
     return `单数名词 (-e 结尾)。\n通常为双性或需记忆性别。\n复数形式通常变成 -i：\n${word} -> ${root}i`;
  }
  
  return `名词。\n请根据具体语境判断单复数变化。`;
}

// 辅助函数：生成形容词详情
function getAdjDetail(word) {
  const lowerWord = word.toLowerCase();
  const lastChar = lowerWord.slice(-1);
  const root = word.slice(0, -1);
  
  if (lastChar === 'o') {
    return `四尾形容词 (o/a/i/e)。\n\n变化规则：\n阳单: ${word}\n阴单: ${root}a\n阳复: ${root}i\n阴复: ${root}e`;
  }
  
  if (lastChar === 'e') {
    return `双尾形容词 (e/i)。\n\n变化规则：\n单数 (阳/阴): ${word}\n复数 (阳/阴): ${root}i`;
  }
  
  return `形容词。\n需根据修饰的名词进行性数配合。`;
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
            detail = getVerbDetail(word);
        } else if (pos.includes('n.')) {
            detail = getNounDetail(word, pos);
        } else if (pos.includes('adj.')) {
            detail = getAdjDetail(word);
        } else if (pos.includes('adv.')) {
            detail = `副词。\n通常修饰动词、形容词或其他副词，无性数变化。`;
        } else if (pos.includes('prep.')) {
            detail = `介词。\n如果是基础介词 (di, a, da, in, su)，注意与定冠词的缩合形式 (如: al, dello, nella...)。`;
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
