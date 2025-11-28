const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  const $ = db.command.aggregate
  const { OPENID } = cloud.getWXContext()

  try {
    // 1. 聚合统计每个等级的单词总数 (words 集合)
    // 生产环境通常会把这个结果缓存，不用每次都算，但这里为了实时性先实时聚合
    const totalStatsRes = await db.collection('words')
      .aggregate()
      .group({
        _id: '$level',
        total: $.sum(1)
      })
      .end()
    
    // 转换格式: { "A1": 200, "A2": 200, ... }
    const totalStats = {}
    totalStatsRes.list.forEach(item => {
      if (item._id) totalStats[item._id] = item.total
    })

    // 2. 聚合统计当前用户的学习进度 (study_progress 集合)
    const learnedStatsRes = await db.collection('study_progress')
      .aggregate()
      .match({
        _openid: OPENID // 确保只统计当前用户的
        // 如果需要过滤 is_mastered: true 才算进度，可以在这里加
        // 目前逻辑是有记录就算已学
      })
      // 这里的难点是 study_progress 表里可能没有 level 字段 (之前看结构只有 word_id)
      // 生产环境设计：study_progress 应该冗余 level 字段，或者 word_id 包含 level 信息，或者需要联表查询 (lookup)
      // 既然追求生产环境标准，使用 lookup 联表查询是最稳妥的
      .lookup({
        from: 'words',
        localField: 'word_id',
        foreignField: '_id', // 假设 words 的 _id 与 study_progress 的 word_id 对应
        as: 'word_info'
      })
      .unwind({
        path: '$word_info',
        preserveNullAndEmptyArrays: false // 如果找不到对应的 word (比如已被删除)，则忽略这条进度
      }) 
      .group({
        _id: '$word_info.level',
        learned: $.sum(1)
      })
      .end()

    const learnedStats = {}
    learnedStatsRes.list.forEach(item => {
      if (item._id) learnedStats[item._id] = item.learned
    })

    // 3. 组装最终数据
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    const result = levels.map(level => ({
      level,
      total: totalStats[level] || 0,
      learned: learnedStats[level] || 0,
      progress: (totalStats[level] > 0) ? Math.round((learnedStats[level] || 0) / totalStats[level] * 100) : 0
    }))

    return {
      success: true,
      data: result
    }

  } catch (err) {
    console.error(err)
    return {
      success: false,
      error: err
    }
  }
}

