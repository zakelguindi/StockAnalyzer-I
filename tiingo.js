// // API Token: f6fa8e981fe1642c429672a85ea5244489401ebc
var WebSocket = require('ws');
var ws = new WebSocket('wss://api.tiingo.com/test');

var subscribe = {
        'eventName':'subscribe',
        'eventData': {
                        'authToken': 'f6fa8e981fe1642c429672a85ea5244489401ebc'
                    }
        }
ws.on('open', function open() {
    ws.send(JSON.stringify(subscribe));
});

ws.on('message', function(data, flags) {
    console.log(data)
});

var request = require('request');
var requestOptions = {
        'url': 'https://api.tiingo.com/api/test?token=f6fa8e981fe1642c429672a85ea5244489401ebc',
        'headers': {
            'Content-Type': 'application/json'
            }
        };

request(requestOptions,
        function(error, response, body) {
            console.log(body);
        }
);        

// var request = require('request');
var requestOptions = {
    'url': 'https://api.tiingo.com/tiingo/daily/aapl/prices?startDate=2019-01-02&token=f6fa8e981fe1642c429672a85ea5244489401ebc',
    'headers': {
        'Content-Type': 'application/json'
        }
};

request(requestOptions,
    function(error, response, body) {
        console.log(body);
    }
);   

// var request = require('request');
var requestOptions = {
        'url': 'https://api.tiingo.com/tiingo/daily/aapl?token=f6fa8e981fe1642c429672a85ea5244489401ebc',
        'headers': {
            'Content-Type': 'application/json'
            }
        };

request(requestOptions,
        function(error, response, body) {
            console.log(body);
        }
);    