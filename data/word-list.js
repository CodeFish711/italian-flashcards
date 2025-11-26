const wordList = [
  // A1 级别 (10个单词)
  {
    id: 1,
    word: "Ciao",
    pronunciation: "/tʃaː.o/",
    part_of_speech: "int.", 
    level: "A1",
    meaning: "你好/再见",
    example: "Ciao, come stai?",
    example_meaning: "你好，你好吗？",
    options: [
      { text: "你好/再见", isCorrect: true },
      { text: "谢谢", isCorrect: false },
      { text: "对不起", isCorrect: false },
      { text: "晚安", isCorrect: false }
    ]
  },
  {
    id: 2,
    word: "Amore",
    pronunciation: "/aˈmo.re/",
    part_of_speech: "n.m.", 
    level: "A1",
    meaning: "爱",
    example: "Il vero amore è eterno.",
    example_meaning: "真爱是永恒的。",
    options: [
      { text: "恨", isCorrect: false },
      { text: "爱", isCorrect: true },
      { text: "朋友", isCorrect: false },
      { text: "家庭", isCorrect: false }
    ]
  },
  {
    id: 3,
    word: "Gatto",
    pronunciation: "/ˈɡat.to/",
    part_of_speech: "n.m.",
    level: "A1",
    meaning: "猫",
    example: "Il gatto dorme sul divano.",
    example_meaning: "猫在沙发上睡觉。",
    options: [
      { text: "狗", isCorrect: false },
      { text: "鸟", isCorrect: false },
      { text: "猫", isCorrect: true },
      { text: "鱼", isCorrect: false }
    ]
  },
  {
    id: 4,
    word: "Mangiare", 
    pronunciation: "/manˈdʒa.re/",
    part_of_speech: "v.",
    level: "A1",
    meaning: "吃",
    example: "Mi piace mangiare la pizza.",
    example_meaning: "我喜欢吃披萨。",
    options: [
      { text: "喝", isCorrect: false },
      { text: "吃", isCorrect: true },
      { text: "睡", isCorrect: false },
      { text: "跑", isCorrect: false }
    ]
  },
  {
    id: 5,
    word: "Acqua",
    pronunciation: "/ˈak.kwa/",
    part_of_speech: "n.f.",
    level: "A1",
    meaning: "水",
    example: "Bevo un bicchiere d'acqua.",
    example_meaning: "我喝一杯水。",
    options: [
      { text: "水", isCorrect: true },
      { text: "牛奶", isCorrect: false },
      { text: "咖啡", isCorrect: false },
      { text: "茶", isCorrect: false }
    ]
  },
  {
    id: 6,
    word: "Casa",
    pronunciation: "/ˈka.za/",
    part_of_speech: "n.f.",
    level: "A1",
    meaning: "房子/家",
    example: "La mia casa è molto bella.",
    example_meaning: "我的房子很漂亮。",
    options: [
      { text: "学校", isCorrect: false },
      { text: "房子/家", isCorrect: true },
      { text: "商店", isCorrect: false },
      { text: "医院", isCorrect: false }
    ]
  },
  {
    id: 7,
    word: "Buongiorno",
    pronunciation: "/bwonˈdʒor.no/",
    part_of_speech: "int.",
    level: "A1",
    meaning: "早上好",
    example: "Buongiorno, signore!",
    example_meaning: "早上好，先生！",
    options: [
      { text: "早上好", isCorrect: true },
      { text: "晚上好", isCorrect: false },
      { text: "再见", isCorrect: false },
      { text: "谢谢", isCorrect: false }
    ]
  },
  {
    id: 8,
    word: "Bello",
    pronunciation: "/ˈbel.lo/",
    part_of_speech: "adj.",
    level: "A1",
    meaning: "美丽的/好的",
    example: "Che bella giornata!",
    example_meaning: "多美好的一天！",
    options: [
      { text: "丑陋的", isCorrect: false },
      { text: "美丽的/好的", isCorrect: true },
      { text: "大的", isCorrect: false },
      { text: "小的", isCorrect: false }
    ]
  },
  {
    id: 9,
    word: "Grazie",
    pronunciation: "/ˈɡrat.tsje/",
    part_of_speech: "int.",
    level: "A1",
    meaning: "谢谢",
    example: "Grazie mille per il tuo aiuto.",
    example_meaning: "非常感谢你的帮助。",
    options: [
      { text: "对不起", isCorrect: false },
      { text: "谢谢", isCorrect: true },
      { text: "请", isCorrect: false },
      { text: "不客气", isCorrect: false }
    ]
  },
  {
    id: 10,
    word: "Libro",
    pronunciation: "/ˈli.bro/",
    part_of_speech: "n.m.",
    level: "A1",
    meaning: "书",
    example: "Leggo un libro ogni sera.",
    example_meaning: "我每天晚上读一本书。",
    options: [
      { text: "笔", isCorrect: false },
      { text: "书", isCorrect: true },
      { text: "桌子", isCorrect: false },
      { text: "椅子", isCorrect: false }
    ]
  },

  // A2 级别 (10个单词)
  {
    id: 11,
    word: "Viaggiare",
    pronunciation: "/vjadˈdʒa.re/",
    part_of_speech: "v.",
    level: "A2",
    meaning: "旅行",
    example: "Mi piace viaggiare in estate.",
    example_meaning: "我喜欢在夏天旅行。",
    options: [
      { text: "工作", isCorrect: false },
      { text: "旅行", isCorrect: true },
      { text: "学习", isCorrect: false },
      { text: "睡觉", isCorrect: false }
    ]
  },
  {
    id: 12,
    word: "Piacere",
    pronunciation: "/pjaˈtʃe.re/",
    part_of_speech: "v.",
    level: "A2",
    meaning: "喜欢/使高兴",
    example: "Mi piace molto la musica italiana.",
    example_meaning: "我非常喜欢意大利音乐。",
    options: [
      { text: "讨厌", isCorrect: false },
      { text: "喜欢/使高兴", isCorrect: true },
      { text: "害怕", isCorrect: false },
      { text: "忘记", isCorrect: false }
    ]
  },
  {
    id: 13,
    word: "Lavoro",
    pronunciation: "/laˈvo.ro/",
    part_of_speech: "n.m.",
    level: "A2",
    meaning: "工作",
    example: "Il mio lavoro è molto interessante.",
    example_meaning: "我的工作很有趣。",
    options: [
      { text: "工作", isCorrect: true },
      { text: "学校", isCorrect: false },
      { text: "商店", isCorrect: false },
      { text: "医院", isCorrect: false }
    ]
  },
  {
    id: 14,
    word: "Stazione",
    pronunciation: "/statˈtsjo.ne/",
    part_of_speech: "n.f.",
    level: "A2",
    meaning: "车站",
    example: "La stazione è molto lontana da qui.",
    example_meaning: "车站离这里很远。",
    options: [
      { text: "机场", isCorrect: false },
      { text: "车站", isCorrect: true },
      { text: "港口", isCorrect: false },
      { text: "公园", isCorrect: false }
    ]
  },
  {
    id: 15,
    word: "Difficile",
    pronunciation: "/difˈfi.tʃi.le/",
    part_of_speech: "adj.",
    level: "A2",
    meaning: "困难的",
    example: "Questo esercizio è molto difficile.",
    example_meaning: "这个练习很难。",
    options: [
      { text: "容易的", isCorrect: false },
      { text: "困难的", isCorrect: true },
      { text: "有趣的", isCorrect: false },
      { text: "无聊的", isCorrect: false }
    ]
  },
  {
    id: 16,
    word: "Capire",
    pronunciation: "/kaˈpi.re/",
    part_of_speech: "v.",
    level: "A2",
    meaning: "理解/明白",
    example: "Non capisco questa parola.",
    example_meaning: "我不理解这个词。",
    options: [
      { text: "忘记", isCorrect: false },
      { text: "理解/明白", isCorrect: true },
      { text: "记住", isCorrect: false },
      { text: "学习", isCorrect: false }
    ]
  },
  {
    id: 17,
    word: "Tempo",
    pronunciation: "/ˈtem.po/",
    part_of_speech: "n.m.",
    level: "A2",
    meaning: "时间/天气",
    example: "Non ho tempo per questo.",
    example_meaning: "我没有时间做这个。",
    options: [
      { text: "时间/天气", isCorrect: true },
      { text: "地方", isCorrect: false },
      { text: "人", isCorrect: false },
      { text: "东西", isCorrect: false }
    ]
  },
  {
    id: 18,
    word: "Chiedere",
    pronunciation: "/ˈkjɛ.de.re/",
    part_of_speech: "v.",
    level: "A2",
    meaning: "问/请求",
    example: "Posso chiederti un favore?",
    example_meaning: "我能请你帮个忙吗？",
    options: [
      { text: "回答", isCorrect: false },
      { text: "问/请求", isCorrect: true },
      { text: "告诉", isCorrect: false },
      { text: "说", isCorrect: false }
    ]
  },
  {
    id: 19,
    word: "Ricordare",
    pronunciation: "/rikoˈdar.re/",
    part_of_speech: "v.",
    level: "A2",
    meaning: "记住/回忆",
    example: "Non ricordo il suo nome.",
    example_meaning: "我不记得他的名字。",
    options: [
      { text: "忘记", isCorrect: false },
      { text: "记住/回忆", isCorrect: true },
      { text: "学习", isCorrect: false },
      { text: "理解", isCorrect: false }
    ]
  },
  {
    id: 20,
    word: "Sempre",
    pronunciation: "/ˈsem.pre/",
    part_of_speech: "adv.",
    level: "A2",
    meaning: "总是/一直",
    example: "Vado sempre in palestra il lunedì.",
    example_meaning: "我总是在周一去健身房。",
    options: [
      { text: "从不", isCorrect: false },
      { text: "总是/一直", isCorrect: true },
      { text: "有时", isCorrect: false },
      { text: "经常", isCorrect: false }
    ]
  },

  // B1 级别 (10个单词)
  {
    id: 21,
    word: "Sviluppare",
    pronunciation: "/zvilupˈpa.re/",
    part_of_speech: "v.",
    level: "B1",
    meaning: "发展/开发",
    example: "Stiamo sviluppando un nuovo progetto.",
    example_meaning: "我们正在开发一个新项目。",
    options: [
      { text: "破坏", isCorrect: false },
      { text: "发展/开发", isCorrect: true },
      { text: "停止", isCorrect: false },
      { text: "开始", isCorrect: false }
    ]
  },
  {
    id: 22,
    word: "Raggiungere",
    pronunciation: "/radˈdʒun.dʒe.re/",
    part_of_speech: "v.",
    level: "B1",
    meaning: "到达/达到",
    example: "Spero di raggiungere i miei obiettivi.",
    example_meaning: "我希望达到我的目标。",
    options: [
      { text: "离开", isCorrect: false },
      { text: "到达/达到", isCorrect: true },
      { text: "开始", isCorrect: false },
      { text: "结束", isCorrect: false }
    ]
  },
  {
    id: 23,
    word: "Influenza",
    pronunciation: "/in.fluˈɛn.tsa/",
    part_of_speech: "n.f.",
    level: "B1",
    meaning: "影响/流感",
    example: "La sua influenza su di me è stata positiva.",
    example_meaning: "他对我的影响是积极的。",
    options: [
      { text: "影响/流感", isCorrect: true },
      { text: "原因", isCorrect: false },
      { text: "结果", isCorrect: false },
      { text: "问题", isCorrect: false }
    ]
  },
  {
    id: 24,
    word: "Considerare",
    pronunciation: "/kon.si.deˈra.re/",
    part_of_speech: "v.",
    level: "B1",
    meaning: "考虑/认为",
    example: "Devo considerare tutte le opzioni.",
    example_meaning: "我必须考虑所有选项。",
    options: [
      { text: "忽略", isCorrect: false },
      { text: "考虑/认为", isCorrect: true },
      { text: "拒绝", isCorrect: false },
      { text: "接受", isCorrect: false }
    ]
  },
  {
    id: 25,
    word: "Risultato",
    pronunciation: "/ri.zulˈta.to/",
    part_of_speech: "n.m.",
    level: "B1",
    meaning: "结果",
    example: "Il risultato dell'esame è positivo.",
    example_meaning: "考试结果是积极的。",
    options: [
      { text: "原因", isCorrect: false },
      { text: "结果", isCorrect: true },
      { text: "过程", isCorrect: false },
      { text: "方法", isCorrect: false }
    ]
  },
  {
    id: 26,
    word: "Speranza",
    pronunciation: "/speˈran.tsa/",
    part_of_speech: "n.f.",
    level: "B1",
    meaning: "希望",
    example: "Non perdo mai la speranza.",
    example_meaning: "我从不失去希望。",
    options: [
      { text: "失望", isCorrect: false },
      { text: "希望", isCorrect: true },
      { text: "恐惧", isCorrect: false },
      { text: "愤怒", isCorrect: false }
    ]
  },
  {
    id: 27,
    word: "Riconoscere",
    pronunciation: "/rikoˈnoʃ.ʃe.re/",
    part_of_speech: "v.",
    level: "B1",
    meaning: "认出/承认",
    example: "Non riesco a riconoscere quella persona.",
    example_meaning: "我认不出那个人。",
    options: [
      { text: "忽略", isCorrect: false },
      { text: "认出/承认", isCorrect: true },
      { text: "忘记", isCorrect: false },
      { text: "拒绝", isCorrect: false }
    ]
  },
  {
    id: 28,
    word: "Sfida",
    pronunciation: "/ˈsfi.da/",
    part_of_speech: "n.f.",
    level: "B1",
    meaning: "挑战",
    example: "Questa è una grande sfida per me.",
    example_meaning: "这对我来说是一个巨大的挑战。",
    options: [
      { text: "机会", isCorrect: false },
      { text: "挑战", isCorrect: true },
      { text: "问题", isCorrect: false },
      { text: "解决方案", isCorrect: false }
    ]
  },
  {
    id: 29,
    word: "Esperienza",
    pronunciation: "/e.speˈrjɛn.tsa/",
    part_of_speech: "n.f.",
    level: "B1",
    meaning: "经验/经历",
    example: "Ho avuto un'esperienza indimenticabile.",
    example_meaning: "我有了一次难忘的经历。",
    options: [
      { text: "经验/经历", isCorrect: true },
      { text: "知识", isCorrect: false },
      { text: "技能", isCorrect: false },
      { text: "能力", isCorrect: false }
    ]
  },
  {
    id: 30,
    word: "Comportamento",
    pronunciation: "/kom.por.taˈmen.to/",
    part_of_speech: "n.m.",
    level: "B1",
    meaning: "行为",
    example: "Il suo comportamento è inaccettabile.",
    example_meaning: "他的行为是不可接受的。",
    options: [
      { text: "想法", isCorrect: false },
      { text: "行为", isCorrect: true },
      { text: "感觉", isCorrect: false },
      { text: "态度", isCorrect: false }
    ]
  },

  // B2 级别 (10个单词)
  {
    id: 31,
    word: "Apprezzare",
    pronunciation: "/ap.pretˈtsa.re/",
    part_of_speech: "v.",
    level: "B2",
    meaning: "欣赏/重视",
    example: "Apprezzo molto il tuo aiuto.",
    example_meaning: "我非常感谢你的帮助。",
    options: [
      { text: "忽视", isCorrect: false },
      { text: "欣赏/重视", isCorrect: true },
      { text: "批评", isCorrect: false },
      { text: "拒绝", isCorrect: false }
    ]
  },
  {
    id: 32,
    word: "Conseguenza",
    pronunciation: "/kon.seˈɡwɛn.tsa/",
    part_of_speech: "n.f.",
    level: "B2",
    meaning: "后果/结果",
    example: "Devi considerare le conseguenze delle tue azioni.",
    example_meaning: "你必须考虑你行为的后果。",
    options: [
      { text: "原因", isCorrect: false },
      { text: "后果/结果", isCorrect: true },
      { text: "过程", isCorrect: false },
      { text: "方法", isCorrect: false }
    ]
  },
  {
    id: 33,
    word: "Efficace",
    pronunciation: "/ef.fiˈka.tʃe/",
    part_of_speech: "adj.",
    level: "B2",
    meaning: "有效的",
    example: "Questo metodo è molto efficace.",
    example_meaning: "这个方法非常有效。",
    options: [
      { text: "无效的", isCorrect: false },
      { text: "有效的", isCorrect: true },
      { text: "困难的", isCorrect: false },
      { text: "简单的", isCorrect: false }
    ]
  },
  {
    id: 34,
    word: "Riflettere",
    pronunciation: "/ri.fletˈte.re/",
    part_of_speech: "v.",
    level: "B2",
    meaning: "反思/反映",
    example: "Devo riflettere su questa decisione.",
    example_meaning: "我必须反思这个决定。",
    options: [
      { text: "忽略", isCorrect: false },
      { text: "反思/反映", isCorrect: true },
      { text: "忘记", isCorrect: false },
      { text: "接受", isCorrect: false }
    ]
  },
  {
    id: 35,
    word: "Sostanziale",
    pronunciation: "/so.stanˈtsja.le/",
    part_of_speech: "adj.",
    level: "B2",
    meaning: "实质的/重要的",
    example: "C'è stata una sostanziale differenza.",
    example_meaning: "有实质性的差异。",
    options: [
      { text: "表面的", isCorrect: false },
      { text: "实质的/重要的", isCorrect: true },
      { text: "小的", isCorrect: false },
      { text: "不重要的", isCorrect: false }
    ]
  },
  {
    id: 36,
    word: "Affrontare",
    pronunciation: "/af.fronˈta.re/",
    part_of_speech: "v.",
    level: "B2",
    meaning: "面对/处理",
    example: "Devo affrontare questo problema.",
    example_meaning: "我必须面对这个问题。",
    options: [
      { text: "逃避", isCorrect: false },
      { text: "面对/处理", isCorrect: true },
      { text: "忽略", isCorrect: false },
      { text: "忘记", isCorrect: false }
    ]
  },
  {
    id: 37,
    word: "Rilevante",
    pronunciation: "/ri.leˈvan.te/",
    part_of_speech: "adj.",
    level: "B2",
    meaning: "相关的/重要的",
    example: "Questo è un punto rilevante.",
    example_meaning: "这是一个重要的点。",
    options: [
      { text: "不相关的", isCorrect: false },
      { text: "相关的/重要的", isCorrect: true },
      { text: "不重要的", isCorrect: false },
      { text: "小的", isCorrect: false }
    ]
  },
  {
    id: 38,
    word: "Perseguire",
    pronunciation: "/per.seˈɡwi.re/",
    part_of_speech: "v.",
    level: "B2",
    meaning: "追求/继续",
    example: "Devo perseguire i miei sogni.",
    example_meaning: "我必须追求我的梦想。",
    options: [
      { text: "放弃", isCorrect: false },
      { text: "追求/继续", isCorrect: true },
      { text: "停止", isCorrect: false },
      { text: "拒绝", isCorrect: false }
    ]
  },
  {
    id: 39,
    word: "Coerenza",
    pronunciation: "/ko.eˈrɛn.tsa/",
    part_of_speech: "n.f.",
    level: "B2",
    meaning: "一致性/连贯性",
    example: "Manca coerenza nel suo discorso.",
    example_meaning: "他的演讲缺乏连贯性。",
    options: [
      { text: "矛盾", isCorrect: false },
      { text: "一致性/连贯性", isCorrect: true },
      { text: "混乱", isCorrect: false },
      { text: "差异", isCorrect: false }
    ]
  },
  {
    id: 40,
    word: "Implicazione",
    pronunciation: "/im.pli.katˈtsjo.ne/",
    part_of_speech: "n.f.",
    level: "B2",
    meaning: "含义/影响",
    example: "Le implicazioni di questa decisione sono gravi.",
    example_meaning: "这个决定的影响是严重的。",
    options: [
      { text: "原因", isCorrect: false },
      { text: "含义/影响", isCorrect: true },
      { text: "结果", isCorrect: false },
      { text: "过程", isCorrect: false }
    ]
  },

  // C1 级别 (10个单词)
  {
    id: 41,
    word: "Elaborare",
    pronunciation: "/e.la.boˈra.re/",
    part_of_speech: "v.",
    level: "C1",
    meaning: "详细阐述/加工",
    example: "Devo elaborare una strategia complessa.",
    example_meaning: "我必须制定一个复杂的策略。",
    options: [
      { text: "简化", isCorrect: false },
      { text: "详细阐述/加工", isCorrect: true },
      { text: "忽略", isCorrect: false },
      { text: "拒绝", isCorrect: false }
    ]
  },
  {
    id: 42,
    word: "Sofisticato",
    pronunciation: "/so.fis.tiˈka.to/",
    part_of_speech: "adj.",
    level: "C1",
    meaning: "复杂的/精致的",
    example: "Questo è un sistema molto sofisticato.",
    example_meaning: "这是一个非常复杂的系统。",
    options: [
      { text: "简单的", isCorrect: false },
      { text: "复杂的/精致的", isCorrect: true },
      { text: "粗糙的", isCorrect: false },
      { text: "基础的", isCorrect: false }
    ]
  },
  {
    id: 43,
    word: "Contestualizzare",
    pronunciation: "/kon.te.stu.a.lidˈdza.re/",
    part_of_speech: "v.",
    level: "C1",
    meaning: "将...置于语境中",
    example: "Bisogna contestualizzare questo evento storico.",
    example_meaning: "必须将这个历史事件置于语境中。",
    options: [
      { text: "脱离语境", isCorrect: false },
      { text: "将...置于语境中", isCorrect: true },
      { text: "忽略", isCorrect: false },
      { text: "简化", isCorrect: false }
    ]
  },
  {
    id: 44,
    word: "Metodologia",
    pronunciation: "/me.to.do.loˈdʒi.a/",
    part_of_speech: "n.f.",
    level: "C1",
    meaning: "方法论",
    example: "La metodologia di ricerca è rigorosa.",
    example_meaning: "研究方法论是严谨的。",
    options: [
      { text: "结果", isCorrect: false },
      { text: "方法论", isCorrect: true },
      { text: "问题", isCorrect: false },
      { text: "结论", isCorrect: false }
    ]
  },
  {
    id: 45,
    word: "Articolare",
    pronunciation: "/ar.ti.kuˈla.re/",
    part_of_speech: "v.",
    level: "C1",
    meaning: "阐述/表达",
    example: "Devo articolare meglio le mie idee.",
    example_meaning: "我必须更好地阐述我的想法。",
    options: [
      { text: "隐藏", isCorrect: false },
      { text: "阐述/表达", isCorrect: true },
      { text: "忽略", isCorrect: false },
      { text: "忘记", isCorrect: false }
    ]
  },
  {
    id: 46,
    word: "Ponderare",
    pronunciation: "/pon.deˈra.re/",
    part_of_speech: "v.",
    level: "C1",
    meaning: "仔细考虑/权衡",
    example: "Devo ponderare attentamente questa scelta.",
    example_meaning: "我必须仔细考虑这个选择。",
    options: [
      { text: "匆忙决定", isCorrect: false },
      { text: "仔细考虑/权衡", isCorrect: true },
      { text: "忽略", isCorrect: false },
      { text: "拒绝", isCorrect: false }
    ]
  },
  {
    id: 47,
    word: "Pervasivo",
    pronunciation: "/per.vaˈzi.vo/",
    part_of_speech: "adj.",
    level: "C1",
    meaning: "普遍的/渗透的",
    example: "L'influenza della tecnologia è pervasiva.",
    example_meaning: "技术的影响是普遍的。",
    options: [
      { text: "有限的", isCorrect: false },
      { text: "普遍的/渗透的", isCorrect: true },
      { text: "局部的", isCorrect: false },
      { text: "稀少的", isCorrect: false }
    ]
  },
  {
    id: 48,
    word: "Intrinseco",
    pronunciation: "/inˈtrin.se.ko/",
    part_of_speech: "adj.",
    level: "C1",
    meaning: "内在的/固有的",
    example: "Questo problema ha una natura intrinseca.",
    example_meaning: "这个问题具有内在性质。",
    options: [
      { text: "外在的", isCorrect: false },
      { text: "内在的/固有的", isCorrect: true },
      { text: "表面的", isCorrect: false },
      { text: "附加的", isCorrect: false }
    ]
  },
  {
    id: 49,
    word: "Discrezionale",
    pronunciation: "/di.skre.tsjoˈna.le/",
    part_of_speech: "adj.",
    level: "C1",
    meaning: "自由裁量的/可选择的",
    example: "Questo è un potere discrezionale.",
    example_meaning: "这是一个自由裁量权。",
    options: [
      { text: "强制的", isCorrect: false },
      { text: "自由裁量的/可选择的", isCorrect: true },
      { text: "固定的", isCorrect: false },
      { text: "必需的", isCorrect: false }
    ]
  },
  {
    id: 50,
    word: "Eterogeneo",
    pronunciation: "/e.te.roˈdʒɛ.ne.o/",
    part_of_speech: "adj.",
    level: "C1",
    meaning: "异质的/多样的",
    example: "Il gruppo è molto eterogeneo.",
    example_meaning: "这个群体非常多样化。",
    options: [
      { text: "同质的", isCorrect: false },
      { text: "异质的/多样的", isCorrect: true },
      { text: "统一的", isCorrect: false },
      { text: "单一的", isCorrect: false }
    ]
  },

  // C2 级别 (10个单词)
  {
    id: 51,
    word: "Precipitevolissimevolmente",
    pronunciation: "/pre.tʃi.pi.te.vo.lis.si.me.volˈmen.te/",
    part_of_speech: "adv.",
    level: "C2",
    meaning: "极其匆忙地",
    example: "Se ne andò precipitevolissimevolmente.",
    example_meaning: "他匆匆忙忙地离开了。",
    options: [
      { text: "缓慢地", isCorrect: false },
      { text: "极其匆忙地", isCorrect: true },
      { text: "温柔地", isCorrect: false },
      { text: "快乐地", isCorrect: false }
    ]
  },
  {
    id: 52,
    word: "Incommensurabile",
    pronunciation: "/in.kom.men.suˈra.bi.le/",
    part_of_speech: "adj.",
    level: "C2",
    meaning: "不可估量的/巨大的",
    example: "La sua importanza è incommensurabile.",
    example_meaning: "它的重要性是不可估量的。",
    options: [
      { text: "可测量的", isCorrect: false },
      { text: "不可估量的/巨大的", isCorrect: true },
      { text: "小的", isCorrect: false },
      { text: "有限的", isCorrect: false }
    ]
  },
  {
    id: 53,
    word: "Eterodossia",
    pronunciation: "/e.te.rodˈdok.sja/",
    part_of_speech: "n.f.",
    level: "C2",
    meaning: "异端/非正统",
    example: "La sua teoria è considerata eterodossia.",
    example_meaning: "他的理论被认为是异端。",
    options: [
      { text: "正统", isCorrect: false },
      { text: "异端/非正统", isCorrect: true },
      { text: "传统", isCorrect: false },
      { text: "标准", isCorrect: false }
    ]
  },
  {
    id: 54,
    word: "Paradigmatico",
    pronunciation: "/pa.ra.diɡˈma.ti.ko/",
    part_of_speech: "adj.",
    level: "C2",
    meaning: "典范的/典型的",
    example: "Questo è un caso paradigmatico.",
    example_meaning: "这是一个典型例子。",
    options: [
      { text: "非典型的", isCorrect: false },
      { text: "典范的/典型的", isCorrect: true },
      { text: "异常的", isCorrect: false },
      { text: "独特的", isCorrect: false }
    ]
  },
  {
    id: 55,
    word: "Epistemologico",
    pronunciation: "/e.pi.ste.moˈlɔ.dʒi.ko/",
    part_of_speech: "adj.",
    level: "C2",
    meaning: "认识论的",
    example: "Questo è un problema epistemologico.",
    example_meaning: "这是一个认识论问题。",
    options: [
      { text: "实践的", isCorrect: false },
      { text: "认识论的", isCorrect: true },
      { text: "技术的", isCorrect: false },
      { text: "实用的", isCorrect: false }
    ]
  },
  {
    id: 56,
    word: "Ontologico",
    pronunciation: "/on.toˈlɔ.dʒi.ko/",
    part_of_speech: "adj.",
    level: "C2",
    meaning: "本体论的",
    example: "La questione ontologica è fondamentale.",
    example_meaning: "本体论问题是根本性的。",
    options: [
      { text: "表面的", isCorrect: false },
      { text: "本体论的", isCorrect: true },
      { text: "实用的", isCorrect: false },
      { text: "技术的", isCorrect: false }
    ]
  },
  {
    id: 57,
    word: "Esegetico",
    pronunciation: "/e.zeˈdʒɛ.ti.ko/",
    part_of_speech: "adj.",
    level: "C2",
    meaning: "注释的/解释的",
    example: "Questo è un approccio esegetico.",
    example_meaning: "这是一种注释方法。",
    options: [
      { text: "创造的", isCorrect: false },
      { text: "注释的/解释的", isCorrect: true },
      { text: "原创的", isCorrect: false },
      { text: "创新的", isCorrect: false }
    ]
  },
  {
    id: 58,
    word: "Ermeneutico",
    pronunciation: "/er.meˈnɛu.ti.ko/",
    part_of_speech: "adj.",
    level: "C2",
    meaning: "解释学的",
    example: "Il metodo ermeneutico è complesso.",
    example_meaning: "解释学方法是复杂的。",
    options: [
      { text: "简单的", isCorrect: false },
      { text: "解释学的", isCorrect: true },
      { text: "直接的", isCorrect: false },
      { text: "表面的", isCorrect: false }
    ]
  },
  {
    id: 59,
    word: "Teleologico",
    pronunciation: "/te.le.oˈlɔ.dʒi.ko/",
    part_of_speech: "adj.",
    level: "C2",
    meaning: "目的论的",
    example: "La spiegazione teleologica è convincente.",
    example_meaning: "目的论解释是有说服力的。",
    options: [
      { text: "因果的", isCorrect: false },
      { text: "目的论的", isCorrect: true },
      { text: "随机的", isCorrect: false },
      { text: "偶然的", isCorrect: false }
    ]
  },
  {
    id: 60,
    word: "Sussunzione",
    pronunciation: "/sus.sunˈtsjo.ne/",
    part_of_speech: "n.f.",
    level: "C2",
    meaning: "包含/归类",
    example: "La sussunzione di questo caso è problematica.",
    example_meaning: "这个案例的归类是有问题的。",
    options: [
      { text: "排除", isCorrect: false },
      { text: "包含/归类", isCorrect: true },
      { text: "分离", isCorrect: false },
      { text: "区分", isCorrect: false }
    ]
  }
];

module.exports = {
  wordList: wordList
}
