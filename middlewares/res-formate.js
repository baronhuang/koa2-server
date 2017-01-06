/**
 * Created by Administrator on 2017/1/6 0006.
 */

/**
 *  中间件：返回数据格式化
 * */
export default () => {
    return async (ctx, next) => {
        await next();
        const formate = {
            statusCode: 200,
        }
        const result = Object.assign({}, formate, ctx.body);
        ctx.body = result;
    }
}