//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../jdk/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
    key: 'JLPBZ-MY3CP-6OPDE-VAVVS-YD4G6-MLBLM' // 必填
});
var qqmapsdk;

Page({
    data: {
        index_map: '获取地址失败,点击重试...',
        isShow: true
    },
    listenSwiper: function (e) {
        // 轮播
        //   console.log(e.detail.current)
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
    // 跳转
    toShop() {
        wx.navigateTo({
            url: '../shop/shop'
        })
    },
    toCollect() {
        wx.switchTab({
            url: '../collect/collect'
        })
    },
    toRelease() {
        wx.navigateTo({
            url: '../release/release'
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
    }
})
