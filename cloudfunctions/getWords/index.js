const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  
  // 参数: level (必填), page (选填, 默认0), pageSize (选填, 默认100, 最大1000)
  // 如果 pageSize 设为 1000 且数据不超过 1000，则相当于一次性拉取所有
  const { level, ids } = event
  const page = event.page || 0
  const pageSize = event.pageSize || 200 // 默认拉取 200 条，正好覆盖一个等级

  try {
    let query = db.collection('words')

    // 模式 1: 按 ID 列表获取 (用于错题本/收藏夹)
    if (ids && Array.isArray(ids) && ids.length > 0) {
      // 如果 id 数量很多，可能需要分批查询或者使用 in 操作符 (in 操作符也有上限，通常 100 左右)
      // 生产环境建议前端分批传，或者这里循环查
      // 这里简化处理：假设 ids 数量在合理范围内
      return await query.where({
        _id: _.in(ids)
      })
      .limit(1000) // 尽可能多拿
      .get()
    }

    // 模式 2: 按等级获取
    if (level) {
      query = query.where({
        level: level
      })
    }
    
    // 如果没有指定 level 也没有 ids，可能是想拉取所有? 暂时限制必须传参以防滥用
    if (!level && !ids) {
       return { data: [], msg: 'Missing parameters' }
    }

    // 执行查询
    // 注意：skip 的性能随着页数增加会下降，生产环境海量数据建议使用上次查询的 lastId 进行 range 查询
    // 但对于几千条数据，skip 问题不大
    const res = await query
      .skip(page * pageSize)
      .limit(pageSize)
      .get()
    
    // 必须要显式返回 success 字段，和前端约定一致
    return {
      success: true,
      data: res.data,
      hasMore: res.data.length === pageSize
    }

  } catch (err) {
    console.error(err)
    return {
      success: false,
      error: err
    }
  }
}

