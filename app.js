var express = require('express'),
 http = require('http'),
 axios = require('axios'),
 path = require("path");

let FLOW_URL = "REPLACE_ME_WITH_WEBHOOK_URL";

let PORT = 3000;
let API_URL = "https://customer-education.postmanlabs.com/workshops/flows";
let DEMO_API_KEY = 1234;


var app = express();
var server = http.createServer(app);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

//Climatize
app.post('/climatize', async(req,res)=>{   

    var payload = JSON.stringify({
        "vin": req.body.vin,
        "temperature": req.body.temp
    })

    var conf = {
        method: 'post',
        url: FLOW_URL,
        timeout: 8000,
        headers: { 
          'X-API-Key': DEMO_API_KEY
        },
        data: payload
      };
  
      try {
        var resp = await axios(conf);
        res.send("Vehicle climatization has started!");  
      } catch (error) {
        console.log(error);
        if(error.response.status == 404) {
            res.send("Vehicle not found.");
        } else {
            console.log(error);
            res.send("Something went wrong");
        }
      }     
});

//Create
app.post('/create', async(req,res)=>{

  var payload = JSON.stringify({
      "running": req.body.status == "on",
      "temperature": req.body.temp
  })

  var conf = {
      method: 'post',
      url: API_URL + '/vehicles/',
      timeout: 8000,
      headers: { 
        'X-API-Key': DEMO_API_KEY,
        'Content-Type': "application/json"
      },
      data: payload
    };

    try {
      var resp = await axios(conf);
      res.send(resp.data);  
    } catch (error) {
      console.log(error);
      if(error.response.status == 404) {
          res.send("Vehicle was not created.");
      } else {
          console.log(error);
          res.send("Something went wrong");
      }
    }     
});


//Engine
app.post('/engine', async(req,res) => {
    var conf = {
        method: 'get',
        url: API_URL + '/vehicles/' + req.body.vin + '/engine/status',
        timeout: 8000,
        headers: { 
          'X-API-Key': DEMO_API_KEY
        }
      };
  
      try {
        var resp = await axios(conf);
        res.send(resp.data);
      } catch (error) {
        console.log(error);
        if(error.response.status == 404) {
            res.send("Vehicle not found.");
        } else {
            console.log(error);
            res.send("Something went wrong");
        }
      }        
});

//Climate
app.post('/climate', async(req,res) => {
    var conf = {
        method: 'get',
        url: API_URL + '/vehicles/' + req.body.vin + '/interior/climate',
        timeout: 8000,
        headers: { 
          'X-API-Key': DEMO_API_KEY
        }
      };
  
      try {
        var resp = await axios(conf);
        res.send(resp.data);
      } catch (error) {
        console.log(error);
        if(error.response.status == 404) {
            res.send("Vehicle not found.");
        } else {
            console.log(error);
            res.send("Something went wrong");
        }
      }        
});

//Engine On
app.post('/engine_status', async(req,res) => {
  if(req.body.status == "on") {
    var URL_END =  '/engine/start';
  } else {
    var URL_END =  '/engine/stop';
  }

  var conf = {
      method: 'get',
      url: API_URL + '/vehicles/' + req.body.vin + URL_END,
      timeout: 8000,
      headers: { 
        'X-API-Key': DEMO_API_KEY
      }
    };

    try {
      var resp = await axios(conf);
      res.send(resp.data);
    } catch (error) {
      console.log(error);
      if(error.response.status == 404) {
          res.send("Vehicle not found.");
      } else {
          console.log(error);
          res.send("Something went wrong");
      }
    }        
});

server.listen(PORT, () => { 
    console.log("Server listening on port: 3000");
});