// pages/user/user.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        isShow: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let userInfo = getApp().data.userInfo,
            t;
        this.setData({
            userInfo: getApp().data.userInfo,
            isShow: !getApp().data.userInfo.nickName
        })
        t = setInterval(() => {
            if (!!userInfo) {
                clearInterval(t)
            } else {
                this.setData({
                    userInfo: getApp().data.userInfo,
                    isShow: !getApp().data.userInfo.nickName
                })
            }
        }, 1500)
    },
    toStart(){
        wx.navigateTo({
            url: '../start/start'
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