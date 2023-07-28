require("dotenv").config();
const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.json());


const { TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");


const bodyParser = require('body-parser');
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}))


const port = process.env.PORT || 5000;

app.get('/',(req,res)=>{
  res.send("Hello World");  
})

const MODEL_NAME = "models/text-bison-001";
const API_KEY = "AIzaSyDIYhcti3wq0CUt9jHK_UsA6ku4SKomhoc";

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});


app.post('/write/:document', (req, res) => {
  try{
    
      const promptString = `Write e well formatted, eye-catchy long lengthy ${req.params.document} about ${req.body.question}`;
      const stopSequences = [];

client.generateText({
  // required, which model to use to generate the result
  model: MODEL_NAME,
  // optional, 0.0 always uses the highest-probability result
  temperature: 0,
  // optional, how many candidate results to generate
  candidateCount: 1,
  // optional, number of most probable tokens to consider for generation
  top_k: 40,
  // optional, for nucleus sampling decoding strategy
  top_p: 0.95,
  // optional, maximum number of output tokens to generate
  max_output_tokens: 1024,
  // optional, sequences at which to stop model generation
  stop_sequences: stopSequences,
  // optional, safety settings
  safety_settings: [{"category":"HARM_CATEGORY_DEROGATORY","threshold":1},{"category":"HARM_CATEGORY_TOXICITY","threshold":1},{"category":"HARM_CATEGORY_VIOLENCE","threshold":2},{"category":"HARM_CATEGORY_SEXUAL","threshold":2},{"category":"HARM_CATEGORY_MEDICAL","threshold":2},{"category":"HARM_CATEGORY_DANGEROUS","threshold":2}],
  prompt: {
    text: promptString,
  },
}).then(result => {
      res.json(result[0]?.candidates[0]?.output); // the ?. operator checks if the value is undefined or not. If it is found undefined then it stops and sends empty string
});
}
catch(e){
  res.json("fail");
}
});
        

  
  server.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })