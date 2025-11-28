// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  
  // 如果指定了 action 为 clear，则清空集合
  if (event.action === 'clear') {
    try {
      const _ = db.command
      let totalDeleted = 0
      
      while (true) {
        // 每次尝试删除 1000 条 (云函数端 remove 限制)
        const res = await db.collection('words')
          .where({
            _id: _.exists(true) // 匹配所有存在 _id 的记录
          })
          .limit(1000)
          .remove()
          
        // 如果本次删除了 0 条，说明删完了
        if (res.stats.removed === 0) {
          break
        }
        
        totalDeleted += res.stats.removed
        console.log(`Deleted ${res.stats.removed}, total: ${totalDeleted}`)
      }
      
      return { success: true, msg: `Database cleared, removed ${totalDeleted} records` }
    } catch (err) {
      console.error(err)
      return { success: false, error: err }
    }
  }

  const words = event.words // 从小程序端传过来的数据

  if (!words || words.length === 0) {
    return { success: false, msg: 'No data provided' }
  }

  // 批量插入
  try {
    const result = await db.collection('words').add({
      data: words
    })

    return {
      success: true,
      count: words.length,
      result: result
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
}

