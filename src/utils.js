let request = require('request-promise');


function HttpHelper() {};
module.exports = HttpHelper;

HttpHelper.request_get_json = function(url,form){
    let options = {
        uri: url,
        method:'GET',
        qs:form,
        resolveWithFullResponse: false
    };

    return request(options);
         
}

HttpHelper.request_postwithform_json = function(url,body,type){
    let options = {
        uri:url,
        method:'POST',
    };
    if(type === 'JSON'){
        options.body = body;
        options.json = true;
        options.headers = {
            'content-type': 'application/json'
        };
    }else if (type === 'Form'){
        options.form = body;
        options.headers = {
            'content-type': 'application/x-www-form-urlencoded'
        };
    }else if (type === 'File'){
        options.formData = body;
        options.headers = {
            'content-type': 'multipart/form-data'
        };
    }
  //返回一个promise对象
    return request(options);
}

HttpHelper.request_put_json = function(url,form){
    let options = {
        uri: url,
        method:'PUT',
        qs:form,
        resolveWithFullResponse: false
    };

    return request(options);
}