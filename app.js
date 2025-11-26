// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-5ghjzbdj44cfc396',
        traceUser: true,
      })

      // 尝试自动注册/更新用户信息
      this.checkUser();
    }
    console.log('App Launch')
  },

  checkUser() {
    const db = wx.cloud.database();
    const users = db.collection('users');
    
    // 调用云函数获取 openid 也可以，或者直接在前端由云开发隐式处理
    // 这里简单尝试读取自己的用户信息
    users.get().then(res => {
      if (res.data.length === 0) {
        // 新用户，注册
        users.add({
          data: {
            join_time: db.serverDate(),
            last_login: db.serverDate()
            // 昵称头像等需要用户授权，暂时留空
          }
        });
      } else {
        // 老用户，更新最后登录时间
        users.doc(res.data[0]._id).update({
          data: {
            last_login: db.serverDate()
          }
        });
      }
    }).catch(err => {
      // 集合可能不存在，静默失败
      console.log('User check skipped or failed', err);
    });
  },

  globalData: {
    userInfo: null
  }
})
