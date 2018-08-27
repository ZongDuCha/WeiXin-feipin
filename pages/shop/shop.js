// pages/shop/shop.js
var store = []; // 存放上传成功图片路径
function unFile(f, s, m, n, u, p, d, callback) {
    // 店铺封面             f
    // 店铺图片             s
    // 地址                 m
    // 店铺联系人           n
    // 联系电话             p
    // 店铺描述             d
    // 店铺名字             u
    var i = s.i ? s.i : 0, // 当前上传的张数
        suc = s.suc ? s.suc : 0, // 上传成功的张数
        err = s.err ? s.err : 0; // 上传失败的张数
    var userInfo = JSON.stringify(getApp().data.userInfo)

    wx.uploadFile({
        url: 'http://www.zongdusir.top/shopList',
        filePath: s[i],
        name: 'file',
        formData: {
            userInfo,
            'imgLength': s.length,
            f, s, m: JSON.stringify(m), n, p, d, u
        },
        success: res => {
            if (!!res) {
                suc++;
                store.push(res)
            }
        },
        fail: res => {
            if (!!res) {
                this.setData({
                    isShow: 'true',
                    mesTx: '上传失败1....'
                })

                setTimeout(() => {
                    this.setData({
                        isShow: false,
                    })
                }, 2000)
            }
            if (!!res) err++;
            //console.log('上传图片失败')
        },
        complete: res => {
            if (!!res) i++;
            if (i == s.length) {   //当图片传完时，停止调用          
                //console.log('执行完毕 , 成功：' + suc + " 失败：" + err);
                callback(store)
            } else {//若图片还没有传完，则继续调用函数
                s.i = i;
                s.suc = suc;
                s.err = err;
                unFile(f, s, m, n, p, u, d, callback);
            }
        }
    })
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        fm: '../../img/fengmian.png', // 店铺封面
        shopImg: [], // 店铺图片
        map: '', // 地址
        user: '', // 联系人
        phone: '', // 联系电话
        docTx: '', // 店铺描述
        isShow: '', // 显示弹窗
        mesTx: '', // 弹窗内容
        name: '', // 店铺名字
        isSuc: false, // 成功弹窗
        isEdit: false,
        cacheFm: '', // 缓存封面
        cacheImg: '',
        ToggleShow: true // 控制按钮显示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id || undefined;
        if(!!id && JSON.stringify(id) != '{}'){
            wx:wx.request({
                url: 'http://www.zongdusir.top/getUserInfo',
                data: { id },
                method: 'GET',
                success: res => {
                    this.setData({
                        ToggleShow: res.data[0].openId == getApp().data.userInfo.openid
                    })
                }
            })
        }

        let mise = new Promise((resolve, rej) => { // 获取code
            wx.login({
                success: res => {
                    if (res.code) {
                        resolve(res.code)
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            });
        })

        mise.then(value => {// 获取 openid
            return new Promise( rev => {
                    wx.request({
                        //获取openid接口  
                        url: 'https://api.weixin.qq.com/sns/jscode2session',
                        data: {
                            appid: 'wx7a72546f37bba487',
                            secret: '317dae4737a4df3d7db6d1a9bf8a9f23',
                            js_code: value,
                            grant_type: 'authorization_code'
                        },
                        method: 'GET',
                        success: res => {
                            rev(res.data.openid )
                        }
                    })
            })
        }).then(value => { // 判断用户
            wx.request({
                url: 'http://www.zongdusir.top/getShop',
                method: 'get',
                data: {
                    openId: id || value,
                },
                success: res => {
                    // fm: '../../img/fengmian.png', // 店铺封面
                    // shopImg: [], // 店铺图片
                    // map: '', // 地址
                    // user: '', // 联系人
                    // phone: '', // 联系电话
                    // docTx: '', // 店铺描述   
                    // name: '', // 店铺名字
                    if ( !!res.data.length){
                            var RD = res.data[0]
                            this.setData({
                                isEdit: true,
                                fm: RD.shopImg,
                                shopImg: RD.shopTions.split(','),
                                map: RD.shopMap,
                                user: RD.shopUser,
                                phone: RD.shopPhone,
                                docTx: RD.shopTx,
                                name: RD.shopName,
                                cacheFm: RD.shopImg,
                                cacheImg: RD.shopTions.split(',')
                            })
                    }
                }
            })
        })

    },
    getMap() { // 选择地址
        if (this.data.isEdit) {
            return false;
        }
        wx.chooseLocation({
            success: res => {
                this.setData({
                    map: res
                })
            }
        })
    },
    fm() {
        if (this.data.isEdit) {
            return false;
        }
        wx.chooseImage({ // 选择封面图片
            count: 1,
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: res => {
                this.setData({
                    fm: res.tempFilePaths
                })
            },
            fail: res => {
                console.log(res)
                // fail
            }
        })
    },
    edit() { // 点击编辑
        this.setData({
            isEdit: false
        })
    },
    shopImg() { // 选择店铺照片
        if (this.data.isEdit) {
            return false;
        }
        wx.chooseImage({
            count: 6,
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: res => {
                this.setData({
                    shopImg: res.tempFilePaths
                })
            },
            fail: res => {
                console.log(res)
                // fail
            }
        })
    },
    Name(e) {
        this.setData({
            name: e.detail.value
        })
    },
    User(e) {
        this.setData({
            user: e.detail.value
        })
    },
    phone(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    docTx(e) {
        this.setData({
            docTx: e.detail.value
        })
    },
    delImg(e) { // 删除图片
        var src = e.currentTarget.dataset.src
        if (!!src) {
            var sp = this.data.shopImg.indexOf(src)
            this.data.shopImg.splice(sp, 1)

            this.setData(this.data)
        }
        return false;
    },
    back() { // 返回
        wx.switchTab({
            url: '../index/index'
        });
    },
    seePro() { // 
        wx.navigateTo({
            url: './shop'
        })
    },
    push() { // 发布店铺
        let f = this.data.fm  // 店铺封面
        let s = this.data.shopImg  // 店铺图片
        let m = this.data.map  // 地址
        let u = this.data.user  // 店铺联系人
        let n = this.data.name  // 店铺名字
        let p = this.data.phone  // 联系电话
        let d = this.data.docTx  // 店铺描述
        // 店铺封面             f
        // 店铺图片             s
        // 地址                 m
        // 店铺联系人           u
        // 联系电话             p
        // 店铺描述             d
        // 店铺名字             n

        // if (f == '../../img/fengmian.png') { // 封面
        //     this.setData({
        //         isShow: 'true',
        //         mesTx: '请上传封面！！'
        //     })

        //     setTimeout(() => {
        //         this.setData({
        //             isShow: false
        //         })
        //     }, 2000)
        //     return false;
        // }

        // if (!m) { // 选择地址
        //     this.setData({
        //         isShow: 'true',
        //         mesTx: '请填写地址！！'
        //     })

        //     setTimeout(() => {
        //         this.setData({
        //             isShow: false
        //         })
        //     }, 2000)
        //     return false;
        // }

        // if (!n) { // 联系人
        //     this.setData({
        //         isShow: 'true',
        //         mesTx: '请填写联系人！！'
        //     })

        //     setTimeout(() => {
        //         this.setData({
        //             isShow: false
        //         })
        //     }, 2000)
        //     return false;
        // }

        // if (!p) { // 联系电话
        //     this.setData({
        //         isShow: 'true',
        //         mesTx: '请填写联系人！！'
        //     })

        //     setTimeout(() => {
        //         this.setData({
        //             isShow: false
        //         })
        //     }, 2000)
        //     return false;
        // }

        // if (!n) { // 联系人
        //     this.setData({
        //         isShow: 'true',
        //         mesTx: '请填写联系人！！'
        //     })

        //     setTimeout(() => {
        //         this.setData({
        //             isShow: false
        //         })
        //     }, 2000)
        //     return false;
        // } cacheImg
        // 店铺封面             f
        // 店铺图片             s
        // 地址                 m
        // 店铺联系人           n
        // 联系电话             p
        // 店铺描述             d
        // 店铺名字             u
        this.setData({
            isShow: 'true',
            mesTx: '正在上传....'
        })
        wx.uploadFile({
            url: 'http://www.zongdusir.top/shopFm',
            filePath: Array.isArray(f) ? f[0]+[] : f+[],
            name: 'file',
            header: {}, 
            formData: {},
            success: res => {
                unFile(f = res.data, s, m, n, u, p, d, res => {
                    if (res[res.length - 1].data == '"ok"' || res[res.length - 1].data == 'ok') {
                        this.setData({
                            isShow: 'true',
                            mesTx: '上传成功....'
                        })

                        setTimeout(() => {
                            this.onLoad()
                            this.setData({
                                isEdit: true,
                                isShow: false,
                                f: '',
                                s: '',
                                m: '',
                                n: '',
                                u: '',
                                p: '',
                                d: ''
                            })
                        }, 2000)
                    }else{
                        this.setData({
                            isShow: 'false',
                            mesTx: '上传失败，请刷新页面重试'
                        })
                    }
                })
            },
            fail: res => {
                if (!!res.errMsg) {
                    this.setData({
                        isShow: 'true',
                        mesTx: '上传失败2....'
                    })

                    setTimeout(() => {
                        this.setData({
                            isShow: false,
                        })
                    }, 2000)
                }
            },
            complete: res => { },
        })

        // this.setData({
        //     isShow: 'true',
        //     mesTx: '上传失败3....'
        // })

        // setTimeout(() => {
        //     this.setData({
        //         isShow: false,
        //     })
        // }, 100000)
    },
    mesClose() { // 关闭

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})