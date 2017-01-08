
/**
 * 路由的总配置
 * */
var router = require('koa-router')();
import users from './users'
import articles from './articles'

router.use('/users', users.routes());
router.use('/articles', articles.routes());

module.exports = router;
