const express = require('express');
const path = require("path")
const multer = require("multer");
var upload = multer({ dest: 'uploads/' });
const app = express();
const moment = require('moment');
var momentTZ = require('moment-timezone');

const cV = require('./customValidator');
const fD = require('./fakeData');

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  console.log("Request recieved for" + req.path);
  next();
})

/**
 * Ritorna al client l'url per l'autenticazione e salva uuid nell'elenco
 * delle autorizzazioni per verificare poi se il ritorno dal gateway è
 * partito da una richiesta
 * 
 */
app.get('/getGatewayUrl', function(req, res) {
    console.log('getGatewayUrl');
    const uuid = require('uuid');
    var uuidStr = uuid.v4();
    var sToReturn = 'demo2' + ";" + uuidStr;
    let iv = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
      // iv = 'FAKEIV1234567890';
    var dataEncrypted = cV.encryptStringWithAES_64(sToReturn, iv);
    var msg = {};
    msg.token = cV.createJWT(uuidStr, "secret");
    msg.url = 'https://autenticazione.comune.rimini.it/gw-authFAKE.php' + '?appId=' + 'demo2' + '&data=' + iv + dataEncrypted;
    
        
    res.send(msg);
});

app.get('/landingFromGateway', function (req, res) {
  console.log('landingFromGateway');
  console.log(req.query.data);
  if(req.query.data) {
    var data2decrypt = (req.query.data).substring(16);
    var dataIV = (req.query.data).substring(0,16);
    var dataDecrypted = cV.decryptStringWithAES_64(data2decrypt, dataIV);
    console.log(dataDecrypted); 
    var dataSplitted  = dataDecrypted.split(";");
    var userData = {};

    userData.transactionId = dataSplitted[0];
    userData.nameId = dataSplitted[1];
    userData.authenticationMethod = dataSplitted[2];
    userData.authenticatingAuthority = dataSplitted[3];
    userData.spidCode = dataSplitted[4];
    userData.policyLevel = dataSplitted[5];
    userData.trustLevel = dataSplitted[6];
    userData.userId = dataSplitted[7];
    userData.codiceFiscale = dataSplitted[8];
    userData.nome = dataSplitted[9];
    userData.cognome = dataSplitted[10];
    userData.dataNascita = dataSplitted[11];
    userData.luogoNascita = dataSplitted[12];
    userData.statoNascita = dataSplitted[13];
    // res.send('data recieved! redirecting...');
    res.redirect("https://angular-formly-ngx-custom-validation.stackblitz.io/json/radio");
  } else {
    res.send('no valid data!');
  }
});
        
app.get('/', (req, res) => {
  res.send(
    `
 <!DOCTYPE html> 
<html> 
  
<head> 
    <title>FILE UPLOAD DEMO</title> 
</head> 
  
<body> 
    <h1>Single File Upload Demo</h1> 
   
    <form action="/upload" 
      enctype="multipart/form-data" method="POST"> 
      
<input type="text1" name="text1" value="text1" /> <br>
<input type="text2" name="text2" value="text2" /> <br>

        <input type="file" name="mypic1" /> <br> 
        <input type="file" name="mypic2" /> <br> 
        <input type="submit" value="submit">  
    </form> 

<h1>Get gateway url</h1>
        <form action="/getGatewayUrl" 
       method="GET"> 
      
<input type="text1" name="text1" value="text1" /> <br>

        <input type="submit" value="submit">  
    </form>
</body> 
  
</html> 
`)
});

/*
  nome del servizio (da lista) serve ?
  azione (da lista)
  apiKey per accedere ad un determinato servizio (
    - utente
    - metodi da poter chiamare ...
  )
  dati

  controllo generico su corretta request
  controllo autenticazione/autorizzazione
  controllo della richiesta
  caricamento servizio

*/

app.post("/microServiceMgr", function(req, res, next) {
  console.log('--headers--');
  console.log(req.headers);
  console.log('--body--');
  console.log(req.body);
  console.log('--files--');
  console.log(req.files);
  res.send({"status" : "success", "msg": "Success!"});
});

app.get("/info", function(req, res, next) {
  console.log('--headers--');
  console.log(req.headers);
  console.log('--body--');
  console.log(req.body);
  console.log('--files--');
  console.log(req.files);
  res.send({"status" : "success", "msg": "Success, data recieved!"});
});

