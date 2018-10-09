/**
 * This file contains all of the web and hybrid functions for interacting with
 * Ana and the Watson Conversation service. When API calls are not needed, the
 * functions also do basic messaging between the client and the server.
 *
 * @summary   Functions for Ana Chat Bot.
 *
 * @link      cloudco.mybluemix.net
 * @since     0.0.3
 * @requires  app.js
 *
 */
 // assistant name goes here.

// load local VCAP configuration

var workspace_id;
var watson = require('watson-developer-cloud');

// =====================================
// CREATE THE SERVICE WRAPPER ==========
// =====================================
// Create the service wrapper - Assistant
// Com username e password
var assistant = new watson.AssistantV1({
     username: "<username>"
    , password: "<password>"
  , version: '2018-09-20'
});
// Com API Key
/*
var assistant = new watson.AssistantV1({
    iam_apikey: '<API Key>',
    version: '2018-09-20',
    url: 'https://gateway-wdc.watsonplatform.net/assistant/api'
});
*/
    // check if the workspace ID is specified in the environment
    workspace_id = "<workspace_id>";
    // if not, look it up by name or create one
// Allow clients to interact

var chatbot = {
    sendMessage: function (req, callback) {
//        var owner = req.user.username;
        buildContextObject(req, function (err, params) {
                if (err) {
                    console.log("Error in building the parameters object: ", err);
                    return callback(err);
                }
                if (params.message) {
                    var conv = req.body.context.conversation_id;
                    var context = req.body.context;
                    var res = {
                        intents: []
                        , entities: []
                        , input: req.body.text
                        , output: {
                            text: params.message
                        }
                        , context: context
                    };
                    //                chatLogs(owner, conv, res, () => {
                    //                    return 
                    callback(null, res);
                    //                });
                }
                else if (params) {
                    // Send message to the watson assistant service with the current context
                    assistant.message(params, function (err, data) {
                            if (err) {
                                console.log("Error in sending message: ", err);
                                return callback(err);
                            } else {
                                
                            var conv = data.context.conversation_id;
                            console.log("Got response from Ana: ", JSON.stringify(data));
//                            if (data.context.system.dialog_turn_counter > 1) {
//                                chatLogs(owner, conv, data, () => {
//                                    return callback(null, data);
//                                });
//                            }
//                            else {
                                return callback(null, data);
//                            }
                        }
                    });
            }
        });
}
};
// ===============================================
// LOG MANAGEMENT FOR USER INPUT FOR ANA =========
// ===============================================
function chatLogs(owner, assistant, response, callback) {
    console.log("Response object is: ", response);
    // Blank log file to parse down the response object
    var logFile = {
        inputText: ''
        , responseText: ''
        , entities: {}
        , intents: {}
    , };
    logFile.inputText = response.input.text;
    logFile.responseText = response.output.text;
    logFile.entities = response.entities;
    logFile.intents = response.intents;
    logFile.date = new Date();
    var date = new Date();
    var doc = {};
    Logs.find({
        selector: {
            'assistant': assistant
        }
    }, function (err, result) {
        if (err) {
            console.log("Couldn't find logs.");
            callback(null);
        }
        else {
            doc = result.docs[0];
            if (result.docs.length === 0) {
                console.log("No log. Creating new one.");
                doc = {
                    owner: owner
                    , date: date
                    , assistant: assistant
                    , lastContext: response.context
                    , logs: []
                };
                doc.logs.push(logFile);
                Logs.insert(doc, function (err, body) {
                    if (err) {
                        console.log("There was an error creating the log: ", err);
                    }
                    else {
                        console.log("Log successfull created: ", body);
                    }
                    callback(null);
                });
            }
            else {
                doc.lastContext = response.context;
                doc.logs.push(logFile);
                Logs.insert(doc, function (err, body) {
                    if (err) {
                        console.log("There was an error updating the log: ", err);
                    }
                    else {
                        console.log("Log successfull updated: ", body);
                    }
                    callback(null);
                });
            }
        }
    });
}
// ===============================================
// UTILITY FUNCTIONS FOR CHATBOT AND LOGS ========
// ===============================================
/**
 * @summary Form the parameter object to be sent to the service
 *
 * Update the context object based on the user state in the watson assistant and
 * the existence of variables.
 *
 * @function buildContextObject
 * @param {Object} req - Req by user sent in POST with session and user message
 */
function buildContextObject(req, callback) {
    var message = req.body.text;
//    var userTime = req.body.user_time;
    var context;
    if (!message) {
        message = '';
    }
    // Null out the parameter object to start building
    var params = {
        workspace_id: workspace_id
        , input: {}
        , context: {}
    };

    
    if (req.body.context) {
        context = req.body.context;
        params.context = context;
    }
    else {
        context = '';
    }
    // Set parameters for payload to Watson Assistant
    params.input = {
        text: message // User defined text to be sent to service
    };
    // This is the first message, add the user's name and get their healthcare object
//    if ((!message || message === '') && !context) {
//        params.context = {
//            fname: req.user.fname
//            , lname: req.user.lname
//        };
//    }
    return callback(null, params);
}
module.exports = chatbot;
