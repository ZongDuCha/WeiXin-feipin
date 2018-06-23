// pages/start/start.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        proItem: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var t = !!(options.type - []) ? 'getUserStart' : 'getUserMe'
        wx.request({
            url: 'http://localhost:8082/'+t,
            data: {
                userInfo: JSON.stringify(getApp().data.userInfo)
            },
            method: 'GET',
            success: res => {
                res.data.forEach( (v, i) => {
                    res.data[i].img = res.data[i].img.split(',')
                })
                this.setData({
                    proItem: res.data
                })
            }
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