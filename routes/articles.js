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
        const {_id} = ctx.query;
        const article = await new Article().findOne({_id});
        if(article){
            const user = await new User().find({_id: article.createBy}, {password: 0, createdAt: 0, updatedAt: 0});
            article.user = user;
        }
        ctx.body = {data: article};

    })

    /*发现广场列表查询*/
    .get('/list', async (ctx, next) => {
        const {_id, phone, name} = ctx.query;
        console.log(44444)
        const articles = await new Article().find({publicity: 1});
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

    /*我的文章*/
    .get('/my', async (ctx, next) => {
        const {_id, phone, name} = ctx.query;
        const createBy = ctx.session.user._id;
        const articles = await new Article().find({createBy});
        if(articles.length > 0){
            articles.forEach((article, i) => {
                article.user = ctx.session.user;
            })
            ctx.body = {data: articles};
        }else{
            ctx.body = {data: articles};
        }
    })

    /**
     * 插入
     * */
    .post('/', async (ctx, next) => {
        const {content, publicity} = ctx.request.body;
        const createBy = ctx.session.user._id;
        const article = await new Article({content, like: 0, publicity: parseInt(publicity), createBy}).insert();
        ctx.body = {data: article};
    })

    /**
     * 更新
     * */
    .put('/', async (ctx, next) => {
        const {_id, content, publicity} = ctx.request.body;
        const article = await new Article().update({_id}, {content, publicity: parseInt(publicity)});
        if(article){
            ctx.body = {data: article};
        }else{
            ctx.body = {statusCode: 500, msg: '更新失败'};
        }
    })

    /**
     * 删除
     * */
    .delete('/', async (ctx, next) => {
        const {_id} = ctx.query;
        const article = await new Article().remove({_id});
        ctx.body = ctx.body = {data: article};
        if(article){
            ctx.body = {data: article};
        }else{
            ctx.body = {statusCode: 500, msg: '更新失败'};
        }
    })
;

export default router