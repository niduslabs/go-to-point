const WebSocket = require('ws');
const uniqid = require('uniqid');
const https = require('https');

// Fill in your endpoint and token

const apiEndpoint = 'gcs.hybrid-xxxxxxxxxxx.herotech8-cloud.com';
const drone_serial_number ='DR1X-XXXX-XXXX'
const action = 'launch'
const endpoint = 'wss://'+apiEndpoint+'/api/ws'; // Your WebSocket Endpoint
const token = ''; // Your generated API token (see usage guide)
const requestTopic = 'drone/'+drone_serial_number+'/navigation/gotopoint/'+action+'/request'
const responseTopic = 'drone/'+drone_serial_number+'/navigation/gotopoint/'+action+'/response'
const _altitude = 25
const _lat = 52.070675
const _lng = -0.632049

console.log('endpoint: '+endpoint);


// Interact with the WebSocket API to launch the drone
const requestId = uniqid();

console.log('Connecting to WebSocket endpoint');

const ws = new WebSocket(endpoint, {
  rejectUnauthorized: false
});

ws.on('open', function open() {
  console.log('Connection opened to WebSocket');

  console.log('Sending identification message');

  ws.send(JSON.stringify({
    method: 'identify',
    token: token
  }));
});

var i  = 0;
ws.on('message', function message(data) {
  if (data == 'Client Setup') {
    console.log('Client Setup');
    console.log('Subscribing '+responseTopic)
    ws.send(JSON.stringify({
        method: 'subscribe',
        topic: responseTopic
      }));      
    console.log('Wait for the Data');
    ws.send(JSON.stringify({
      method: 'publish',
      topic: requestTopic,
      message: {
        altitude: _altitude,
        location: {
          lat:_lat,
          lng:_lng
        }
      }
    }));    
    return;
  }
  
  try {
    _data = JSON.parse(data);
  } catch(err) {
    console.log('Error parsing JSON data');
    return;
  }
  try {
    _msg = JSON.parse(_data.message);
  }catch(err){
    _msg = _data.message;
  }
  console.log( JSON.stringify(_msg,null,2));  
});

setInterval(function() {}, 5000);
