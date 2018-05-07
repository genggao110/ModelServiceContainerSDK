var Service = require('./service');
var HttpRequest = require('./utils');
var Data = require('./data');
var RunningLog = require('./runningLog');

var ModelServiceRecord = function(oid,msid,datetime,span,input,output,status,cstdout,cstderr,invkerr,list_log,ip,port){
    Service.call(this,ip,port);
    this._oid = oid;
    this._msid = msid;
    this._datetime = datetime;
    this._span = span;
    this._input = input;
    this._output = output;
    this._status = status;
    this._stdout = cstdout;
    this._stderr = cstderr;
    this._invkerr = invkerr;
    this._list_log = [];
    if(list_log != null){
        for(var i = 0; i < list_log.length; i++){
            this._list_log.push(list_log[i]);
        }
    }
}

Service.inheritPrototype(ModelServiceRecord,Service);

ModelServiceRecord.prototype.refresh = function(){
    var self = this;
    var url = self.getBaseURL() + 'modelserrun/json/' + self._oid;
    HttpRequest.request_get_json(url,null)
       .then(function(body){
           data = JSON.parse(body);
           if(data.result === 'suc'){
               var jMsr = data.data;
               let pInput = Data.createDataConfigByJSON(jMsr.msr_input);
               let pOutput = Data.createDataConfigByJSON(jMsr.msr_output);
               //update information
               self._input = pInput;
               self._output = pOutput;
               self._span = jMsr.msr_span;
               self._status = jMsr.msr_status;
               self._invkerr = jMsr.msr_runninginfo.InvokeErr;
               self._stdout = jMsr.msr_runninginfo.StdOut;
               self._stderr = jMsr.msr_runninginfo.StdErr;

               let jLogs = jMsr.msr_logs;
               for(var i = 0; i < jLogs.length; i++){
                   self._list_log.push(RunningLog.createRunningLogByJSON(jLogs[i]));
               }
               return Promise.resolve(1);

           }else{
               return Promise.resolve(-1);
           }
       })
       .catch(function(err){
           return Promise.reject(err);
       })
}

ModelServiceRecord.createModelServiceRecordByJSON = function(jMsr,ip,port){
     let restatus = jMsr.msr_status;
     let pInput = Data.createDataConfigByJSON(jMsr.msr_input);
     let pOutput = Data.createDataConfigByJSON(jMsr.msr_output);
     let stdout = jMsr.msr_runninginfo.StdOut;
     let stderr = jMsr.msr_runninginfo.StdErr;
     let invokerr = jMsr.msr_runninginfo.InvokeErr;
     let list_log = jMsr.msr_logs;

     return new ModelServiceRecord(jMsr._id,jMsr.ms_id,jMsr.msr_datetime,jMsr.msr_span,pInput,pOutput,restatus,stdout,stderr,invokerr,list_log,ip,port);
}

module.exports = ModelServiceRecord;