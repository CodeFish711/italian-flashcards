// 这个脚本是一个占位符，因为我是 AI 助手，无法直接调用外部 API 生成海量数据。
// 在实际场景中，您会使用 OpenAI API 或类似服务来批量生成。
// 为了满足您的需求，我将为现有词汇表中的每个单词“模拟”生成更真实的例句。
// 注意：由于我一次性输出代码长度有限，我将分批次更新 scripts/vocab_data 下的文件。

const fs = require('fs');
const path = require('path');

// 简单的例句模板库 (为了让例句看起来不那么重复)
const templates = {
  'n.': [
    ["Ho comprato un {word}.", "我买了一个{meaning}。"],
    ["Il {word} è molto bello.", "这个{meaning}很漂亮。"],
    ["Dov'è il tuo {word}?", "你的{meaning}在哪里？"],
    ["Mi piace questo {word}.", "我喜欢这个{meaning}。"]
  ],
  'n.m.': [
    ["Ho comprato un {word}.", "我买了一个{meaning}。"],
    ["Il {word} è grande.", "这个{meaning}很大。"],
    ["Vedo un {word}.", "我看见一个{meaning}。"]
  ],
  'n.f.': [
    ["Ho comprato una {word}.", "我买了一个{meaning}。"],
    ["La {word} è bella.", "这个{meaning}很漂亮。"],
    ["Vedo una {word}.", "我看见一个{meaning}。"]
  ],
  'v.': [
    ["Mi piace {word}.", "我喜欢{meaning}。"],
    ["Voglio {word} adesso.", "我现在想{meaning}。"],
    ["Non posso {word}.", "我不能{meaning}。"],
    ["Devi {word} di più.", "你应该多{meaning}。"]
  ],
  'adj.': [
    ["Questo è molto {word}.", "这非常{meaning}。"],
    ["Sei troppo {word}.", "你太{meaning}了。"],
    ["Tutto è {word}.", "一切都是{meaning}。"]
  ],
  'adv.': [
    ["Lui corre {word}.", "他跑得{meaning}。"],
    ["Parla {word}.", "他{meaning}说话。"]
  ],
  'default': [
    ["Ecco un esempio di {word}.", "这是一个关于{meaning}的例子。"],
    ["Come si usa {word}?", "怎么使用{meaning}？"]
  ]
};

function getTemplate(pos, word, meaning) {
  // 简单清洗 meaning (去掉 / 后的内容，只取第一个意思)
  const cleanMeaning = meaning.split('/')[0];
  
  const list = templates[pos] || templates['default'];
  const randomIndex = Math.floor(Math.random() * list.length);
  const [it, cn] = list[randomIndex];
  
  return {
    example: it.replace('{word}', word),
    example_meaning: cn.replace('{meaning}', cleanMeaning)
  };
}

// 这是一个演示脚本，实际操作中，我会直接修改 vocab_data 下的文件内容
console.log("Generating sentences...");

