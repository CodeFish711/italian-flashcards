// 云函数：导入 Wiktionary 数据
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database()
  const words = event.words // 从小程序端传过来的数据
  const level = event.level || 'A1' // 可选：指定级别

  if (!words || words.length === 0) {
    return { success: false, msg: 'No data provided' }
  }

  try {
    // 检查是否已存在（避免重复导入）
    const existingWords = await db.collection('words')
      .where({
        level: level
      })
      .get()

    const existingWordSet = new Set(existingWords.data.map(w => w.word.toLowerCase()))

    // 过滤掉已存在的单词
    const newWords = words.filter(w => {
      return !existingWordSet.has(w.word.toLowerCase())
    })

    if (newWords.length === 0) {
      return {
        success: true,
        msg: 'All words already exist',
        added: 0,
        skipped: words.length
      }
    }

    // 批量插入（云函数支持批量插入）
    // 注意：微信云数据库单次最多插入1000条
    const batchSize = 1000
    let added = 0
    let errors = []

    for (let i = 0; i < newWords.length; i += batchSize) {
      const batch = newWords.slice(i, i + batchSize)
      
      try {
        const result = await db.collection('words').add({
          data: batch
        })
        added += batch.length
        console.log(`Batch ${Math.floor(i / batchSize) + 1}: Added ${batch.length} words`)
      } catch (err) {
        console.error(`Batch ${Math.floor(i / batchSize) + 1} error:`, err)
        errors.push({
          batch: Math.floor(i / batchSize) + 1,
          error: err.message
        })
      }
    }

    return {
      success: true,
      added: added,
      skipped: words.length - newWords.length,
      total: words.length,
      errors: errors.length > 0 ? errors : undefined
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    }
  }
}

