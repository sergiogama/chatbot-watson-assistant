//var isOpen = false;
//function popupToggle(){
//    var popup = document.getElementById("chat-popup");
//    if(isOpen){
//        popup.style.animationName = "popup_close";
//        isOpen = false;
//    }else{
//        popup.style.animationName = "popup_open";
//        isOpen = true;
//    }
//}

$(document).ready(function () {
    var isOpen = false;
    $('.chat-header').click(function () {
        if (isOpen) {
            isOpen = false;
            $('.chat-popup').css({
                "animation-name": "popup_close"
            });
            $('.chat-body').css({
                "animation-name": "hide_chat"
            });
            $('.chat-footer').css({
                "animation-name": "hide_chat"
            });
        }
        else {
            isOpen = true;
            $('.chat-popup').css({
                "animation-name": "popup_open"
            });
            $('.chat-body').css({
                "animation-name": "show_chat"
            });
            $('.chat-footer').css({
                "animation-name": "show_chat"
            });
        }
    });
});


var params = {},
    watson = 'Watson',
    context;

function userMessage(message) {
    
    params.text = message;
    if (context) {
        params.context = context;    
    }
    var xhr = new XMLHttpRequest();
    var uri = '/api/watson';
    xhr.open('POST', uri, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Verify if there is a success code response and some text was sent
        if (xhr.status === 200 && xhr.responseText) {
            var response = JSON.parse(xhr.responseText);
            context = response.context; // Store the context for next round of questions
            console.log("Got response from Watson: ", JSON.stringify(response));
            
           //Teste do Gama
           displayAssistantMessage(response,watson);
            
        }
        else {
            console.error('Server error for Conversation. Return status of: ', xhr.statusText);
            displayMessage("Putz, deu um tilt aqui. Você pode tentar novamente.", watson);
        }
    };
    xhr.onerror = function () {
        console.error('Network error trying to send message!');
        displayMessage("Ops, acho que meu cérebro está offline. Espera um minutinho para continuarmos por favor.", watson);
    };
    console.log(JSON.stringify(params));
    xhr.send(JSON.stringify(params));
}


function newEvent(event) {
    // Only check for a return/enter press - Event 13
    if (event.which === 13 || event.keyCode === 13) {
        var userInput = document.getElementById('chatInput');
        var text = userInput.value; // Using text as a recurring variable through functions
        text = text.replace(/(\r\n|\n|\r)/gm, ""); // Remove erroneous characters
        // If there is any input then check if this is a claim step
        // Some claim steps are handled in newEvent and others are handled in userMessage
        if (text) {
            // Display the user's text in the chat box and null out input box
            //            userMessage(text);
            displayMessage(text, 'user');
            userInput.value = '';
            userMessage(text);
        }
        else {
            // Blank user message. Do nothing.
            console.error("No message.");
            userInput.value = '';
            return false;
        }
    }
}


function displayMessage(text, user) {
    var chat_body = document.getElementById('chat-body');
    var bubble = document.createElement('div');
    bubble.setAttribute("class", "bubble");
    if (user === "user") {
        bubble.className += " user";
    }
    else {
        bubble.className += " watson";
    }
    bubble.innerHTML = text;
    chat_body.appendChild(bubble);
    chat_body.scrollTop = chat_body.scrollHeight;
}

// Sergio Gama - tratamento dos novos tipos do Watson Assistant
function displayAssistantMessage(response, user) {
    var chat_body = document.getElementById('chat-body');
        
    for(var x in response.output.generic)
    {

    	console.log(response.output.generic[x].response_type);
    	
    	if(response.output.generic[x].response_type === "text")
    	{
		    var bubble = document.createElement('div');
		    bubble.setAttribute("class", "bubble");
		    if (user === "user") {
		        bubble.className += " user";
		    }
		    else {
		        bubble.className += " watson";
		    }

		    bubble.innerHTML = response.output.generic[x].text;
		    chat_body.appendChild(bubble);
		    chat_body.scrollTop = chat_body.scrollHeight;
    		
    	}
    	else if(response.output.generic[x].response_type === "image")
    	{
		    var img = document.createElement('IMG');
		    img.setAttribute("class", "image");
		    img.setAttribute("src", response.output.generic[x].source);
		    if (user === "user") {
		        img.className += " user";
		    }
		    else {
		        img.className += " watson";
		    }

		    chat_body.appendChild(img);
		    chat_body.scrollTop = chat_body.scrollHeight;    		
    	}
    	//Sergio Gama - Mostrar o typing do Watson Assistant
    	else if(response.output.generic[x].response_type === "pause")
    	{
		    var pause = document.createElement('IMG');
		    pause.setAttribute("class", "icone");
		    pause.setAttribute("src", "../images/typing2.gif");
		    if (user === "user") {
		        pause.className += " user";
		    }
		    else {
		        pause.className += " watson";
		    }

		    chat_body.appendChild(pause);
		    chat_body.scrollTop = chat_body.scrollHeight; 
		    
		    //Sergio Gama - Aguarda a pausa configurada no Watson Assistant
		    //sleep(text.output.generic[x].time.toInt()); NÃO FUNCIONA
		    //setTimeout(function wait() {return null;},text.output.generic[x].time); NÃO FUNCIONA
		    var milliseconds = response.output.generic[x].time;
		    var start = new Date().getTime();
			for (var i = 0; i < 1e7; i++) {
			    if ((new Date().getTime() - start) > milliseconds){
			      break;
			    }
            }
            
			chat_body.removeChild(pause); 
			
    	}

    }
}


userMessage('');