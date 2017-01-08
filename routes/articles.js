/**
 * Created by Administrator on 2017/1/8.
 */


/**
 * articles路由
 * */
import koaRouter from 'koa-router'
import Article from '../models/Article'
import User from '../models/User'
const router = koaRouter();

router
    /**
     *  获取单个用户信息
     * */
    .get('/', async (ctx, next) => {
        // const {_id, phone, password, name} = ctx.query;
        // const user = await new User().findOne({phone, password}, {password: 0});
        // if(user){
        //     ctx.body = {data: user};
        // }else{
        //     ctx.body = { statusCode: 500, msg: '密码或账号不对'};
        // }

    })

    /*列表查询*/
    .get('/list', async (ctx, next) => {
        const {_id, phone, password, name} = ctx.query;
        const articles = await new Article().find({});
        if(articles.length > 0){
            let createIds = articles.map((item) => item.createBy);
            createIds  = Array.from(new Set(createIds));
            const users = await new User().find({_id: {$in: createIds}}, {password: 0, createdAt: 0, updatedAt: 0});
            articles.forEach((article, i) => {
                users.forEach((user, i) => {
                    if(article.createBy == user._id){
                        article.user = user;
                    }
                })
            })
            ctx.body = {data: articles};
        }else{
            ctx.body = {data: articles};
        }
    })

    /**
     * 新增
     * */
    .post('/', async (ctx, next) => {
        const {content, like, publicity, createBy} = ctx.request.body;
        const article = await new Article({content, like: parseInt(like), publicity: parseInt(publicity), createBy}).insert();
        ctx.body = {data: article};
        // if(name && phone && password){
        //     if(!(/^1[34578]\d{9}$/.test(phone))){
        //         ctx.body = { statusCode: 500, msg: '手机格式不对'};
        //         return;
        //     }else{
        //         const user = new User({name, phone, password});
        //         const unique = await user.findOne({phone});
        //         if(unique){
        //             ctx.body = { statusCode: 500, msg: '手机号已注册'};
        //             return;
        //         }
        //
        //         const result = await user.insert();
        //         delete result.password;
        //         ctx.body = {data: result};
        //     }
        // }else{
        //     ctx.body = { statusCode: 500, msg: '请输入完整信息'};
        // }

    })
;

export default router