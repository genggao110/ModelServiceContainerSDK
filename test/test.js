let mShow = require('../index');
let HttpRequest = require('../src/utils');
let Server = require('../src/server');


let server = new Server('127.0.0.1', 8060);
var access = server.getServiceAccess();

// access.getModelServicesList()
//     .then(function (data) {
//         var list_ms = data;
//         for (var i = 0; i < list_ms.length; i++) {
//             item = list_ms[i];
//             console.log('ID: ' + item.id + " - Name: " + item.name + " - Type:" + item.type);
//         }
//         // return new Promise(function(resolve,reject){
//         //     let TouchAirModelID = list_ms[2].id;

//         // })
//     })
//     .catch(function(err){
//         console.log(err);
//     });
let filepath = 'E:\\NativeTest\\TestData\\TouchAir\\input.xml';
let tag = 'input.xml';
var pDataconfig;
access.uploadDataByFile(filepath,tag)
      .then((data) =>{
          if(data.id !== null){
              console.log('TouchAir - Data ID : ' + data.id);
              pDataconfig = access.createDataConfig();
              pDataconfig.insertData('aa00cced-60e7-48a5-90d2-f91ac08b624d','InputData',data.id);
              return access.getModelServiceByOID('5aab9a194290c617a88f347b')
          }
      })
      .then(function(pMservice){
        return pMservice.invoke(pDataconfig);
      })
      .then(function(recordid){
          console.log(recordid);
          console.log('Invoke successfully! Model service Record ID is: ',recordid);
      })
      .catch((err) =>{
          console.log('Error');

      })

