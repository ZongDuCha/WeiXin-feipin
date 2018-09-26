Page({
    // 跳转
    toShop() {
        wx.navigateTo({
            url: '../shop/shop'
        })
    },
    toRelease() {
        wx.navigateTo({
            url: '../release/release'
        })
    },
})