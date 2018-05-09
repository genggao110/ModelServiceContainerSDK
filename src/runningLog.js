var RunningLog = function(type,state,event,flag,message,datetime,mark = false){
    this._type = type;
    this._state = state;
    this._event = event;
    this._flag = flag;
    this._message = message;
    this._datetime = datetime;
    this._mark = mark;
}

RunningLog.createRunningLogByJSON = function(JLog){
    let type = JLog.Type;
    let state = JLog.State;
    let event = JLog.Event;
    let flag = JLog.Flag;
    let message = JLog.Message;
    let datetime = JLog.datetime;

    return new RunningLog(type,state,event,flag,message,datetime);
}

RunningLog.convertJson2Logs = function(jsLogs){
    let logs = [];
    for(let i = 0 ; i < jsLogs.length; i++){
        let log = RunningLog.createRunningLogByJSON(jsLogs[i]);
        logs.push(log);
    }
    return logs;
}

RunningLog.prototype.print = function(){
    let self = this;
    console.log(self._type + ' - ' + self._state + ' - ' + self._event + ' - ' + self._message);
}

//basic get function(maybe no need)
RunningLog.prototype.getType = function(){
    let self = this;
    return self._type;
}

RunningLog.prototype.getState = function(){
    let self = this;
    return self._state;
}

RunningLog.prototype.getEvent = function(){
    let self = this;
    return self._event;
}

RunningLog.prototype.getFlag = function(){
    let self = this;
    return self._flag;
}

RunningLog.prototype.getMessage = function(){
    let self = this;
    return self._message;
}

RunningLog.prototype.getDateTime = function(){
    let self = this;
    return self._datetime;
}

RunningLog.prototype.getMark = function(){
    let self = this;
    return self._mark;
}

RunningLog.prototype.setMark = function(mark){
    let self = this;
    self._mark = mark;
}

module.exports = RunningLog;