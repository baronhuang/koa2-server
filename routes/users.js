
/**
 * users路由
 * */
import koaRouter from 'koa-router'
import User from '../models/User'
import koaBody from 'koa-body'
import utils from '../utils'

const router = koaRouter();

router

    /**
     *  获取登录用户的信息
     * */
    .get('/my', async (ctx, next) => {
        if(ctx.session.user){
            const {_id} = ctx.session.user;
            const user = await new User().findOne({_id}, {password: 0});
            if(user){
                ctx.body = {data: user};
            }else{
                ctx.body = { statusCode: 301, msg: '请先登录'};
            }
        }else{
            ctx.body = { statusCode: 301, msg: '请先登录'};
        }

    })

    /**
     *  登录
     * */
    .get('/signin', async (ctx, next) => {
        const {phone, password} = ctx.query;
        const user = await new User().findOne({phone, password}, {password: 0});
        console.log(222, user)
        if(user){
            ctx.session.user = user;
            ctx.body = {data: user};
        }else{
            ctx.body = { statusCode: 500, msg: '密码或账号不对'};
        }
    })

    /**
     * 新增
     * */
    .post('/signup', async (ctx, next) => {
        const {name, phone, password} = ctx.request.body;
        console.log(33, name, phone, password);
        if(name && phone && password){
            if(!(/^1[34578]\d{9}$/.test(phone))){
                ctx.body = { statusCode: 500, msg: '手机格式不对'};
                return;
            }else{
                const avatar = `${global.localUrl}images/avatar.jpg`;
                const user = new User({name, phone, password, avatar});
                const unique = await user.findOne({phone});
                if(unique){
                    ctx.body = { statusCode: 500, msg: '手机号已注册'};
                    return;
                }

                const result = await user.insert();
                delete result.password;
                ctx.session.user = result;
                ctx.body = {data: result};
            }
        }else{
            ctx.body = { statusCode: 500, msg: '请输入完整信息'};
        }
    })

    /**
     * 更新
     * */
    .put('/', async (ctx, next) => {
        const {_id, name} = ctx.request.body;
        const user = await new User().update({_id}, {name});
        if(user){
            ctx.body = {data: user};
        }else{
            ctx.body = {statusCode: 500, msg: '更新失败'};
        }
    })

    /**
     * 上传头像
     * */
    .post('/avatar', koaBody({multipart:true}), async (ctx, next) => {
        const {_id} = ctx.session.user;
        if(_id){
            try {
                const filePath = `users/${_id}`;
                const data = await utils.uploadImages(ctx, filePath);
                await new User().update({_id}, {avatar: data.url});
                const user = await new User().findOne({_id}, {password: 0});
                ctx.body = {data: user};

            }catch (e){
                ctx.body = { statusCode: 500, msg: e.stack};
            }
        }else{
            ctx.body = { statusCode: 500, msg: '请输入用户ID'};
        }

    })
;



export default router
