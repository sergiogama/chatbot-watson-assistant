/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    fs = require('fs')
var cfenv = require('cfenv');

var chatbot = require('./config/bot.js');


var app = express();

var fileToUpload;

var dbCredentials = {
    dbName: 'my_sample_db'
};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.get('/', routes.chat);

// =====================================
// WATSON CONVERSATION FOR ANA =========
// =====================================
app.post('/api/watson', function (req, res) {
    processChatMessage(req, res);
}); // End app.post 'api/watson'

function processChatMessage(req, res) {
    chatbot.sendMessage(req, function (err, data) {
        if (err) {
            console.log("Error in sending message: ", err);
            res.status(err.code || 500).json(err);
        }
        else {
//            Logs.find({
//                selector: {
//                    'conversation': data.context.conversation_id
//                }
//            }, function (err, result) {
//                if (err) {
//                    console.log("Cannot find log for conversation id of ", data.context.conversation_id);
//                }
//                else if (result.docs.length > 0) {
//                    var doc = result.docs[0];
//                    console.log("Sending log updates to dashboard");
                    //console.log("doc: ", doc);
//                    io.sockets.emit('logDoc', doc);
//                }
//                else {
//                    console.log("No log file found.");
//                }
//            });
            var context = data.context;
//            var owner = req.user.username;
            res.status(200).json(data);
        }
    });
}

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
