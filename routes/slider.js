/**
 * Created by Administrator on 2017/6/29.
 */
var express = require('express');
var router = express.Router();

// GET /posts/create 发表文章页
router.get('/slider', function(req, res, next) {

    res.render('slider');
});
module.exports = router;