var Service = require('./service');
var HttpRequest = require('./utils');
var ModelService = require('./modelservice');
var Data = require('./data');
var fs = require('fs');
var DataConfiguration = require('./dataConfiguration');

function inheritPrototype(subType, superType) {
    var prototype = Object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
var ServiceAccess = function (ip, port) {
    Service.call(this, ip, port);
}

inheritPrototype(ServiceAccess, Service);

ServiceAccess.prototype.getModelServicesList = function () {
    var self = this;
    var url = self.getBaseURL() + 'modelser/json/all';

   return HttpRequest.request_get_json(url, null)
        .then(function (body) {
            var data = JSON.parse(body);
            if (data.result == 'suc') {
                var jMss = data.data;
                var mslist = [];
                for (var i = 0; i < jMss.length; i++) {
                    var ms = new ModelService(jMss[i]._id, jMss[i].ms_model.m_name, jMss[i].ms_model.m_type, self.ip, self.port);
                    mslist.push(ms);
                }
                return Promise.resolve(mslist);
            } else {
                return Promise.reject(new Error('GET service error'));
            }
        })
        .catch(function (err) {
            return Promise.reject(err);
        })

}

// 模块统一promise化写法
// fs = Promise.promisifyAll(fs);
// fs.writeFileAsync()
//     .then

ServiceAccess.prototype.uploadDataByFile = function (filepath, tag) {
    var self = this;
    var url = self.getBaseURL() + 'geodata?type=file';
    var formData = {
        gd_tag: tag,
        myfile: fs.createReadStream(filepath)
    };
    var ip = self.ip;
    var port = self.port;

    return HttpRequest.request_postwithform_json(url, formData, 'File')
        .then(function (body) {
            var responsedata = JSON.parse(body);
            if (responsedata.result === 'suc') {
                var gdid = responsedata.data;
                dataurl = self.getBaseURL() + 'geodata/json/' + gdid;
                return HttpRequest.request_get_json(dataurl, null);
            } else {
                return Promise.reject(new Error('upload data failed'));
            }
        })
        .then(function (result) {
            jGeoData = JSON.parse(result);
            if (jGeoData.result === 'suc') {
                console.log(ip);
                var pData = Data.createDataByJSON(jGeoData.data, ip, port);
                return Promise.resolve(pData);
            } else {
                return Promise.reject(new Error('upload data failed'));
            }
        })
        .catch((err) =>{
            return Promise.reject(err);
        })


    // return new Promise((resolve, reject) => {
    //     HttpRequest.request_postwithform_json(url, formData, 'File')
    //         .then(function (body) {
    //             var responsedata = JSON.parse(body);
    //             if (responsedata.result === 'suc') {
    //                 var gdid = responsedata.data;
    //                 dataurl = self.getBaseURL() + 'geodata/json/' + gdid;
    //                 return HttpRequest.request_get_json(dataurl, null);
    //             } else {
    //                 return reject(new Error('upload data failed'));
    //             }
    //         })
    //         .then(function (result) {
    //             jGeoData = JSOM.parse(result);
    //             if (jGeoData.result === 'suc') {
    //                 var pData = Data.createDataByJSON(jGeoData.data, self.ip, self.port);
    //                 return resolve(pData);
    //             } else {
    //                 return reject(new Error('upload data failed'));
    //             }
    //         })
    //         .catch(reject)
    // })
}

ServiceAccess.prototype.getModelServiceByOID = function(msid){
    var self = this;
    var url = self.getBaseURL() + 'modelser/json/' + msid;
    var ip = self.ip;
    var port = self.port;
    //返回promise对象
    return HttpRequest.request_get_json(url,null)
       .then((body) =>{
          let data = JSON.parse(body);
          if(data.result === 'suc'){
              let jData = data.data;
              let ms = ModelService.createModelServiceByJSON(jData,ip,port);
              return Promise.resolve(ms);
          }else{
              return Promise.reject(new Error('GET Model service error'));
          }
       })
       .catch((err) =>{
           return Promise.reject(err);
       })
}

ServiceAccess.prototype.createDataConfig = function(){
    return new DataConfiguration();
}

module.exports = ServiceAccess;