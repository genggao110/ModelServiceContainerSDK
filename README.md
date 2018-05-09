# ModelServiceContainer - SDK

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

The Model Service Container Sdk using Javascript, the main function of it is that offering one method to get model service resource !

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install modelservicesdk
```

## Examples

### Simple example

```js
let Server = require('modelservicesdk');
let server = new Server('127.0.0.1', 8060);
let access = server.getServiceAccess();
access.getModelServicesList()
   .then(ms =>{
    let list_ms = ms;
    for (let i = 0; i < list_ms.length; i++) {
        item = list_ms[i];
        console.log('ID: ' + item.id + " - Name: " + item.name + " - Type:" + item.type);
    }
   })
   .catch(err =>{
    console.log('Error');
   })

```

### Complex example

```js
var Server = require('modelservicesdk');
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
        let TIME_STEP = 1000;
        let polling = () => {
            record.refresh()
                .then(status => {
                    if (status !== null) {
                        msrstatus = record.getStatus();
                        if (msrstatus === 1) {
                            console.log('TouchAir model has been finished');
                            let list_logs = record.getLogs();
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
```

## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/parseurl.svg
[npm-url]: https://npmjs.org/package/modelservicesdk
[node-version-image]: https://img.shields.io/node/v/parseurl.svg
[node-version-url]: http://nodejs.org/download/
[travis-image]: https://img.shields.io/travis/pillarjs/parseurl/master.svg
[travis-url]: https://travis-ci.org/pillarjs/parseurl
[coveralls-image]: https://img.shields.io/coveralls/pillarjs/parseurl/master.svg
[coveralls-url]: https://coveralls.io/r/pillarjs/parseurl?branch=master
[downloads-image]: https://img.shields.io/npm/dm/parseurl.svg
[downloads-url]: https://npmjs.org/package/parseurl
