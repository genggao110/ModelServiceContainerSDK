var Service = require('./service');
var HttpRequest = require('./utils');

function inheritPrototype(subType,superType){
    var prototype = Object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
var ModelServiceInstance = function(state,eventname,guid,startDT,serviceID,logs,status,ip,port){
    Service.call(this,ip,port);
    this._state = state;
    this._eventname = eventname;
    this._guid = guid;
    this._startDT = startDT;
    this._serviceID = serviceID;
    this._logs = [];
    if(logs != null){
        for(var i = 0; i < logs.length; i++){
            this._logs.push(logs[i]);
        }
    }
    this._status = status;
}
inheritPrototype(ModelServiceInstance,Service);

ModelServiceInstance.prototype.refresh = function(){
    var self = this;
    var url = self.getBaseURL() + 'modelins/json/' + self._guid;
    return HttpRequest.request_get_json(url,null)
        .then((body) =>{
            data = JSON.parse(body);
            if(data.result === 'suc'){
                let result = 1;
                return Promise.resolve(result);
            }else if(data.result === 'err'){
                let result = -2;
                return Promise.resolve(result);
            }else{
                return Promise.reject(new Error('refresh information failed'));
            }
             
        })
        .catch((err) =>{
            return Promise.reject(err);
        })
}

module.exports = ModelServiceInstance;