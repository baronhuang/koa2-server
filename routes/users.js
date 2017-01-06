
/**
 * users路由
 * */
import koaRouter from 'koa-router'
import User from '../models/User'
const router = koaRouter();

router
/**
 *  获取单个用户信息
 * */
.get('/:_id', async (ctx, next) => {
    const {_id} = ctx.params;
    const user = await new User({_id}).findOne();
    ctx.body = {data: user};
})

/**
 * 新增
 * */
.post('/', async (ctx, next) => {
    const {name, phone, password} = ctx.request.body;
    const user = new User();
    const result = await user.insert({name, phone, password});
    ctx.body = {data: result};
})
;

export default router
