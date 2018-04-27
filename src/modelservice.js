var Service = require('./service');
var HttpRequest = require('./utils');

function inheritPrototype(subType,superType){
    var prototype = Object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
var ModelService = function(id,name,type,ip,port){
    Service.call(this,ip,port);
    this.id = id;
    this.name = name;
    this.type = type;
}
inheritPrototype(ModelService, Service);

ModelService.prototype.invoke = function(pDataConfig){
    var self = this;
    var url = self.getBaseURL() + 'modelser/' + self.id + '?ac=run&inputdata=[';
    for(var i = 0; i < pDataConfig.getCount(); i++){
        var item = pDataConfig._item[i];
        url = url + '{"stateId":"' + item.state + '","Event":"' + item.event + '","DataId":"' + item.data + '","Destoryed":"false"}' ;
    }
    url += ']&auth=';
    console.log(url);
    return HttpRequest.request_get_json(url,null)
        .then( (body) =>{
            var data = JSON.parse(body);
            if(data.result === 'suc'){
                var recordid = data.data;
                return Promise.resolve(recordid);
            }else{
                return Promise.reject(new Error('invoke model failed'));
            }
        })
        .catch( (err) =>{
            return Promise.reject(err);
        })
}

ModelService.createModelServiceByJSON = function(jMs,ip,port){
    let oid = jMs._id;
    let name = jMs.ms_model.m_name;
    let type = jMs.ms_model.m_type;
    return new ModelService(oid,name,type,ip,port);
}

ModelService.prototype.getServiceOID = function(){
    return this.id;
}

ModelService.prototype.getServiceName = function(){
    return this.name;
}

ModelService.prototype.getServiceType = function(){
    return this.type;
}


module.exports = ModelService;
