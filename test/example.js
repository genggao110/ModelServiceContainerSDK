let Server = require('../src/server');

let server = new Server('127.0.0.1', 8060);

let access = server.getServiceAccess();

access.getModelServicesList()
      .then(ms =>{
          let list_ms = ms;
          for(let i = 0; i < list_ms.length; i++){
              let item = list_ms[i];
              console.log('ID: ' + item.id + " - Name: " + item.name + " - Type: " + item.type);
          }
      })
      .catch(err =>{
          console.log('Error');
      })