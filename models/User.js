/**
 * Created by Administrator on 2017/1/6 0006.
 */



/**
 * 用户类
 * */
export default class User {

    /**
     * _id: 用户id,
     * phone: 电话,
     * password: 密码,
     * name: 昵称,
     * */
    constructor({_id, phone, password, name} = {}){
        this._id = _id;
        this.phone = phone;
        this.password = password;
        this.name = name;
    }

    /**
     * query:查询参数,
     * fields: 返回哪些字段，不填，返回全部
     * */
    find(query, fields){
        return global.db.users.findAsync(query, fields);
    }

    findOne(query, fields){
        console.log(query, fields)
        return global.db.users.findOneAsync(query, fields);
    }

    update(query, update = {}){
        return global.db.articles.updateAsync(query, {$set: update});
    }

    insert({phone=this.phone, password=this.password, name=this.name} = {}){
        const avatar = global.localUrl + '/users/avatar.jpg';
        return global.db.users.insertAsync({phone, password, name, avatar});
    }

}