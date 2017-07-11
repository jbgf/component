const path = require('path')
const url = require('url')
const chalk = require('chalk')
const request = require('request')
const express = require('express')
const cons = require('consolidate')
const config = require('./config')
const app = express()
const routes = require('./routes')
const router = express.Router()

var viewPath = path.join(__dirname, 'views');

app.engine('html', cons.swig);
app.set('views', viewPath);
app.set('view engine', 'html');


// 静态资源
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', router);

app.use(function (err, req, res, next) {
    err.status = err.status || 500
    res.status(err.status)
    res.send(err.message)
})

// 路由
routes(app);

if (module.parent) {
    module.exports = app;
}else{
    const port = config.port || 3000
    app.listen(port)
}