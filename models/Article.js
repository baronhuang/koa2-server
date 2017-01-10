/**
 * Created by Administrator on 2017/1/6 0006.
 */


/**
 * 文章类
 * */
export default class Article {

    /**
     *  content: 内容,
     *  like: 点赞数,
     *  publicity: 是否私密,
     *  createBy: 创建者
     * */
    constructor({content, like, publicity, createBy} = {}){
        this.content = content;
        this.like = like;
        this.publicity = publicity;
        this.createBy = createBy;
    }

    /**
     * params:查询参数,
     * fields: 返回哪些字段，不填，返回全部
     * */
    find(query, fields, sort = {createdAt: -1}){
        return new Promise(function (resolve) {
            global.db.articles.find(query, fields).sort(sort).exec(function (err, data) {
                resolve(data);
            })
        })
    }

    findOne(query, fields){
        return global.db.articles.findOneAsync(query, fields);
    }

    insert({content=this.content, like=this.like, publicity=this.publicity, createBy=this.createBy} = {}){
        console.log(content, like, publicity, createBy)
        return global.db.articles.insertAsync({content, like, publicity, createBy});
    }

    update(query, update = {content:this.content,  publicity:this.publicity}){
        return global.db.articles.updateAsync(query, {$set: update});
    }

    remove(query){
        return global.db.articles.removeAsync(query);
    }

}