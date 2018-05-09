var Service = require('./service');
var ServiceAccess = require('./serviceAccess');

// function inheritPrototype(subType, superType) {
//     subType.prototype = Object.create(superType.prototype);
//     subType.prototype.constructor = subType;  
// }
var Server = function(ip,port){
    Service.call(this,ip,port);
}
Service.inheritPrototype(Server,Service);

Server.prototype.getServiceAccess = function(){
    var self = this;
    var serviceaccess =  new ServiceAccess(self.ip,self.port);
    return serviceaccess;
}

Server.createServer = function(ip,port){
    return new Server(ip,port);
}

module.exports = Server;