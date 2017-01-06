
/**
 * users路由
 * */
import koaRouter from 'koa-router'
const router = koaRouter();

/*获取用户*/
router.get('/', async (ctx, next) => {

  const user = await global.db.findOneAsync({
    name: 'tom'
  });

  ctx.body = user;

});

router.post('/', async (ctx, next) => {

});

export default router