app.post( "/upload/:formName", 
          upload.any(), 
          function(req, res, next) {

  // console.log('--singolo--');
  // console.log(req.file, req.body);

  console.log('###################################');
  console.log('--headers--');
  console.log(req.headers);
  console.log('--params--');
  console.log(req.params);
  console.log('--body--');
  console.log(req.body);
  console.log('--files--');
  console.log(req.files);

  var environmentConfig = fD.getEnv();
  var uploadData = req.body;
  var uploadFiles = req.files;
  var configForm = {};
  var configOptions = {};

  
  // Controlla che il formName sia valido ed esista
  if (cV.formNameIsValidAndExists(req.params.formName)) {
    console.log('formName valid loading data');
    // fake loading data
    configForm = fD.getF();
    configOptions = fD.getO();
  } else {
    console.log('no formName');
    res.status(500).send({"status" : "error", "msg": "no form Name"});
  }

  // Verifica 1 controllo esistenza dei seguenti campi
  // rr-token : token di autorizzazione
  // rr-hash  : calcolo hash del form
  // verifica esistenza token e sua validità temporale

  var sC = cV.getSecurityContextExistsIfValid(uploadData);
  if(Object.keys(sC).length != 0) {
    console.log('security context:');
    console.log(sC);
  } else {
    console.log('no security context');
    res.send({"status" : "error", "msg": "no security context"});
    return;
  }

  // remove securityContext from data
  delete uploadData.securityContext;

  // controlla gli hash dei files e dei dati 
  if (cV.checkDataIntegrity(uploadData, uploadFiles, configForm, sC)) {
    console.log('integrity ok!');
  } else {
    console.log('integrity error');
  }

  // get local_securityContext
  // recupera se esiste il local security context
  var lsC = cV.getLocalSecurityContext(sC, environmentConfig);
   if(Object.keys(lsC).length != 0) {
    console.log('local security context:');
    console.log(lsC);
  } else {
    console.log('no local security context');
    res.send({"status" : "error", "msg": "no security context"});
    return;
  }


  // verifica valore svgCaptha 
  if (cV.checkSvgCapthca(uploadData, lsC)) {
    console.log('checkSvgCapthca ok');
  } else {
    console.log('checkSvgCapthca error');
    res.send({"status" : "error", "msg": "no checkSvgCapthca error"});
    return;
  }

  // verifica tipo e valore dei dati/files passati con i vari customValidator e configurazione
  if (cV.checkDataTypeAndValue(uploadData, uploadFiles, configForm, configOptions)) {
       console.log('checkDataTypeAndValue ok');
  } else {
        console.log('checkDataTypeAndValue error');
    res.send({"status" : "error", "msg": "no checkDataTypeAndValue error"});
    return;
  }

  //FINALMENTE IL DATO PUO' ESSERE PROCESSATO 

  // VERIFICHE integrità della richiesta
  // se vi sono files allora calcolo hash e controllo
  // calcolo hash dei dati e Verifica
  // if (cV.checkRequestIntegrity(uploadData, uploadFiles, ))
  
  // VERIFICA svgCaptha

   res.send({"status" : "success", "msg": "Success, data uploaded!"});

});



// var upload = multer({ dest: "Upload_folder_name" }) 
// If you do not want to use diskStorage then uncomment it 

var storage = multer.diskStorage({
  destination: function(req, file, cb) {

    // Uploads is the Upload_folder_name 
    cb(null, "uploads")
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg")
  }
});

// Define the maximum size for uploading 
// picture i.e. 1 MB. it is optional 
const maxSize = 1 * 1000 * 1000;



app.listen(3000, () => {
  console.log('server started');
});


// esecuzione

var files =

[
  {
    fieldname: 'documento2',
    originalname: 'Bando_di_concorso_ISTRUTTORE_DIR_INFORMATICO_per_firma.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    destination: 'uploads/',
    filename: '31784cb39200913dd819fa93e19fa260',
    path: 'uploads/31784cb39200913dd819fa93e19fa260',
    size: 361323
  }
];

/*
console.log(fD.getF());

var fl = fD.getF();
fl.forEach((item) => {
  item.hash = cV.buildHash(item.path);
  item.file_size = cV.getFileSize(item.path);
});

console.log(fl);
*/

console.log('Inviare ai controlli');
console.log(moment().toISOString());
console.log(moment().unix());
console.log(momentTZ().tz("Europe/Rome").format());