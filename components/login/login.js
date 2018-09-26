var isLogin = true;
Component({
    /**
     * 私有数据,组件的初始数据
     * 可用于模版渲染
     */
    data: {
        // 弹窗显示控制
        isShow: true,
        loginTx: '同意安全登录'
    },

    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    attached() {
        setTimeout( () => {
            this.setData({
                isShow: !getApp().data.userInfo.nickName
            })
        }, 0)
    },
    methods: {
        /*
         * 公有方法
         */
        onGotUserInfo: function(e) {
            this.setData({
                loginTx: '正在登陆中...'
            })
            if (isLogin){
                getApp().data.userInfo = e.detail.userInfo
                wx.login({
                    success: res => {
                        // 获取code
                        if (res.code) {
                            // 获取 openid
                            wx.request({
                                url: 'https://www.zongdusir.top/setUser',
                                method: 'get',
                                data: {
                                    userInfo: getApp().data.userInfo,
                                    code: res.code
                                },
                                success: res => {
                                    getApp().data.userInfo.openid = res.data
                                    isLogin = false;
                                    this.setData(getApp().data)

                                    setTimeout(() => {
                                        this.setData({
                                            isShow: !res.data
                                        })
                                    },100)
                                }
                            })
                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }
                    }
                });
            }
        }
    }
})