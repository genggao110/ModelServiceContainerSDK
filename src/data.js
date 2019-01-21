var Service = require('./service');
var DataConfiguration = require('./dataConfiguration');
var HttpRequest = require('./utils');
var FsWritefile = require('fs-writefile-promise');

var Data = function(id,tag,size,genarationDateTime,type,value,ip,port){
     Service.call(this,ip,port);
     this.id = id;
     this.tag = tag;
     this.size = size;
     this.genarationDateTime = genarationDateTime;
     this.type = type;  
     this.value = value;
}

Service.inheritPrototype(Data,Service);

Data.createDataByJSON = function(jData,ip,port){
    let gd_id = jData.gd_id;
    let gd_type = jData.gd_type;
    let gd_size = jData.gd_size;
    let gd_value = jData.gd_value;
    let gd_tag = jData.gd_tag;
    let gd_datetime = jData.gd_datetime;

    

    return new Data(gd_id,gd_tag,gd_size,gd_datetime,gd_type,gd_value,ip,port);
}

Data.createDataConfigByJSON = function(jConfig){
    var pDataConfig = new DataConfiguration();
    for(var i = 0 ; i < jConfig.length; i++){
        let stateid = jConfig[i].StateId;
        let eventname = jConfig[i].Event;
        let dataid = jConfig[i].DataId;
        let destroyed = jConfig[i].Destroyed;
        pDataConfig.insertData(stateid,eventname,dataid,destroyed);
    }
    return pDataConfig;
}

Data.prototype.saveAs = function(filepath){
    var self = this;
    var url = self.getBaseURL() + 'geodata/' + self.id;
    return HttpRequest.request_get_json(url,null)
       .then(function(data){
           return FsWritefile(filepath,data);
       })
       .then(function(filename){
           //console.log(filename);
           return Promise.resolve(1);
       })
       .catch(function(err){
           console.error(err);
           return Promise.reject(err);
       })

}

Data.prototype.isExist = function(){
    var self = this;
    var url = self.getBaseURL() + 'geodata/json/' + self.id;
    return HttpRequest.request_get_json(url,null)
       .then(data =>{
           let jData = JSON.parse(data);
           if(jData.result === 'suc'){
               let gd = jData.data;
               if(gd !== ''){
                   return Promise.resolve(true);
               }else{
                return Promise.resolve(false);
               }
           }else{
               return Promise.resolve(false);
           }
       })
       .catch(err =>{
        console.error(err);
        return Promise.reject(err);
       })
}

//basic get function(maybe no need)
Data.prototype.getID = function(){
    return this.id;
}

Data.prototype.getTag = function(){
    return this.tag;
}

Data.prototype.getGenerationDateTime = function(){
    return this.genarationDateTime;
}

Data.prototype.getType = function(){
    return this.type;
}

Data.prototype.getSize = function(){
    return this.type;
}

Data.prototype.getValue = function(){
    return this.value;
}

module.exports = Data;