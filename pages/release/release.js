// pages/release/release.js
var QQMapWX = require('../jdk/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
    key: 'JLPBZ-MY3CP-6OPDE-VAVVS-YD4G6-MLBLM' // 必填
});
var qqmapsdk;
var store = []; // 存放上传成功图片路径

function unFile(m, v, d, p, r, n, lat, lng, callback){
    /**
     * m 图片临时地址
     * 
     * v 手机号码
     * 
     * d 描述
     * 
     * p 详细地址
     * 
     * r 地区
     */
    // console.log('开始上传...')
    var i = m.i ? m.i : 0, // 当前上传的张数
        suc = m.suc ? m.suc : 0, // 上传成功的张数
        err = m.err ? m.err : 0; // 上传失败的张数
    var userInfo = JSON.stringify(getApp().data.userInfo);

    wx.uploadFile({
        url: 'http://localhost:8082/setPro', 
        filePath: m[i],
        name: 'file',
        formData: {
            userInfo,
            'imgLength': m.length,
            v, d, p, r: r.join(','), n, lat, lng
        },
        success: res => {
            if (!!res){
                suc++;
                store.push(res)
            } 
        },
        fail: res => {
            if (!!res) err++;
            //console.log('上传图片失败')
        }, 
        complete: res => {
            if(!!res)i++;
            if (i == m.length) {   //当图片传完时，停止调用          
                //console.log('执行完毕 , 成功：' + suc + " 失败：" + err);
                callback(store)
            } else {//若图片还没有传完，则继续调用函数
                m.i = i;
                m.suc = suc;
                m.err = err;
                unFile(m, v, d, p, r, n, lat, lng, callback);
            }
        }
    })
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 控制成功后弹出遮罩
        isSuc: false,
        
        // 城市数据源
        region: [],
        customItem: '',
        addImg: '', // 上传图片,
        phone: '', // 联系电话
        name: '', // 姓名
        docText: '', // 描述废品，同时也是标题
        map: '', // 详细地址
        // 弹窗数据源
        isShow: false,
        mesTx: '',
        // 返回成功后的查看id
        proId: '',
        lat: '', // 纬度
        lng: '' // 经度
    },
    setValue(e) { // 联系电话
        const t = e.currentTarget.dataset.type
        const v = e.detail.value

        t == 0 ? this.data.map = v : ''
        t == 1 ? this.data.phone = v : ''
        t == 2 ? this.data.name = v : ''
        t == 2 ? this.data.docText = v : ''

        this.setData(this.data)
    },
    mesClose() {// 关闭弹窗
        this.setData({
            isShow: false
        })
    },
    back() { //返回主页
        wx.switchTab({
            url: '../index/index'
        });
    },
    seePro() { // 跳转至成功的下单页
        wx.redirectTo({
            url: '../proInfo/proInfo?id=' + this.data.proId
        })
    },
    push() { // 发布
        let v = this.data.phone

        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(v)) { // 判断手机
            this.setData({
                isShow: 'true',
                mesTx: '请正确填写手机号!'
            })

            setTimeout(() => {
                this.setData({
                    isShow: false
                })
            }, 2000)
            return false;
        }
        
        let m = this.data.addImg
        if(!m.length){ // 判断图片
            this.setData({
                isShow: 'true',
                mesTx: '请选择图片！!'
            })

            setTimeout(() => {
                this.setData({
                    isShow: false
                })
            }, 2000)
            return false;
        }

        let d = this.data.docText
        if(!d.length){ // 判断描述
            this.setData({
                isShow: 'true',
                mesTx: '请填写废品描述！！'
            })

            setTimeout(() => {
                this.setData({
                    isShow: false
                })
            }, 2000)
            return false;
        }

        let p = this.data.map
        if(!p.length){
            this.setData({
                isShow: 'true',
                mesTx: '请填写详细地址！！'
            })

            setTimeout(() => {
                this.setData({
                    isShow: false
                })
            }, 2000)
            return false;
        }

        let r = this.data.region
        if(JSON.stringify(r) == '[]'){
            this.setData({
                isShow: 'true',
                mesTx: '请选择需要回收的地区！！'
            })

            setTimeout(() => {
                this.setData({
                    isShow: false
                })
            }, 2000)
            return false;
        }

        let n = this.data.name
        if(!p.length){
            this.setData({
                isShow: 'true',
                mesTx: '请填写详细地址！！'
            })

            setTimeout(() => {
                this.setData({
                    isShow: false
                })
            }, 2000)
            return false;
        }

        let lat = this.data.lat
        let lng = this.data.lng
        // m, v, d, p, r, n
        store = [];
        this.setData({
            isShow: 'true',
            mesTx: '正在上传中...'
        })
        unFile(m, v, d, p, r, n, lat, lng, callback => {
            if(!!callback.length){
                var i = Number(m.length - 1)
                if (!!callback[i].data){
                        // 关闭
                        this.setData({
                            isShow: 'true',
                            mesTx: '上传成功~!'
                        })
                        setTimeout( () => {
                            this.setData({
                                isShow: false,
                                isSuc: true,
                                proId: callback[i].data
                            })

                        },1000)
                }
            }

        })
        
        return false;
    },
    delImg(e) { // 删除图片
        var src = e.currentTarget.dataset.src
        if (!!src){
            var sp = this.data.addImg.indexOf(src)
            this.data.addImg.splice(sp,1)

            this.setData(this.data)
        }
        return false;
    }, 
    // 选择图片
    addImg(e) {
        wx.chooseImage({
            count: 6,
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: res => {
                this.data.addImg = res.tempFilePaths
                this.setData(this.data)
                // 获取成功,将获取到的地址赋值给临时变量
                //var tempFilePaths = res.tempFilePaths;
                //that.setData({
                    //将临时变量赋值给已经在data中定义好的变量
                //    avatarUrl: tempFilePaths
                //})
            },
            fail: res => {
                console.log(res)
                // fail
            }
        })
    },
    // 城市选择
    bindRegionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
    },
    // 获取地区
    getMap() {
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
                        this.data.region[0] = res.result.address_component.province
                        this.data.region[1] = res.result.address_component.city
                        this.data.region[2] = res.result.address_component.district

                        this.data.lat = res.result.location.lat
                        this.data.lng = res.result.location.lng
                        this.data.map = res.result.address;
                        this.setData(this.data)
                    },
                    fail: res => {
                        this.data.map = '获取地址失败,点击重试...';
                        this.setData(this.data)
                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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