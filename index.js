const express = require('express');
const path = require("path")
const multer = require("multer");
var upload = multer({ dest: 'uploads/' });

const app = express();


app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log("Request recieved for" + req.path);
  next();
})

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

app.post("/upload", upload.any(), function(req, res, next) {

  // console.log('--singolo--');
  // console.log(req.file, req.body);
  console.log('--headers--');
  console.log(req.headers);
  console.log('--body--');
  console.log(req.body);
  console.log('--files--');
  console.log(req.files);
  res.send({"status" : "success", "msg": "Success, data uploaded!"});

  // Verifica 1 controllo esistenza dei seguenti campi
  // rr-token : token di autorizzazione
  // rr-hash  : calcolo hash del form

  // VERIFICA esistenza token se la richiesta è permessa

  // VERIFICHE integrità della richiesta
  // se vi sono files allora calcolo hash e controllo
  // calcolo hash dei dati e Verifica
  
  // VERIFICA esistenza

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

/*
var upload = multer({  
    storage: storage, 
    limits: { fileSize: maxSize }, 
    fileFilter: function (req, file, cb){ 
    
        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/; 
        var mimetype = filetypes.test(file.mimetype); 
  
        var extname = filetypes.test(path.extname( 
                    file.originalname).toLowerCase()); 
        
        if (mimetype && extname) { 
            return cb(null, true); 
        } 
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes); 
      }  
  
// mypic is the name of file attribute 
}).single("mypic");     
*/

/*
    
app.post("/upload11",function (req, res, next) { 
        
    // Error MiddleWare for multer file upload, so if any 
    // error occurs, the image would not be uploaded! 
    upload(req,res,function(err) { 
  
        if(err) { 
  
            // ERROR occured (here it can be occured due 
            // to uploading image of size greater than 
            // 1MB or uploading different file type) 
            res.send(err) 
        } 
        else { 
  
            // SUCCESS, image successfully uploaded 
            res.send("Success, Image uploaded!") 
        } 
    }) 
});
*/


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

const cM = require('./customValidator');
const fD = require('./fakeData');
console.log(fD.getF());

var fl = fD.getF();
fl.forEach((item) => {
  item.hash = cM.buildHash(item.path);
  item.file_size = cM.getFileSize(item.path);
});

console.log(fl);

console.log('Inviare ai controlli');