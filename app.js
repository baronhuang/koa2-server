const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')({formLimit: '10mb'});
const logger = require('koa-logger');
const koaStatic = require('koa-static');
const session = require('koa-session2').default;


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
global.localUrl = 'http://localhost:3000/';

const routes = require('./routes');

app.use(session({
  maxAge: 1000000000
}));

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
// app.use(convert(logger()));
/*静态目录*/
app.use(convert(koaStatic(__dirname + '/public')));
app.use(convert(koaStatic(__dirname + '/uploads')));

app.use(convert(views(__dirname + '/views', {
  extension: 'jade'
})));

app.use(resFormate());

// logger
app.use(async (ctx, next) => {
  ctx.session.user = {"phone":"13143751187","password":"123","name":"ben","_id":"5EEUeuyeCcnwF0B5"};
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
  console.error(err)
  // logger.error('server error', err, ctx);
});


module.exports = app;