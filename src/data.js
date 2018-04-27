var Service = require('./service');
var DataConfiguration = require('./dataConfiguration');


function inheritPrototype(subType,superType){
    var prototype = Object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
var Data = function(id,type,size,value,ip,port){
     Service.call(this,ip,port);
     this.id = id;
     this.type = type;
     this.size = size;
     this.value = value;
}

inheritPrototype(Data,Service);

Data.createDataByJSON = function(jData,ip,port){
    var gd_id = jData.gd_id;
    var gd_type = jData.gd_type;
    var gd_size = jData.gd_size;
    var gd_value = jData.gd_value;

    return new Data(gd_id,gd_type,gd_size,gd_value,ip,port);
}

Data.createDataConfigByJSON = function(jConfig){
    var pDataConfig = new DataConfiguration();
    for(var i =0 ; i < jConfig.length; i++){
        let stateid = jConfig[i].StateId;
        let eventname = jConfig[i].Event;
        let dataid = jConfig[i].DataId;
        let destroyed = jConfig[i].Destroyed;
        pDataConfig.insertData(stateid,eventname,dataid,destroyed);
    }
    return pDataConfig;
}

module.exports = Data;