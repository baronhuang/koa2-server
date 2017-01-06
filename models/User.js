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

     findOne({_id=this._id} = {}){
         console.log('_id', _id);
         return global.db.findOneAsync({_id});
    }

    find(params){
        console.log(params);
        return global.db.findAsync(params);
    }

    insert({phone=this.phone, password=this.password, name=this.name} = {}){
        console.log(phone, password, name)
        return global.db.insertAsync({phone, password, name});
    }

}