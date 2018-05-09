var Service = require('./service');
var HttpRequest = require('./utils');
var RunningLog = require('./runningLog');

//仿枚举类型
var ModelInstanceStatus = {
    INSTA_UNKNOWN: 0,
    INSTA_RUNNING: 1,
    INSTA_REQUESTING: 2,
    INSTA_HANGING: 3,
    INSTA_FINISHED: 4
};

var convertString2Status = function(cstatus){
    if(cstatus === 'RUNNING'){
        return ModelInstanceStatus.INSTA_RUNNING;
    }else if(cstatus === 'REQUESTING'){
        return ModelInstanceStatus.INSTA_REQUESTING;
    }else if(cstatus === 'HANGING'){
        return ModelInstanceStatus.INSTA_HANGING;
    }else{
        return ModelInstanceStatus.INSTA_UNKNOWN;
    }
};
var ModelServiceInstance = function(state,eventname,guid,startDT,serviceID,logs,status = ModelInstanceStatus.INSTA_UNKNOWN,_statusDes = '',ip,port){
    Service.call(this,ip,port);
    this._state = state;
    this._event = eventname;
    this._guid = guid;
    this._startDT = startDT;
    this._serviceID = serviceID;
    this._logs = logs;
    this._status = status;
    this._statusDes = _statusDes;
}
Service.inheritPrototype(ModelServiceInstance,Service);

ModelServiceInstance.prototype.refresh = function(){
    var self = this;
    var url = self.getBaseURL() + 'modelins/json/' + self._guid;
    return HttpRequest.request_get_json(url,null)
        .then((body) =>{
            data = JSON.parse(body);
            if(data.result === 'suc'){
                let mis = data.data;
                if(mis == null){
                    self._status = ModelInstanceStatus.INSTA_FINISHED;
                    return Promise.resolve(1);
                }else{
                    self._event = mis.event;
                    self._state = mis.state;
                    self._status = convertString2Status(mis.status);
                    self._logs = RunningLog.convertJson2Logs(mis.log);
                    self._statusDes = mis.statusDes;
                }
                return Promise.resolve(1);
            }else{
                return Promise.resolve(-2);
            }
             
        })
        .catch((err) =>{
            return Promise.reject(err);
        })
}

ModelServiceInstance.wait4Status = function(status, timeout,log){
    //TODO
     console.log('to be finished');
}

ModelServiceInstance.createModelServiceInstacnce = function(jsData,ip,port){
     let state = jsData.state;
     let eventname = jsData.event;
     let guid = jsData.guid;
     let startDT = jsData.start;
     let serviceID = jsData.ms._id;
     let logs = RunningLog.convertJson2Logs(jsData.log);
     let status = convertString2Status(jsData.status);
     let statusDes = jsData.statusDes;

     return new ModelServiceInstance(state,eventname,guid,startDT,serviceID,logs,status,statusDes);
}


ModelServiceInstance.prototype.getNewLogs = function(){
    let self = this;
    let nlogs = [];
    for(let i = 0; i < self._logs.length; i++){
        if(!self._logs[i].getMark()){
            self._logs[i].setMark(true);
            nlogs.push(self._logs[i]);
        }
    }
    return nlogs;
}

//kill model instance
ModelServiceInstance.prototype.kill = function(){
    let self = this;
    let url = self.getBaseURL() + 'modelins/' + self._guid + '?ac=kill';
    return HttpRequest.request_put_json(url,null)
        .then(body =>{
            let data = JSON.parse(body);
            if(data.result === 'suc'){
                return Promise.resolve(1);
            }else{
                return Promise.resolve(-2);
            }
        })
        .catch(err =>{
            return Promise.reject(err);
        })
}

//pause model instance
ModelServiceInstance.prototype.pause = function(){
    let self = this;
    let url = self.getBaseURL() + 'modelins/' + self._guid + '?ac=pause';
    return HttpRequest.request_put_json(url,null)
        .then(body =>{
            let data = JSON.parse(body);
            if(data.result === 'suc'){
                return Promise.resolve(1);
            }else{
                return Promise.resolve(-2);
            }
        })
        .catch(err =>{
            return Promise.reject(err);
        })
}

//restart model service instance
ModelServiceInstance.prototype.restart = function(){
    let self = this;
    let url = self.getBaseURL() + 'modelins/' + self._guid + '?ac=restart';
    return HttpRequest.request_put_json(url,null)
        .then(body =>{
            let data = JSON.parse(body);
            if(data.result === 'suc'){
                return Promise.resolve(1);
            }else{
                return Promise.resolve(-2);
            }
        })
        .catch(err =>{
            return Promise.reject(err);
        })
}


//basic get function(maybe no need)

ModelServiceInstance.prototype.getCurrentState = function(){
    return this._state;
}

ModelServiceInstance.prototype.getCurrentEvent = function(){
    return this._event;
}

ModelServiceInstance.prototype.getGUID = function(){
    return this._guid;
}

ModelServiceInstance.prototype.getStartTime = function(){
    return this._startDT;
}

ModelServiceInstance.prototype.getModelServiceID = function(){
    return this._serviceID;
}

ModelServiceInstance.prototype.getLogs = function(){
    return this._logs;
}

ModelServiceInstance.prototype.getStatus = function(){
    return this._status;
}

module.exports = ModelServiceInstance;