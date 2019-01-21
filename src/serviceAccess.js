var Service = require('./service');
var HttpRequest = require('./utils');
var ModelService = require('./modelservice');
var Data = require('./data');
var fs = require('fs');
var DataConfiguration = require('./dataConfiguration');
var ModelServiceRecord = require('./modelserviceRecord');
var ModelServiceInstance = require('./modelserviceInstance');

// function inheritPrototype(subType, superType) {
//     subType.prototype = Object.create(superType.prototype);
//     subType.prototype.constructor = subType;
// }
var ServiceAccess = function (ip, port) {
    Service.call(this, ip, port);
}

Service.inheritPrototype(ServiceAccess, Service);

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
                    var ms =  ModelService.createModelServiceByJSON(jMss[i],self.ip,self.port);
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
                var pData = Data.createDataByJSON(jGeoData.data, ip, port);
                return Promise.resolve(pData);
            } else {
                return Promise.reject(new Error('upload data failed'));
            }
        })
        .catch((err) =>{
            return Promise.reject(err);
        })
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

ServiceAccess.prototype.getModelServiceRecordByID = function(msrid){
    var self = this;
    var url = self.getBaseURL() + 'modelserrun/json/' + msrid;
    var ip = self.ip;
    var port = self.port;
    //promise 对象
    return HttpRequest.request_get_json(url,null)
       .then((body)=>{
           let data = JSON.parse(body);
           if(data.result === 'suc'){
               let jMsr = data.data;
               let msr = ModelServiceRecord.createModelServiceRecordByJSON(jMsr,ip,port);
               return Promise.resolve(msr);
           }else{
               return Promise.reject(new Error('Get Model Service Record error'));
           }
       })
       .catch((err)=>{
           return Promise.reject(err);
       })
}

ServiceAccess.prototype.getDataServiceByID = function(dataid){
    var self = this;
    var url = self.getBaseURL() + 'geodata/json/' + dataid;
    var ip = self.ip;
    var port = self.port;

    return HttpRequest.request_get_json(url,null)
       .then((body)=>{
           let data = JSON.parse(body);
           if(data.result === 'suc' && data.data !== null){
               let jsData = Data.createDataByJSON(data.data,ip,port);
               return Promise.resolve(jsData);
           }else{
               return Promise.reject(new Error('Get Data error'));
           }
       })
       .catch((err) =>{
           return Promise.reject(err);
       })
}

ServiceAccess.prototype.getModelServiceInstanceByGUID = function(guid){
    let self = this;
    let url = self.getBaseURL() + 'modelins/json/' + self.guid;
    let ip = self.ip;
    let port = self.port;
    return HttpRequest.request_get_json(url,null)
       .then(body =>{
           let data = JSON.parse(body);
           if(data.result === 'suc'){
               let jMis = ModelServiceInstance.createModelServiceInstacnce(data.data,ip,port);
               return Promise.resolve(jMis);
           }else{
               return Promise.reject(new Error('Get model instance record error'));
           }
       })
       .catch(err =>{
           return Promise.reject(err);
       })
}

ServiceAccess.prototype.createDataConfig = function(){
    return new DataConfiguration();
}

module.exports = ServiceAccess;