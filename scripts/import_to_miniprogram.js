/**
 * 将转换后的 JSON 文件转换为小程序可用的 JS 模块
 * 使用方法: node import_to_miniprogram.js data/wiktionary_words_A1.json
 */

const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputDir = path.join(__dirname, '../data');

if (!inputFile) {
  console.error('请指定输入文件: node import_to_miniprogram.js <json-file>');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`文件不存在: ${inputFile}`);
  process.exit(1);
}

try {
  // 读取 JSON 文件
  const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const level = jsonData.level || 'A1';
  const words = jsonData.words || [];
  
  // 生成 JS 模块
  const jsContent = `// 自动生成的 Wiktionary 数据 (${level} 级别)
// 生成时间: ${new Date().toISOString()}
// 单词数量: ${words.length}

const wiktionaryWords_${level} = ${JSON.stringify(words, null, 2)};

module.exports = {
  words: wiktionaryWords_${level},
  level: '${level}',
  count: ${words.length}
};
`;

  // 输出文件路径
  const outputFile = path.join(outputDir, `wiktionary_words_${level}.js`);
  
  // 写入文件
  fs.writeFileSync(outputFile, jsContent, 'utf8');
  
  console.log(`✓ 成功生成: ${outputFile}`);
  console.log(`  级别: ${level}`);
  console.log(`  单词数: ${words.length}`);
  console.log(`\n在小程序中可以这样使用:`);
  console.log(`  const { words } = require('../../data/wiktionary_words_${level}.js');`);
  console.log(`  然后调用云函数 importWiktionary 导入数据`);
  
} catch (error) {
  console.error('处理失败:', error.message);
  process.exit(1);
}

