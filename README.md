# Exemplo de Chatbot com Watson Assistant em Node.js

Este aplicação é um demo de cliente de Chatbot em Node.js que utiliza Watson Assistant. Basta criar um Watson Assistant, colocar as credenciais neste app e fazer o deploy no Bluemix. (Exemplo de criação de Watson Assistant no arquivo: https://github.com/sergiogama/chatbot-watson-assistant/blob/master/TUTORIAL%20ChatBot.pdf).

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/sergiogama/chatbot-watson-assistant)

OU

## Para executar o app localmente

1. [Instalar Node.js][]
+ cd no diret'roio raiz do projeto
+ Execute `npm install` para instalar as dependências do app
+ Altere o aquivo config/bot.js e coloque as credenciais e workspace_id do Watson Assistant nas lilnhas à seguir:
    
    * iam_apikey = "<API_Key>";
    * workspace_id = "<workspace_id>";

+ Execute `npm start` para o iniciar o app
+ Acesse a aplicação no browser no link <http://localhost:6001>

[Instale Node.js]: https://nodejs.org/en/download/
"# Conversation-demo" 
