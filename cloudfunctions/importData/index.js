// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const words = event.words // 从小程序端传过来的数据

  if (!words || words.length === 0) {
    return { success: false, msg: 'No data provided' }
  }

  // 批量插入（云函数支持批量插入，比小程序端快得多）
  try {
    // 先清空旧数据（可选，防止重复，或者你可以注释掉这行）
    // await db.collection('words').where({}).remove() 

    // 云函数的 add 虽然只能单条或通过 API 批量，但这里演示循环 Promise 并发
    // 更高效的方式是使用 database.collection.add 的批量插入特性(如果在服务端sdk支持的话)
    // 这里的 add 在 server sdk 同样只支持单条插入或者 1000条限制的导入，
    // 但最稳妥的是循环插入，或者直接接收整个数组
    
    // 注意：db.collection('words').add({ data: [...] }) 在云函数端是支持批量插入数组的！
    // 这与小程序端不同，小程序端 add 的 data 只能是对象。
    
    const result = await db.collection('words').add({
      data: words
    })

    return {
      success: true,
      result: result
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
}

