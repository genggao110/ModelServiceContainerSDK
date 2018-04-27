var Service = require('./service');
var ServiceAccess = require('./serverAccess');

function inheritPrototype(subType,superType){
    var prototype = Object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

var Server = function(ip,port){
    Service.call(this,ip,port);
}
inheritPrototype(Server,ServiceAccess);


Server.prototype.getServiceAccess = function(){
    var self = this;
    return new ServiceAccess(self.ip,self.port);
}

module.exports = Service;