Component({
    /**
     * 私有数据,组件的初始数据
     * 可用于模版渲染
     */
    data: {
        // 弹窗显示控制
        isShow: true
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
            console.log(this.data)
        }, 0)
    },
    methods: {
        /*
         * 公有方法
         */
        onGotUserInfo: function(e) {
            getApp().data.userInfo = e.detail.userInfo
            this.setData({
                isShow: false
            })
            wx.login({
                success: res => {
                    // 获取code
                    if (res.code) {
                        // 获取 openid
                        wx.request({
                            //获取openid接口  
                            url: 'https://api.weixin.qq.com/sns/jscode2session',
                            data: {
                                appid: 'wx7a72546f37bba487',
                                secret: '317dae4737a4df3d7db6d1a9bf8a9f23',
                                js_code: res.code,
                                grant_type: 'authorization_code'
                            },
                            method: 'GET',
                            success: res => {
                                getApp().data.userInfo.openid = res.data.openid

                                // 将用户信息传入后台
                                wx.request({
                                    url: 'http://www.zongdusir.top/setUser',
                                    method: 'get',
                                    data: {
                                        openId: res.data.openid,
                                        userInfo: getApp().data.userInfo
                                    },
                                    success: res => {
                                        console.log(res)
                                        this.setData({
                                            isShow: !res.data
                                        })
                                        this.setData(getApp().data)
                                    }
                                })
                                
                            }
                        })
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            });
        }
    }
})