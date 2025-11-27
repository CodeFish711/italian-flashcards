#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从 Wiktionary 抓取意大利语单词数据
使用方法: python fetch_wiktionary.py --level A1 --count 50
"""

import argparse
import json
import time
import requests
from typing import List, Dict, Optional
import re

class WiktionaryFetcher:
    """Wiktionary 数据抓取器"""
    
    def __init__(self):
        self.base_url = "https://it.wiktionary.org/api/rest_v1/page/definition"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Italiano单词宝/1.0 (https://github.com/your-repo)'
        })
    
    def fetch_word(self, word: str) -> Optional[Dict]:
        """
        获取单个单词的数据
        """
        try:
            url = f"{self.base_url}/{word}"
            response = self.session.get(url, timeout=10)
            
            if response.status_code != 200:
                return None
            
            data = response.json()
            
            # 解析意大利语部分
            if 'it' not in data:
                return None
            
            italian_data = data['it']
            if not italian_data:
                return None
            
            # 提取第一个词条（通常是最常用的）
            entry = italian_data[0]
            
            result = {
                'word': word,
                'pronunciation': self._extract_pronunciation(entry),
                'part_of_speech': self._extract_part_of_speech(entry),
                'definitions': self._extract_definitions(entry),
                'examples': self._extract_examples(entry),
                'etymology': self._extract_etymology(entry)
            }
            
            return result
            
        except Exception as e:
            print(f"Error fetching {word}: {e}")
            return None
    
    def _extract_pronunciation(self, entry: Dict) -> str:
        """提取音标"""
        if 'pronunciations' in entry:
            pronunciations = entry['pronunciations']
            if 'text' in pronunciations and pronunciations['text']:
                return pronunciations['text'][0] if pronunciations['text'] else ""
        return ""
    
    def _extract_part_of_speech(self, entry: Dict) -> str:
        """提取词性"""
        if 'partOfSpeech' in entry:
            pos = entry['partOfSpeech']
            # 转换为小程序格式
            pos_map = {
                'noun': 'n.',
                'verb': 'v.',
                'adjective': 'adj.',
                'adverb': 'adv.',
                'preposition': 'prep.',
                'conjunction': 'conj.',
                'interjection': 'int.',
                'pronoun': 'pron.'
            }
            return pos_map.get(pos, pos)
        return ""
    
    def _extract_definitions(self, entry: Dict) -> List[str]:
        """提取定义"""
        definitions = []
        if 'definitions' in entry:
            for def_group in entry['definitions']:
                if 'definitions' in def_group:
                    definitions.extend(def_group['definitions'])
        return definitions[:3]  # 只取前3个定义
    
    def _extract_examples(self, entry: Dict) -> List[str]:
        """提取例句"""
        examples = []
        if 'definitions' in entry:
            for def_group in entry['definitions']:
                if 'examples' in def_group:
                    examples.extend(def_group['examples'])
        return examples[:2]  # 只取前2个例句
    
    def _extract_etymology(self, entry: Dict) -> str:
        """提取词源"""
        if 'etymology' in entry:
            return entry['etymology']
        return ""
    
    def fetch_word_list(self, words: List[str], delay: float = 0.5) -> List[Dict]:
        """
        批量获取单词数据
        delay: 请求间隔（秒），避免过快请求
        """
        results = []
        total = len(words)
        
        for i, word in enumerate(words, 1):
            print(f"[{i}/{total}] Fetching: {word}")
            data = self.fetch_word(word)
            
            if data:
                results.append(data)
                print(f"  ✓ Success")
            else:
                print(f"  ✗ Failed")
            
            # 避免请求过快
            if i < total:
                time.sleep(delay)
        
        return results


def load_word_list_by_level(level: str, count: int) -> List[str]:
    """
    根据级别加载常用单词列表
    这里使用预定义的常用词列表，实际可以从词频数据中获取
    """
    # A1 级别常用词（示例）
    word_lists = {
        'A1': [
            'ciao', 'grazie', 'prego', 'scusa', 'buongiorno', 'buonasera', 'buonanotte',
            'sì', 'no', 'per favore', 'amore', 'casa', 'acqua', 'cibo', 'latte',
            'pane', 'pizza', 'caffè', 'vino', 'birra', 'gatto', 'cane', 'libro',
            'scuola', 'lavoro', 'famiglia', 'amico', 'madre', 'padre', 'figlio',
            'figlia', 'uomo', 'donna', 'bambino', 'giorno', 'notte', 'mattina',
            'sera', 'oggi', 'domani', 'ieri', 'ora', 'tempo', 'anno', 'mese',
            'settimana', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì'
        ],
        'A2': [
            'mangiare', 'bere', 'dormire', 'svegliare', 'lavorare', 'studiare',
            'leggere', 'scrivere', 'parlare', 'ascoltare', 'vedere', 'sentire',
            'andare', 'venire', 'fare', 'dire', 'sapere', 'conoscere', 'volere',
            'potere', 'dovere', 'essere', 'avere', 'stare', 'rimanere', 'diventare',
            'piacere', 'amare', 'volere bene', 'capire', 'pensare', 'credere',
            'sperare', 'trovare', 'cercare', 'prendere', 'dare', 'mettere', 'togliere',
            'aprire', 'chiudere', 'iniziare', 'finire', 'cominciare', 'continuare'
        ],
        'B1': [
            'speranza', 'paura', 'gioia', 'tristezza', 'rabbia', 'amore', 'odio',
            'successo', 'fallimento', 'speranza', 'dubbio', 'certezza', 'libertà',
            'giustizia', 'verità', 'bellezza', 'bontà', 'malvagità', 'saggezza',
            'stupidità', 'coraggio', 'paura', 'forza', 'debolezza', 'ricchezza',
            'povertà', 'felicità', 'infelicità', 'pace', 'guerra', 'amicizia',
            'nemico', 'alleato', 'compagno', 'rivale', 'competizione', 'cooperazione'
        ],
        'B2': [
            'analizzare', 'sintetizzare', 'valutare', 'giudicare', 'criticare',
            'apprezzare', 'ammirare', 'rispettare', 'disprezzare', 'rifiutare',
            'accettare', 'accogliere', 'rifiutare', 'negare', 'affermare',
            'dimostrare', 'provare', 'testare', 'verificare', 'controllare',
            'esaminare', 'investigare', 'ricercare', 'scoprire', 'trovare',
            'perdere', 'trovare', 'cercare', 'trovare', 'scoprire', 'nascondere'
        ],
        'C1': [
            'sofisticato', 'elaborato', 'raffinato', 'complesso', 'semplice',
            'astratto', 'concreto', 'teorico', 'pratico', 'ipotetico', 'reale',
            'virtuale', 'effettivo', 'potenziale', 'attuale', 'futuro', 'passato',
            'presente', 'eterno', 'temporaneo', 'permanente', 'provvisorio',
            'definitivo', 'indefinito', 'specifico', 'generale', 'particolare',
            'universale', 'individuale', 'collettivo', 'personale', 'pubblico'
        ],
        'C2': [
            'paradossale', 'contraddittorio', 'ambivalente', 'equivoco', 'ambiguo',
            'inequivocabile', 'chiaro', 'evidente', 'manifesto', 'palese', 'nascosto',
            'occulto', 'segreto', 'pubblico', 'privato', 'intimo', 'personale',
            'impersonale', 'oggettivo', 'soggettivo', 'neutrale', 'parziale',
            'imparziale', 'equo', 'ingiusto', 'giusto', 'sbagliato', 'corretto',
            'errato', 'esatto', 'preciso', 'impreciso', 'accurato', 'inaccurato'
        ]
    }
    
    words = word_lists.get(level, [])
    return words[:count]


def main():
    parser = argparse.ArgumentParser(description='从 Wiktionary 抓取意大利语单词数据')
    parser.add_argument('--level', type=str, required=True, choices=['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
                        help='单词级别')
    parser.add_argument('--count', type=int, default=50, help='要抓取的单词数量')
    parser.add_argument('--output', type=str, default='data/wiktionary_raw.json',
                        help='输出文件路径')
    parser.add_argument('--delay', type=float, default=0.5, help='请求间隔（秒）')
    
    args = parser.parse_args()
    
    # 加载单词列表
    word_list = load_word_list_by_level(args.level, args.count)
    
    if not word_list:
        print(f"No words found for level {args.level}")
        return
    
    print(f"开始抓取 {len(word_list)} 个 {args.level} 级别的单词...")
    
    # 创建抓取器
    fetcher = WiktionaryFetcher()
    
    # 批量抓取
    results = fetcher.fetch_word_list(word_list, delay=args.delay)
    
    # 保存结果
    output_data = {
        'level': args.level,
        'count': len(results),
        'words': results
    }
    
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n完成！共抓取 {len(results)} 个单词，已保存到 {args.output}")


if __name__ == '__main__':
    main()

