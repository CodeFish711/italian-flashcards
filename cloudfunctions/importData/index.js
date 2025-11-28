// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command

  // Action: init (使用本地预置数据初始化)
  if (event.action === 'init') {
    try {
      console.log('Starting full initialization...')
      
      // 1. 清空数据库 (复用之前的逻辑)
      let totalDeleted = 0
      while (true) {
        const res = await db.collection('words')
          .where({
            _id: _.exists(true)
          })
          .limit(1000)
          .remove()
          
        if (res.stats.removed === 0) break
        totalDeleted += res.stats.removed
        console.log(`Cleared ${res.stats.removed}, total deleted: ${totalDeleted}`)
      }
      
      // 2. 读取本地预置数据
      // 注意：word-list.js 需要在部署时被包含在云函数目录中
      let wordList = []
      try {
        wordList = require('./word-list.js')
      } catch (e) {
        console.error('Local word list file not found', e)
        return { success: false, msg: 'Local word-list.js not found in cloud function' }
      }

      if (!wordList || wordList.length === 0) {
        return { success: false, msg: 'Word list is empty' }
      }

      console.log(`Found ${wordList.length} words to import.`)

      // 3. 分批插入 (云函数单次 add 限制 1000 条，建议更小批次以防超时或超大包)
      // 这里使用 500 条一批
      const BATCH_SIZE = 500
      let totalImported = 0
      
      for (let i = 0; i < wordList.length; i += BATCH_SIZE) {
        const batch = wordList.slice(i, i + BATCH_SIZE)
        console.log(`Importing batch ${i / BATCH_SIZE + 1}, size: ${batch.length}`)
        
        await db.collection('words').add({
          data: batch
        })
        
        totalImported += batch.length
      }

    return {
      success: true,
        msg: `Initialization complete. Cleared ${totalDeleted}, Imported ${totalImported} words.` 
      }

    } catch (err) {
      console.error('Init failed', err)
      return { success: false, error: err }
    }
  }

  // 保留旧的 clear 逻辑 (可选，因为 init 已经包含了 clear)
  if (event.action === 'clear') {
    try {
      let totalDeleted = 0
      while (true) {
        const res = await db.collection('words')
          .where({ _id: _.exists(true) })
          .limit(1000)
          .remove()
        if (res.stats.removed === 0) break
        totalDeleted += res.stats.removed
      }
      return { success: true, msg: `Database cleared, removed ${totalDeleted} records` }
    } catch (err) {
      return { success: false, error: err }
    }
  }

  // 保留旧的批量插入逻辑 (如果前端还想自己传数据)
  const words = event.words 
  if (words && words.length > 0) {
    try {
      const result = await db.collection('words').add({
        data: words
      })
      return { success: true, count: words.length, result: result }
  } catch (err) {
      return { success: false, error: err }
    }
  }

  return { success: false, msg: 'Unknown action or no data provided' }
}
