#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将 Wiktionary 原始数据转换为小程序需要的格式
使用方法: python transform_data.py --input data/wiktionary_raw.json --output data/wiktionary_words.json
"""

import argparse
import json
from typing import List, Dict
import random

# 词性映射表
POS_MAP = {
    'noun': 'n.',
    'verb': 'v.',
    'adjective': 'adj.',
    'adverb': 'adv.',
    'preposition': 'prep.',
    'conjunction': 'conj.',
    'interjection': 'int.',
    'pronoun': 'pron.',
    'article': 'art.',
    'numeral': 'num.'
}

# 常用干扰选项（按词性分类）
DISTRACTORS = {
    'n.': ['桌子', '椅子', '门', '窗', '书', '笔', '纸', '电脑', '手机', '车'],
    'v.': ['跑', '跳', '走', '坐', '站', '看', '听', '说', '读', '写'],
    'adj.': ['大的', '小的', '高的', '矮的', '新的', '旧的', '好的', '坏的', '快的', '慢的'],
    'adv.': ['很', '非常', '总是', '从不', '经常', '有时', '现在', '然后', '这里', '那里'],
    'prep.': ['在', '从', '到', '向', '关于', '为了', '通过', '随着', '除了', '根据'],
    'conj.': ['和', '或', '但是', '因为', '所以', '如果', '虽然', '然而', '而且', '因此'],
    'int.': ['啊', '哦', '嗯', '哇', '唉', '哎呀', '天哪', '太好了', '糟糕', '不错'],
    'pron.': ['我', '你', '他', '她', '我们', '你们', '他们', '这个', '那个', '什么']
}


def translate_meaning(english_def: str) -> str:
    """
    将英文定义翻译成中文
    这里使用简单的关键词映射，实际应该使用翻译API
    """
    # 简单的关键词映射（实际应该使用翻译服务）
    translation_map = {
        'hello': '你好',
        'goodbye': '再见',
        'love': '爱',
        'cat': '猫',
        'dog': '狗',
        'house': '房子',
        'water': '水',
        'eat': '吃',
        'drink': '喝',
        'sleep': '睡',
        # 可以继续添加更多映射
    }
    
    # 尝试直接匹配
    for en, cn in translation_map.items():
        if en.lower() in english_def.lower():
            return cn
    
    # 如果没有匹配，返回原文本（实际应该调用翻译API）
    return english_def


def generate_options(correct_meaning: str, part_of_speech: str) -> List[Dict]:
    """
    生成选择题选项
    """
    options = [
        {'text': correct_meaning, 'isCorrect': True}
    ]
    
    # 获取同词性的干扰选项
    distractors = DISTRACTORS.get(part_of_speech, DISTRACTORS['n.'])
    
    # 随机选择3个干扰选项
    selected_distractors = random.sample(distractors, min(3, len(distractors)))
    
    for distractor in selected_distractors:
        if distractor != correct_meaning:  # 确保不重复
            options.append({'text': distractor, 'isCorrect': False})
    
    # 如果选项不足4个，补充
    while len(options) < 4:
        random_distractor = random.choice(distractors)
        if not any(opt['text'] == random_distractor for opt in options):
            options.append({'text': random_distractor, 'isCorrect': False})
    
    # 打乱选项顺序
    random.shuffle(options)
    
    return options


def translate_example(example: str) -> str:
    """
    翻译例句（实际应该使用翻译API）
    """
    # 这里只是占位，实际应该调用翻译服务
    return f"[{example}的中文翻译]"


def transform_word(wiktionary_data: Dict, level: str) -> Dict:
    """
    将 Wiktionary 数据转换为小程序格式
    """
    word = wiktionary_data.get('word', '')
    pronunciation = wiktionary_data.get('pronunciation', '')
    part_of_speech = wiktionary_data.get('part_of_speech', '')
    definitions = wiktionary_data.get('definitions', [])
    examples = wiktionary_data.get('examples', [])
    
    # 获取第一个定义作为主要含义
    meaning = definitions[0] if definitions else ''
    meaning_cn = translate_meaning(meaning)
    
    # 获取第一个例句
    example = examples[0] if examples else ''
    example_meaning = translate_example(example) if example else ''
    
    # 生成选项
    options = generate_options(meaning_cn, part_of_speech)
    
    # 构建结果
    result = {
        'word': word.capitalize() if word else '',
        'pronunciation': pronunciation,
        'part_of_speech': part_of_speech,
        'level': level,
        'meaning': meaning_cn,
        'example': example,
        'example_meaning': example_meaning,
        'options': options
    }
    
    return result


def validate_word(word_data: Dict) -> bool:
    """
    验证单词数据是否完整
    """
    required_fields = ['word', 'pronunciation', 'part_of_speech', 'level', 'meaning', 'options']
    
    for field in required_fields:
        if field not in word_data or not word_data[field]:
            return False
    
    # 验证选项
    if len(word_data['options']) < 4:
        return False
    
    # 验证至少有一个正确答案
    if not any(opt.get('isCorrect', False) for opt in word_data['options']):
        return False
    
    return True


def main():
    parser = argparse.ArgumentParser(description='转换 Wiktionary 数据为小程序格式')
    parser.add_argument('--input', type=str, required=True, help='输入文件路径')
    parser.add_argument('--output', type=str, required=True, help='输出文件路径')
    parser.add_argument('--validate', action='store_true', help='验证数据完整性')
    
    args = parser.parse_args()
    
    # 读取原始数据
    with open(args.input, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    level = raw_data.get('level', 'A1')
    words = raw_data.get('words', [])
    
    print(f"开始转换 {len(words)} 个单词...")
    
    # 转换数据
    transformed_words = []
    skipped = 0
    
    for word_data in words:
        transformed = transform_word(word_data, level)
        
        # 验证数据
        if args.validate and not validate_word(transformed):
            print(f"跳过无效数据: {transformed.get('word', 'unknown')}")
            skipped += 1
            continue
        
        transformed_words.append(transformed)
    
    # 保存结果
    output_data = {
        'level': level,
        'count': len(transformed_words),
        'words': transformed_words
    }
    
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n完成！")
    print(f"  成功转换: {len(transformed_words)} 个单词")
    print(f"  跳过: {skipped} 个单词")
    print(f"  已保存到: {args.output}")


if __name__ == '__main__':
    main()

