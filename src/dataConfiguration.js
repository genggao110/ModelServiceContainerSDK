
var DataConfiguration = function(){
    this._item = [];
};

DataConfiguration.prototype.getCount = function(){
    var self = this;
    return self._item.length;
}

DataConfiguration.prototype.insertData = function(cstate,cevent,dataid,cdestoryed = false,requested = false,optional = false){
    var self = this;
    for(var i = 0 ; i < self._item.length; i++){
        if (self._item[i].state === cstate && self._item[i].event === cevent){
            self._item[i].data = dataid;
            self._item[i].destoryed = destoryed;
            return 2;
        }
    }
    var item = {
        state: cstate,
        event: cevent,
        data: dataid,
        destoryed: cdestoryed,
        requested: requested,
        optional: optional
    };

    self._item.push(item);
    return 1;
}

DataConfiguration.prototype.getDataID = function(state,event){
    var self = this;
    for(var i = 0 ; i < self._item.length; i++){
        var item = self._item[i];
        if(item.state === state && item.event === event){
            return item.data;
        }
    }
    return null;
}

DataConfiguration.prototype.getData = function(index,state,event,dataid,destoryed){
    var self = this;
    if(index > self._item.length - 1 || index < 0){
        return null;
    }
    for(let i = 0; i < self._item.length; i++){
        if(i === index){
            return self._item[i];
        }
    }
    return null;
}

//getData function wait to achieve

module.exports = DataConfiguration;