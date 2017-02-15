/**
 * Created by Administrator on 2017/1/10 0010.
 */

import path from 'path'
import fs from 'fs'

/*工具类*/
export default {
    /*获取本机IP*/
    getIPAdress(){
        var interfaces = require('os').networkInterfaces();
        for(var devName in interfaces){
            var iface = interfaces[devName];
            for(var i=0;i<iface.length;i++){
                var alias = iface[i];
                if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                    return alias.address;
                }
            }
        }
    },

    //创建多层文件夹 同步
    mkdirsSync(dirpath, mode) {
        if (!fs.existsSync(dirpath)) {
            let pathtmp;
            dirpath.split(path.sep).forEach(function(dirname) {
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                }
                else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true;
    },

    /*上传图片*/
    uploadImages(ctx, filePath){
        var upFilePath = '../uploads/' + filePath;
        return new Promise((resolve) => {
            const streamPath = ctx.request.body.files.files._writeStream.path;
            let fileName = ctx.request.body.files.files.name || streamPath;
            if(/.(jpg|png|jpeg|gif)$/g.test(fileName)){
                fileName = new Date().getTime() + '.' + fileName.split('.')[1];
                const folderPath = path.resolve(__dirname, upFilePath);
                const targetPath = `${folderPath}/${fileName}`;
                this.mkdirsSync(folderPath);
                console.log(targetPath);
                //copy file
                fs.createReadStream(streamPath).pipe(fs.createWriteStream(targetPath));
                resolve({statusCode: 200, url: `${global.localUrl}${filePath}/${fileName}`});
            }else{
                resolve({ statusCode: 500, msg: '请选择图片文件格式' });
            }
        })

    }
}