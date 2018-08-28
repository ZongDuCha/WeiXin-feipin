
var mysql = require('mysql')
//global.db.connect();
var db;

function handleDisconnect() {
    db = mysql.createConnection({
        host: 'localhost', // 连接服务器地址
        user: 'root',  // 连接用户名
        password: 'root', // 连接密码
        port: 3306, // 端口号
        database: 'feipin',// 数据库名称
        multipleStatements: true // 允许执行多条sql语句
    });
    db.connect(function (err) {
        if (err) {
            setTimeout(handleDisconnect, 2000);
        }
    });
    db.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
handleDisconnect();

// 查询记录
function sel(sel, callback) {
    db.query(sel, function (e, r, n) {
        if (e) {
            callback(e, null)
            return;
        }
        if (!r) {
            console.log('无该记录，，api-sel')
            callback(e, null)
        } else {
            callback(e, r, n)
        }
    })

}

// 将数据 插入数据库中
function add(sql, obj, callback) {
    db.query(sql, obj, function (e, r, n) {
        if (e) {
            console.log('添加失败，，api-isStay');
            callback(e, null);
            return false
        };
        callback(e, r, n);
    })
}

// 修改数据
function update(sql, obj, callback) {
    db.query(sql, obj, function (e, r, n) {
        if (e) {
            console.log('修改失败，，api-update')
            callback(e, null)
            return;
        } else {
            callback(e, r = true, n)
        }
    })
}


function del(sql, obj, callback) {
    db.query(sql, obj || '', function (e, r, n) {
        if (e) {
            console.log('删除失败，，api-del')
            callback(e, null)
            return;
        }
        callback(e, r, n)
    })
}

module.exports = {
    sel: sel,
    add: add,
    update: update,
    del: del
}