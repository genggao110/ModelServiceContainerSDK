var Service = require('./service');
var HttpRequest = require('./utils');

var ModelService = function (id, name, type, url, pid, mid, registered, description, version, platform, deploytime, img, deployorname, deployoremail, status, limit, permission, ip, port) {
    Service.call(this, ip, port);
    this.id = id;
    this.name = name;
    this.type = type;
    this.url = url;
    this.pid = pid;
    this.mid = mid;
    this.registered = registered;
    this.description = description;
    this.version = version;
    this.platform = platform;
    this.deploytime = deploytime;
    this.img = img;
    this.deployorname = deployorname;
    this.deployoremail = deployoremail;
    this.status = status;
    this.limit = limit;
    this.permission = permission;
}
Service.inheritPrototype(ModelService, Service);

ModelService.prototype.invoke = function (pDataConfig) {
    var self = this;
    var url = self.getBaseURL() + 'modelser/' + self.id + '?ac=run&inputdata=[';
    for (var i = 0; i < pDataConfig.getCount(); i++) {
        var item = pDataConfig._item[i];
        if (i == pDataConfig.getCount() - 1) {
            url = url + '{"StateId":"' + item.state + '","Event":"' + item.event + '","DataId":"' + item.data + '","Destoryed":"false"}';
        } else {
            url = url + '{"StateId":"' + item.state + '","Event":"' + item.event + '","DataId":"' + item.data + '","Destoryed":"false"},';
        }
    }
    url += ']&auth=';
    // console.log(url);
    return HttpRequest.request_get_json(url, null)
        .then((body) => {
            var data = JSON.parse(body);
            if (data.result === 'suc') {
                var recordid = data.data;
                return Promise.resolve(recordid);
            } else {
                return Promise.reject(new Error('invoke model failed'));
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        })
}

ModelService.createModelServiceByJSON = function (jMs, ip, port) {
    let oid = jMs._id;
    let name = jMs.ms_model.m_name;
    let type = jMs.ms_model.m_type;
    let url = jMs.ms_model.m_url;
    let pid = jMs.ms_model.p_id;
    let mid = jMs.ms_model.m_id;
    let registered = jMs.ms_model.m_register;
    let des = jMs.ms_des;
    let version = jMs.mv_num;
    let msplatform = jMs.ms_platform;
    let platform = '';
    if (msplatform == 1) {
        platform = 'PLF_WINDOWS';
    } else if (msplatform == 2) {
        platform = 'PLF_LINUX';
    } else if (msplatform == 3) {
        platform = 'PLF_MACOS';
    } else {
        platform = 'PLF_UNKNOWN';
    }

    let deployTime = jMs.ms_update;
    let img = jMs.ms_img;
    let deployorname = jMs.ms_user.u_name;
    let deployoremail = jMs.ms_user.u_email;
    let status = jMs.ms_status;
    let limit = jMs.ms_limited;
    let permission = '';
    if(jMs.ms_permission == 0){
        permission = 'PMS_OPEN';
    }else{
        permission = 'PMS_PERMISSION';
    }
    return new ModelService(oid, name, type, url, pid, mid, registered, des, version, platform, deployTime, img, deployorname, deployoremail, status, limit, permission, ip, port);
}

ModelService.prototype.refresh = function () {
    let self = this;
    let url = self.getBaseURL() + 'modelser/json/' + self.id;

    return HttpRequest.request_get_json(url, null)
        .then((body) => {
            let data = JSON.parse(body);
            if (data.result == 'suc') {
                let jMs = data.data;
                self.status = jMs.ms_status;
                self.limit = jMs.ms_limited;
                self.permission = jMs.ms_permission;
                return Promise.resolve(jMs);
            } else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        })
}

//basic get function(maybe no need)
ModelService.prototype.getServiceOID = function () {
    return this.id;
}

ModelService.prototype.getServiceName = function () {
    return this.name;
}

ModelService.prototype.getServiceType = function () {
    return this.type;
}

ModelService.prototype.getServiceDetailURL = function () {
    return this.url;
}

ModelService.prototype.getServicePid = function () {
    return this.pid;
}

ModelService.prototype.getServiceMid = function () {
    return this.mid;
}

ModelService.prototype.getServiceRegister = function () {
    return this.registered;
}

ModelService.prototype.getServiceDescription = function () {
    return this.description;
}

ModelService.prototype.getServiceVersion = function () {
    return this.version;
}

ModelService.prototype.getServicePlatform = function () {
    return this.platform;
}

ModelService.prototype.getDeploymentTime = function () {
    return this.deploytime;
}

ModelService.prototype.getServiceStatus = function () {
    return this.status;
}

ModelService.prototype.getServiceLimitation = function () {
    return this.limit;
}

module.exports = ModelService;
