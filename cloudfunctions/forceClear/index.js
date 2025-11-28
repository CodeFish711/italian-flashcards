const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command

  try {
    // 强制使用 collection.remove() 而不带 where 条件 (如果权限允许)
    // 或者尝试 drop 集合 (小程序端 SDK 不支持，云函数端也不支持 dropCollection)
    // 最稳妥还是循环删
    
    // 打印当前数量，方便调试
    const countRes = await db.collection('words').count()
    console.log('Current total count:', countRes.total)

    let totalDeleted = 0
    let loopCount = 0
    const MAX_LOOPS = 50 // 防止死循环，最多尝试50次 (5万条数据)

    while (loopCount < MAX_LOOPS) {
      loopCount++
      const res = await db.collection('words')
        .where({
           _id: _.neq('__PLACEHOLDER__') // 匹配任意非空ID，规避某些空 where 限制
        })
        .limit(1000)
        .remove()
      
      console.log(`Loop ${loopCount}: deleted ${res.stats.removed}`)
      
      if (res.stats.removed === 0) {
        break
      }
      totalDeleted += res.stats.removed
    }
    
    return { success: true, deleted: totalDeleted, initialCount: countRes.total }
  } catch (err) {
    console.error(err)
    return { success: false, error: err }
  }
}

