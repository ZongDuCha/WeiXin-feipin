var express = require('express'),
    router = express.Router(),
    {
        sel,
        add,
        update,
        del
    } = require('./mysql'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    fs = require('fs'),
    path = require('path')

/**
 * sel(sql,() => {...})
 * 
 * add('INSERT INTO blog SET  ?',{...},() => {...})
 * 
 * 需要改变的值                                 条件值
 * update('UPDATE blog SET username="123" where password="qwe"',() => {...})
 * 
 * del(sql,obj,() => {...})
 */

// 以上为入门实例 ******************************************************

function getOpenId(userInfo){ // 根据userInfo信息查询openId
    const sql = `select * from user where userInfo = '${userInfo}'`
    let mise = new Promise( (res, rej) => {
        sel(sql, (e, r) => {
            !!r.length ? res(r[0].openId) : rej(e)
        })
    })
    return mise;
}


router.get('/setUser', (q, s, n) => { // 保存用户信息
    openId = q.query.openId;
    let userInfo = q.query.userInfo;

    let sql = `select * from user where openId='${openId}'`
    sel(sql, (e, r) => {
        if (!e && !r.length) {
            console.log('未查询到此用户，正在保存...')

            // 用户openid不存在则添加
            let addSql = `INSERT INTO user SET ?`
            add(addSql, {
                openId,
                userInfo
            }, (e, r) => {
                console.log(r)
                !e ? s.json(true) : s.json(false);
            })
        } else {
            console.log('查询一条，正在更新基本信息...')

            // 用户openid存在， 更新基本信息
            let upSql = `UPDATE user SET userInfo='${userInfo}' where openId='${openId}'`
            update(upSql, (e, r) => {
                !e ? s.json(true) : s.json(false);
            })
        }
    })
})


let imgPath = [] // 存放多张图片路径
router.post('/setPro', multipartMiddleware, (q, s) => { // 下单上传 ， 保存图片

    var url = 'http://www.zongdusir.top/proImg/' + q.files.file.path.split('\\')[2]
    imgPath.push(url)
    let l = q.body.imgLength
    if (imgPath.length == l) {
        /**
         * v 手机号码
         * 
         * d 描述
         * 
         * p 详细地址
         * 
         * r 地区
         */
        imgPath = imgPath.toString()
        let userInfo = q.body.userInfo
        let phone = q.body.v
        let name = q.body.n
        let map = q.body.p
        let docText = q.body.d
        let region = q.body.r
        let lat = q.body.lat
        let lng = q.body.lng
        let creatTime = new Date()
            let addSql = `INSERT INTO proInfo SET ?`
            add(addSql, {
                openId: JSON.parse(userInfo).openid,
                userInfo,
                img: imgPath,
                map,
                phone,
                name,
                region,
                docText,
                creatTime,
                lat,
                lng
            }, (e, r) => {
                imgPath = [];
                !e ? s.json(r.insertId) : '';
            })
    } else {
        s.json(url)
    }
})

router.get('/starToggle', (q, s) => { // 取反收藏操作
    var s = q.query.st
    var id = q.query.id
    let upSql = `UPDATE proInfo SET star='${s}' where id='${id}'`
    update(upSql, (e, r) => {
        //!e ? s.json(true) : s.json(false);
    })
})

router.get('/getPro', (q, s) => { // 获取基本信息
    let id = q.query.id
    let sql = `select * from proInfo where id=${id}`
    sel(sql, (e, r) => {
        !e ? s.json(r[0]) : ''
    })
})



router.get('/getColl', (q, s) => { // 列表中返回距离排序
	console.log(1);
    let lat = q.query.lat
    let lng = q.query.lng
    let list = 7 // 固定显示的条目
    let page = q.query.page // 页数

    let sql = `SELECT
                *,
                ROUND(
                    6378.138 * 2 * ASIN(
                        SQRT(
                            POW(
                                SIN(
                                    (
                                        ${lat} * PI() / 180 - lat * PI() / 180
                                    ) / 2
                                ),
                                2
                            ) + COS(${lat} * PI() / 180) * COS(lat * PI() / 180) * POW(
                                SIN(
                                    (
                                        ${lng} * PI() / 180 - lng * PI() / 180
                                    ) / 2
                                ),
                                2
                            )
                        )
                    ) * 1000
                ) AS juli
            FROM
                proinfo
            ORDER BY
                juli ASC limit ${page}, ${list}`

    sel(sql, (e, r) => {
        s.json(r)
    })
})


router.post('/shopFm', multipartMiddleware, (q, s) => { // 返回店铺封面url
    var url = 'http://www.zongdusir.top/proImg/' + q.files.file.path.split('\\')[2]
    s.send(url)
})


var shop = []

router.post('/shopList',multipartMiddleware, (q, s) => { // 发布店铺
    var url = 'http://www.zongdusir.top/proImg/' + q.files.file.path.split('\\')[2]
    if(Array.isArray(shop)){
        shop.push(url)
    }else{
        shop=[]
    }
    let l = q.body.imgLength
    if (shop.length == l) {
        let userInfo = q.body.userInfo
        
        shop = shop.toString()
        // 店铺封面             f
        // 店铺图片             s
        // 地址                 m
        // 店铺联系人           u
        // 联系电话             p
        // 店铺描述             d
        // 店铺名字             n

        let shopImg = q.body.f
        let shopName = q.body.n
        let shopUser = q.body.u
        let shopTions = shop
        let shopMap = JSON.parse(q.body.m).address || JSON.parse(q.body.m)
        let shopTx = q.body.d
        let shopPhone = q.body.p
        let shopLat = JSON.parse(q.body.m).latitude
        let stopLng = JSON.parse(q.body.m).longitude
        let creatShop = new Date()


        let openId = JSON.parse(userInfo).openid
        const sql = `select * from shoplist where openId='${openId}'`
        sel(sql, (e,r ) => {
            if(!!r.length){ // 存在删除图片
                var allImg = (r[0].shopImg + ',' + r[0].shopTions ).split(',')
                for(let i in allImg){
                    fs.unlink('../' + allImg[i],function(e,r){
                    })
                }
                
                let upSql = `UPDATE shoplist SET 
                userInfo='${userInfo}',
                shopImg='${shopImg}',
                shopTions='${shopTions}',
                shopName='${shopName}',
                shopUser='${shopUser}',
                shopMap='${shopMap}',
                shopTx='${shopTx}',
                shopLat='${shopLat}',
                stopLng='${stopLng}',
                creatShop='${creatShop}'
                where openId='${openId}'`
                update(upSql, (e, r) => {
                    shop = [];
                    !e ? s.json('ok') : s.json('err');
                })
            }else{
                    let addSql = `INSERT INTO shoplist SET ?`
                    add(addSql, {
                        openId: openId,
                        userInfo,
                        shopImg,
                        shopTions,
                        shopName,
                        shopUser,
                        shopMap,
                        shopTx,
                        shopPhone,
                        shopLat,
                        stopLng,
                        creatShop
                    }, (e, r) => {
                        shop = [];
                        !e ? s.send('ok') : s.send('err');
                    })
            }
        })
    } else {
        s.json(url)
    }
})

router.get('/getShop', (q,s ) => { // 判断是否有数据
    let openId = q.query.openId
    let sql = `select * from shoplist where openId='${openId}' or id='${openId}'`

    sel(sql, (e, r) => {
        !!r.length ? r[0].openId = '' : ''
        !e ? s.json(r) : s.json(e)
    })
})

router.get('/getUserInfo', (q, s) => { // 根据店铺id，查询用户信息
    let id = q.query.id;
    let sql = `select * from shoplist where id='${id}'`

    sel(sql, (e, r) => {
        !e ? s.json(r) : s.json(e)
    })
})


router.get('/getShopJin', (q, s) => { // 列表中返回附近店铺的排序
    let lat = q.query.lat
    let lng = q.query.lng

    let list = 7 // 固定显示的条目
    let page = q.query.page // 页数

    let sql = `SELECT
                *,
                ROUND(
                    6378.138 * 2 * ASIN(
                        SQRT(
                            POW(
                                SIN(
                                    (
                                        ${lat} * PI() / 180 - shopLat * PI() / 180
                                    ) / 2
                                ),
                                2
                            ) + COS(${lat} * PI() / 180) * COS(shopLat * PI() / 180) * POW(
                                SIN(
                                    (
                                        ${lng} * PI() / 180 - stopLng * PI() / 180
                                    ) / 2
                                ),
                                2
                            )
                        )
                    ) * 1000
                ) AS juli
            FROM
                shoplist
            ORDER BY    
                juli ASC limit ${page}, ${list}`

    sel(sql, (e, r) => {
        !! r.length ? s.json(r) : s.json(e)
    })
})



router.get('/getUserMe', (q, s) => {
    let openid = JSON.parse(q.query.userInfo).openid
    const sql = `select * from proinfo where openId='${openid}'`
    sel(sql, (e, r) => {
        !e ? s.json(r) : s.json(e)
    })
})

router.get('/getUserStart', (q, s) => { //  获取有收藏的单
    let openid = JSON.parse(q.query.userInfo).openid,
        proItem = [];
    const sql = `select * from proinfo`
    sel(sql, (e, r) => {
        r.forEach( (v, i) => {
            r[i].star = !!r[i].star ? r[i].star.split(',') : ''
            if( !!(r[i].star+[]) ){
                r[i].star.forEach( (el, j) => {
                    if(el == openid){
                        proItem.push(r[i])
                    }
                })
            }
        });
        s.send(proItem)
    })
})






module.exports = router;