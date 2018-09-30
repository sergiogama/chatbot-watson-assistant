//This section will be used to create entities, intents from requests, the request can also be used as templates for other purposes.
var app = require('express')(),
    Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request'), {
        multiArgs: true
    });

var yourUrl = "";// url for request goes here.


// If you will make only one request, just use the function callback with the request.

// Only ONE request.
app.get('/create', function(req, res){
    var options = {
        url: yourUrl,
        headers: {
            Accept: 'text/json'
        }
    };
    
    function callback(error, response, body){
        if(!error && response.statusCode == 200){
            var info = JSON.parse(body);
            console.log(info);// Your response is logged here.
        }
    }
    request(options, callback);
    
});

// If you will make more than one request, use the function below;

//app.get('/create', function(req, res){
//    var options = {
//        url: yourUrl,
//        headers: {
//            Accept: 'text/json'
//        }
//    };
//    
//    var urlList = ["url1","url2","..."];
//    
//    Promise.map(urlList, function(url){
//        return request.getAsync(url).spread(function (response, body){
//            return [JSON.parse(body), url];
//        });
//    }).then(function (results){
//        console.log(JSON.stringify(results));
//    }).catch(function (err){
//        console.log(err);
//    })
//})