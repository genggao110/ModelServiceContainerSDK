let mShow = require('../index');
let HttpRequest = require('../src/utils');
let Server = require('../src/server');


let server = new Server('127.0.0.1', 8060);
let access = server.getServiceAccess();
let filepath = 'E:\\NativeTest\\TestData\\TouchAir\\input.xml';
let tag = 'input.xml';
let pDataconfig;
access.uploadDataByFile(filepath, tag)
    .then((data) => {
        if (data.id !== null) {
            console.log('TouchAir - Data ID : ' + data.id);
            pDataconfig = access.createDataConfig();
            pDataconfig.insertData('aa00cced-60e7-48a5-90d2-f91ac08b624d', 'InputData', data.id);
            //return access.getModelServiceByOID('5aab9a194290c617a88f347b')
            return access.getModelServicesList()
        }
    })
    .then(function (ms) {
        let list_ms = ms;
        for (var i = 0; i < list_ms.length; i++) {
            item = list_ms[i];
            console.log('ID: ' + item.id + " - Name: " + item.name + " - Type:" + item.type);
        }
        return access.getModelServiceByOID('5aab9a194290c617a88f347b')
    })
    .then(function (pMservice) {
        //调用模型
        return pMservice.invoke(pDataconfig);
    })
    .then(function (recordid) {
        console.log(recordid);
        console.log('Invoke successfully! Model service Record ID is: ', recordid);
        return access.getModelServiceRecordByID(recordid)
    })
    .then(function (record) {
        let msrstatus = record.getStatus();
        console.log(msrstatus);
        //模型服务运行记录信息refresh  to do (Promise + While循环)
        let TIME_STEP = 1000;
        // let count = 0;
        let polling = () => {
            record.refresh()
                .then(status => {
                    if (status !== null) {
                        msrstatus = record.getStatus();
                        if (msrstatus === 1) {
                            console.log('TouchAir model has been finished');
                            let list_logs = record.getLogs();
                            //to do for test
                            for(let j = 0; j < list_logs.length; j++){
                                if(list_logs[j] === null) continue;
                                let logs_temp = list_logs[j];
                                console.log(logs_temp.getType() + ' - ' + logs_temp.getState() + ' - ' + logs_temp.getEvent() + ' - ' + logs_temp.getMessage());
                            }
                        }
                        else {
                            setTimeout(function () {
                                polling();
                            }, TIME_STEP);
                        }
                    } else {
                        console.log('refresh model service record failed, please check and request one more!')
                    }

                })
                .catch(e => {
                    console.log(e);
                })
        }

        polling();

     })
    .catch((err) => {
            console.log('Error');

        })

