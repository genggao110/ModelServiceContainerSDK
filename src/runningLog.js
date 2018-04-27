var RunningLog = function(type,state,event,flag,message,datetime){
    this._type = type;
    this._state = state;
    this._event = event;
    this._flag = flag;
    this._message = message;
    this._datetime = datetime;
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

module.exports = RunningLog;