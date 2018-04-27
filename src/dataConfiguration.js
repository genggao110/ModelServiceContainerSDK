
var DataConfiguration = function(){
    this._item = [];
};

DataConfiguration.prototype.getCount = function(){
    var self = this;
    return self._item.length;
}

DataConfiguration.prototype.insertData = function(cstate,cevent,dataid,cdestoryed,requested,optional){
    var self = this;
    for(var i = 0 ; i < self._item.length; i++){
        if (self._item[i].state === cstate && self._item[event] === cevent){
            self._item[i].data = dataid;
            self._item[i].destoryed = destoryed;
            return 2;
        }
    }
    var item = {
        state: cstate,
        event: cevent,
        data: dataid,
        destoryed: cdestoryed
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

module.exports = DataConfiguration;