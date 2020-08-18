var _body = {
  capRimini: '47900',
  noTrailingSpaces: 'AABBCC',
  documento1: '7ee965fe64199e1e094de22dd87f2490a4434fef45179efa861f2f43f8e34195',
  documento2: 'e9f3f64aaa4037fdb8d3d2718003a186014ff8ebae70aaaf900d5a6a53aca603',
  svgCaptcha: '3445345'
};

var _files =

[
  {
    fieldname: 'documento1',
    originalname: 'Bando_di_concorso_ISTRUTTORE_DIR_INFORMATICO_per_firma.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    destination: 'uploads/',
    filename: 'dba168bc027c8e353c2c142113bcf2cc',
    path: 'uploads/dba168bc027c8e353c2c142113bcf2cc',
    size: 361323
  },
  {
    fieldname: 'documento2',
    originalname: 'serratura.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    destination: 'uploads/',
    filename: '626fc84cd85cc69fb3c419071a99f8d2',
    path: 'uploads/626fc84cd85cc69fb3c419071a99f8d2',
    size: 171228
  }
];

var _form = [
  {
    "key": "info1",
    "type": "html-template",
    "templateOptions": {
      "htmlTemplate" :"<h3>Test html template</h3>",
      "label": "html template label"
      }
  },
  


   {
      "key": "documento1",
      "type": "upload-italia",
      "templateOptions": {
        "required" : true,
        "label": "file1 pdf,doc,txt,svg  documento di identità in formato PDF con dimensione massima 1 MB",
        "maxFileSize" : "1024kb",
        "minFileSize" : "10kb",
        "fileExtension" : "pdf,doc,txt,svg"
      }

      ,
      "validators": {
        "validation": ["fileValidator"]
      }
    },


     {
      "key": "documento2",
      "type": "upload-italia",
      "templateOptions": {
        "required" : true,
        "label": "file2- documento di identità in formato PDF con dimensione massima 1 MB",
        "maxFileSize" : "1024kb",
        "minFileSize" : "10kb",
        "fileExtension" : "pdf,doc,t"
      }

      ,
      "validators": {
        "validation": ["fileValidator"]
      }
    },

{
    "key": "info2",
    "type": "html-template",
    "templateOptions": {
      "htmlTemplate" :"<h3>Info 3</h3>",
      "label": "html template label"
      }
  },

     {
      "key": "capRimini",
      "type": "input",
      "templateOptions": {
        "label": "cap 1 rimini",
        "required" : true
      },
       "validators": {
        "validation": ["capValidator"]
      }
    },

    {
      "key": "noTrailingSpaces",
      "type": "input",
      "templateOptions": {
        "label": "no trailing or ending space AAND default control"
      }
      ,
      "validators": {
        "validation": [
          "avoidStartingAndEndnigSpaceValidator",
          "defaultUserInputValidator"
          ]
      }
    },

    {
      "key": "svgCaptcha",
      "type": "svgcaptcha",
      "templateOptions": {
        "label": "Controllo di sicurezza",
        "description" : "ATTENZIONE visualizzare l'immagine, leggere con attenzione la domanda e rispondere digitando i numeri richiesti",
        "required" : true
     
      }
    }

]; 

var _options = {};

var _env = {
  "configPath" : "config";
};

module.exports = {


  getF : function() {
    // console.log('returning', _files);
    return _files;
  },

  getB : function() {
    return _body;
  },

  getO : function() {
    return _options;
  },

  getEnv : function() {
    return _env;
  }



}