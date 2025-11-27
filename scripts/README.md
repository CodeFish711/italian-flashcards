# 单词库导入方案

## 方案概述

从开源数据源（Wiktionary）导入意大利语单词到小程序云数据库。

## 方案架构

```
Wiktionary API/数据源
    ↓
Python 数据抓取脚本 (scripts/fetch_wiktionary.py)
    ↓
数据转换和验证 (scripts/transform_data.py)
    ↓
生成 JSON 文件 (data/wiktionary_words.json)
    ↓
云函数批量导入 (cloudfunctions/importWiktionary/index.js)
    ↓
微信云数据库 (words collection)
```

## 数据源选择

### 1. Wiktionary API
- **优点**: 实时数据，包含发音、例句、词性等
- **缺点**: 需要逐个请求，速度较慢
- **适用**: 小批量导入（< 1000个单词）

### 2. Wiktionary 数据转储
- **优点**: 完整数据，可离线处理
- **缺点**: 文件大，需要解析 XML/JSON
- **适用**: 大批量导入（> 1000个单词）

### 3. 预提取数据（Wiktextract）
- **优点**: 已处理好的 JSON 数据
- **缺点**: 需要下载大文件
- **适用**: 推荐方案，平衡了速度和完整性

## 实施步骤

### 步骤 1: 安装依赖
```bash
pip install wiktionaryparser requests beautifulsoup4
```

### 步骤 2: 运行数据抓取脚本
```bash
python scripts/fetch_wiktionary.py --level A1 --count 50
```

### 步骤 3: 转换数据格式
```bash
python scripts/transform_data.py --input data/wiktionary_raw.json --output data/wiktionary_words.json
```

### 步骤 4: 导入到云数据库
在小程序中点击"导入 Wiktionary 数据"按钮，或调用云函数。

## 数据字段映射

| Wiktionary 字段 | 小程序字段 | 说明 |
|----------------|-----------|------|
| word | word | 单词 |
| pronunciation | pronunciation | 音标 |
| part_of_speech | part_of_speech | 词性 |
| definitions[0] | meaning | 中文释义（需要翻译） |
| examples[0] | example | 例句 |
| - | example_meaning | 例句翻译（需要生成） |
| - | level | 级别（需要根据词频判断） |
| - | options | 选择题选项（需要生成） |

## 注意事项

1. **中文翻译**: Wiktionary 主要是英文，需要额外翻译成中文
2. **级别判断**: 需要根据词频或CEFR标准判断单词级别
3. **选项生成**: 需要为每个单词生成3个干扰选项
4. **数据验证**: 确保所有必需字段都存在
5. **批量限制**: 云函数单次导入建议不超过1000条

