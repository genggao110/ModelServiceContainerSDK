var HttpRequest = require('./utils');

var Service = function(ip,port){
    this.ip = ip;
    this.port = port;
}

Service.prototype.getBaseURL = function(){
    var self = this;
    var baseurl = 'http://' + self.ip + ':' + self.port + '/';
    return baseurl;
}

Service.prototype.connect = function(){
    var self = this;
    var url = self.getBaseURL() + 'ping';
    return HttpRequest.request_get_json(url,null)
          .then(function(body){
              console.log(body);
              if (body == 'OK'){
                  return Promise.resolve(1);
              }else{
                  return Promise.resolve(0);
              }
          })
          .catch(function(err){
              return Promise.reject(err);
          }); 
   
}

Service.prototype.setIP = function(ip){
    var self = this;
    self.ip = ip;
}

Service.inheritPrototype = function(subType,superType){
    var prototype = Object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}



module.exports = Service;
