// pages/proInfo/proInfo.js
function formtime(data){
    var data = new Date(data);
    var time = new Date().getTime() - data.getTime()
    if (time < 0) {
        return ''
    } else if ((time / 1000 < 30)) {
        return '刚刚'
    } else if (time / 1000 < 60) {
        return parseInt((time / 1000)) + '秒前'
    } else if ((time / 60000) < 60) {
        return parseInt((time / 60000)) + '分钟前'
    } else if ((time / 3600000) < 24) {
        return parseInt(time / 3600000) + '小时前'
    } else if ((time / 86400000) < 31) {
        return parseInt(time / 86400000) + '天前'
    } else if ((time / 2592000000) < 12) {
        return parseInt(time / 2592000000) + '月前'
    } else {
        return parseInt(time / 31536000000) + '年前'
    }
}


Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 城市数据源
        region: [],
        proImg: '', // 上传图片,
        phone: '', // 联系电话
        name: '', // 姓名
        docText: '', // 描述废品，同时也是标题
        map: '', // 详细地址
        ProData: {},
        slide:[], // slide组件
        starUser: [] // 保存收藏用户
    },
    slide() { // 打开全屏图片组件
        this.setData({
            slide: this.data.ProData.img
        })
    },
    phoneCall(){ // 拨打电话
        wx.makePhoneCall({
            phoneNumber: this.data.ProData.phone
        })
    },
    back() { // 返回
        wx.navigateBack({
            delta: 1
        })
    },
    starToggle() { // 取反点赞
        this.data.ProData.star = !this.data.ProData.star
        this.setData(this.data)

        setTimeout( () => {
            var n = getApp().data.userInfo.openid
            let st = this.data.starUser

            if ((JSON.stringify(st) != '[]') && (st.indexOf(n) >= 0)) {
                st.splice(st.indexOf(n), 1)
            } else {
                st.push(n)
            }
            st = st.toString()
            wx.request({
                url: 'http://localhost:8082/starToggle',
                data: {
                    st,
                    id: this.data.ProData.id
                },
                success: res => {
                }
            })
        },100)

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (option) {
        var id = option.id || 55
        this.setData({
            starUser: []
        })

        wx.request({
            url: 'http://localhost:8082/getPro',
            data: {
                id
            },
            success: res => {
                var ProData = res.data;
                ProData.img = ProData.img.split(',')
                
                console.log(ProData.userInfo)
                ProData.userUrl = JSON.parse(ProData.userInfo).avatarUrl
                ProData.userName = JSON.parse(ProData.userInfo).nickName
                ProData.creatTime = ProData.creatTime.substr(0,19)
                ProData.dff = formtime(ProData.creatTime)

                // 收藏
                if (!!ProData.star){
                    var s = this.data.starUser = (ProData.star + []).split(',')
                    ProData.star = s.some( v => {
                        return v == getApp().data.userInfo.openid
                    })
                }else{
                    ProData.star = false
                }
                
                this.setData({ProData})
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