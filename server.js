const express = require('express');
const app = express();
const request = require('request');
const _ = require('lodash');
const bodyParser = require('body-parser');


const accountSid = process.env.SID;
const authToken = process.env.SID;
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));



app.post('/incoming', (req, res) => {
  const twiml = new MessagingResponse();
  console.log(req.body)
  if (req.body.Body.toLowerCase().trim() != "hi" && req.body.Body.toLowerCase().trim() != "hello" && req.body.Body.toLowerCase().trim() != "test" && req.body.Body.toLowerCase().trim() != "help") {
    request('https://googledictionaryapi.eu-gb.mybluemix.net/?define=' + req.body.Body, function (error, response, body) {
      body = JSON.parse(body.trim())
      console.log('body:', body["word"]);
      var example;
      var define;
      var synonyms; 
      if (_.has(body, 'meaning.adjective') === true) {
        define = body[0]["meaning"]["adjective"][0]["definition"]
        example = body[0]["meaning"]["adjective"][0]["example"]
        synonyms = body[0]["meaning"]["adjective"][0]["synonyms"]

      } else if (_.has(body, 'meaning.noun') === true) {

        define = body[0]["meaning"]["noun"][0]["definition"]
        example = body[0]["meaning"]["noun"][0]["example"]
        synonyms = body[0]["meaning"]["noun"][0]["synonyms"]



      } else if (_.has(body, 'meaning.verb') === true) {
        define = body[0]["meaning"]["verb"][0]["definition"]
        example = body[0]["meaning"]["verb"][0]["example"]
        synonyms = body[0]["meaning"]["verb"][0]["synonyms"]


      } else {
        console.log("Sorry, No Result Found !");
      }

      


      var msg = twiml.message(`*${body[0]["word"]}*

*Definition:* ${define}

 *Example:*  ${example}

 *Synonmys:*  ${synonyms.join(', ')}`);
      res.writeHead(200, {
        'Content-Type': 'text/xml'
      });
      res.end(twiml.toString());
    });
  } else {
    var msg = twiml.message(`Hey 👋

I am your Whatsapp Word Assistant (WWA) -a wordtastic bot which helps you with the meaning of any word, right within Whatsapp.

Try it out - send me a vocabulary you want to know its meaning.
😉

Sponsored by Pronto Afrika (c) 2018.  Developed by Yusadolat
www.pronto.com.ng Leading Web/App Development Agency.`)
    res.writeHead(200, {
      'Content-Type': 'text/xml'
    });
    res.end(twiml.toString());
  }

});

app.post('/check', function (req, res) {
  console.log(req.body.Body)
});
app.get('*', function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
