
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
.get('/', async (ctx, next) => {
    const {_id, phone, password, name} = ctx.query;
    const user = await new User().findOne({phone, password}, {password: 0});
    if(user){
        ctx.body = {data: user};
    }else{
        ctx.body = { statusCode: 500, msg: '密码或账号不对'};
    }

})

/**
 * 新增
 * */
.post('/', async (ctx, next) => {
    const {name, phone, password} = ctx.request.body;
    console.log(33, name, phone, password);
    if(name && phone && password){
        if(!(/^1[34578]\d{9}$/.test(phone))){
            ctx.body = { statusCode: 500, msg: '手机格式不对'};
            return;
        }else{
            const user = new User({name, phone, password});
            const unique = await user.findOne({phone});
            if(unique){
                ctx.body = { statusCode: 500, msg: '手机号已注册'};
                return;
            }

            const result = await user.insert();
            delete result.password;
            ctx.body = {data: result};
        }
    }else{
        ctx.body = { statusCode: 500, msg: '请输入完整信息'};
    }

})
;

export default router
