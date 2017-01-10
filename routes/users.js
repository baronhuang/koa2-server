
/**
 * users路由
 * */
import koaRouter from 'koa-router'
import User from '../models/User'
import koaBody from 'koa-body'
import path from 'path'
import fs from 'fs'
import utils from '../utils'

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

    /**
     * 上传头像
     * */
    .post('/avatar', koaBody({multipart:true}), async (ctx, next) => {
        console.log(ctx.query);

        const {userId} = ctx.query;
        if(userId){
            try {
                const filePath = `users/${userId}`;
                const data = await utils.uploadImages(ctx, filePath);
                if(data.statusCode == 200){
                    ctx.body = data;
                }else{
                    ctx.body = data;
                }

            }catch (e){
                ctx.body = { statusCode: 500, msg: e.stack};
            }
        }else{
            ctx.body = { statusCode: 500, msg: '请输入用户ID'};
        }

    })
;



export default router
