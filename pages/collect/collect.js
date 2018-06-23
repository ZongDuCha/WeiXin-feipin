// pages/collect/collect.js
var QQMapWX = require('../jdk/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
    key: 'JLPBZ-MY3CP-6OPDE-VAVVS-YD4G6-MLBLM' // 必填
});
var qqmapsdk;

function getLoca(){
    return new Promise( (rev,rej) => {
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

    /**
     * 页面的初始数据
     */
    data: {
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
    listenSwiper(e) {
    },
    classToggle(e) { // 切换tab
        this.setData({
            classItem: e.currentTarget.dataset.class
        })
        this.data.classItem == 1 ? this.juli() : this.shop()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        this.juli()

        setTimeout( () => {
            this.shop()
        },100)
    },
    shop() { // 附近店铺数据
        this.setData({
            load: '获取数据中.'
        })

        getLoca().then( res => {
            const lat = res.result.location.lat
            const lng = res.result.location.lng
            this.setData({
                currentLoca: res.result.address_component.district
            })

            wx.request({
                url: 'http://localhost:8082/getShopJin',
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
                    this.data.listShop++
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
                url: 'http://localhost:8082/getColl',
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
        }).catch( rej => {
        })
       
    },
    slide(e) { // 打开全屏图片
        this.setData({
            slide: e.currentTarget.dataset.img
        })
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

    /**
     * 页面上拉触底事件的处理函数
     */
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})