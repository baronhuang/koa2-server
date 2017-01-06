
/**
 * 路由的总配置
 * */
var router = require('koa-router')();
import users from './users'

router.use('/users', users.routes());

module.exports = router;
