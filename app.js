const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

/*------自定义middlewares------*/
const resFormate = require('./middlewares/res-formate');

const nedb = require('nedb');
const Promise = require("bluebird");

// 数据库配置
global.db = {};
global.db.users = new nedb({filename: __dirname + '/data/users.db', autoload: true, timestampData: true});
global.db.users.ensureIndex({ fieldName: 'phone', unique: true }, function (err) {});
global.db.articles = new nedb({filename: __dirname + '/data/articles.db', autoload: true, timestampData: true});
Promise.promisifyAll(global.db.users);
Promise.promisifyAll(global.db.articles);


const routes = require('./routes');
// const users = require('./routes/users');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
// app.use(convert(logger()));
app.use(convert(require('koa-static')(__dirname + '/public')));

app.use(convert(views(__dirname + '/views', {
  extension: 'jade'
})));

app.use(resFormate());

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/api', routes.routes(), routes.allowedMethods());
// router.use('/users', users.routes(), users.allowedMethods());
app.use(router.routes(), router.allowedMethods());
// response


/*catch errors*/
app.on('error', function(err, ctx){
  ctx.body = err;
  ctx.res.statusCode = 500;
  ctx.res.end(`${err.stack}`);
  console.log(err)
  logger.error('server error', err, ctx);
});


module.exports = app;