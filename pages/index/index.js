//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../jdk/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
    key: 'JLPBZ-MY3CP-6OPDE-VAVVS-YD4G6-MLBLM' // 必填
});
// 获取地址
function getLoca() {
    return new Promise((rev, rej) => {
        wx.getLocation({
            success: res => {
                if (JSON.stringify(res) == '{}') return false;
                var latitude = res.latitude;
                var longitude = res.longitude;

                demo.reverseGeocoder({
                    location: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    success: res => {
                        rev(res)
                    }

                })

            }
        })
    })
}
Page({
    data: {
        index_map: '获取地址失败,点击重试...',
        isShow: true,
        proItem: [],
        classItem: 1, // 切换显示class
        currentLoca: '',
        slide: [],
        // 距离
        page: 0,
        list: 0,
        shopItem: [],
        // 附近
        pageShop: 0,
        listShop: 0,
        shopJin: [],
        load: '获取数据中.',
        isShow: true
    },
    classToggle(e) { // 切换tab
        this.setData({
            classItem: e.currentTarget.dataset.class
        })
        this.data.classItem == 1 ? this.juli() : this.shop()
    },
    getMap: function () {
        this.data.index_map = '正在获取...'
        this.setData(this.data)
        // 获取地址
        wx.getLocation({
            success: res => {
                if (JSON.stringify(res) == '{}') return false;
                var latitude = res.latitude;
                var longitude = res.longitude;

                demo.reverseGeocoder({
                    location: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    success: res => {
                        this.data.index_map = res.result.address;
                        this.setData(this.data)
                    },
                    fail: res => {
                        this.data.index_map = '获取地址失败,点击重试...';
                        this.setData(this.data)
                    }
                })
            }
        })
    },
    shop() { // 附近店铺数据
        this.setData({
            load: '获取数据中.'
        })
        getLoca().then(res => {
            const lat = res.result.location.lat
            const lng = res.result.location.lng
            this.setData({
                currentLoca: res.result.address_component.district
            })
            wx.request({
                url: 'https://www.zongdusir.top/getShopJin',
                data: {
                    lat, lng, page: this.data.pageShop
                },
                success: res => {
                    if (res.data + [] == this.data.shopJin + [] || !res.data) {
                        this.setData({
                            load: '已经到底了.'
                        })
                        return false;
                    }
                    this.data.listShop++;
                    this.setData({
                        shopJin: this.data.shopJin.concat(res.data),
                        load: '已经到底了.'
                    })
                }
            })
        })
    },
    juli() { // 获取距离最近的数据
        this.setData({
            load: '获取数据中.'
        })

        getLoca().then(res => {
            const lat = res.result.location.lat
            const lng = res.result.location.lng
            this.setData({
                currentLoca: res.result.address_component.district
            })
            wx.request({ // 获取数据
                url: 'https://www.zongdusir.top/getColl',
                data: {
                    lat, lng, page: this.data.page
                },
                success: res => {

                    if (res.data + [] == this.data.proItem + []) {
                        this.setData({
                            load: '已经到底了.'
                        })
                        return false;
                    }

                    res.data.forEach((v, i) => {
                        res.data[i].img = res.data[i].img.split(',')
                    })

                    this.data.list++
                    this.setData({
                        proItem: this.data.proItem.concat(res.data),
                        load: '已经到底了.'
                    })

                }
            })
        }).catch(rej => {
        })

    },
    toCollect() {
        wx.switchTab({
            url: '../collect/collect'
        })
    },
    slide(e) { // 打开全屏图片
        this.setData({
            slide: e.currentTarget.dataset.img
        })
    },
    onLoad: function () {
        let userInfo = getApp().data.userInfo
        var t = setInterval(() => {
            if (!!userInfo) {
                clearInterval(t)
            } else {
                this.setData({
                    isShow: !getApp().data.userInfo.nickName
                })
            }
        }, 1500)
        this.getMap()
        this.juli()
        setTimeout(() => {
            this.shop()
        }, 100)
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        setTimeout(() => {
            if (this.data.classItem == 1) {
                this.setData({
                    page: 0,
                    list: 0
                })
                this.juli()
            } else {
                this.setData({
                    pageShop: 0,
                    listShop: 0
                })
                this.shop()
            }
        }, 300)
    },
    onReachBottom: function () {

        setTimeout(() => {
            if (this.data.classItem == 1) {
                this.data.page = this.data.list * 7
                this.setData(this.data.page)
                this.juli()
            } else {
                this.data.pageShop = this.data.listShop * 7
                this.setData(this.data.pageShop)
                this.shop()
            }

        }, 300)
    },
})
