/**
 * Modulo che implementa gli stessi controlli del modulo JSON
 * 
 * 
 * https://github.com/emn178/js-sha256
 */

// const shajs = require('sha.js');
var fs = require('fs');
var sha256 = require('js-sha256');
const path = require('path');

module.exports = {

  ibanValidator : function( v ) {
    console.log(v);
  },

  codiceFiscaleValidator : function(v) {
    console.log(v);
  },

  buildHash: function(file) {
    console.log('buildHash', file);
    var data = fs.readFileSync(file);
    var encrypted = sha256(data);
    return encrypted;
  },

  getFileSize: function(file) {
    var stats = fs.statSync(file);
    var fileSizeInBytes = stats["size"];
    return fileSizeInBytes;
  },


  // controlla l'esistenza del Security securityContext
  // devono esiste due proprietà con i valori
  getSecurityContextExistsIfValid: function(u) {

    var sC = {};

    if(u.securityContext) {
      sC = JSON.parse(u.securityContext);
      console.log(sC);
    }

    // controlla che esistano le proprietà in sC
    var rV = sC && ("rrtoken" in sC) && ("rrhash" in sC);

    if(rV) {
      console.log('securityContext ok return data');
      return sC;
    } else {
      console.log('securityContext erro return null');
      return null;
    }
   
  },

  // verifica che il form name esista e ci sia la configurazione per il form (tutto in una cartella)
  formNameIsValidAndExists: function(fN) {
    return true;
  },

  // controlla gli hash dei dati e dei files
  // uD upload data
  // uF upload files
  // cF config form
  // sC Security

  checkDataIntegrity: function(uD,uF,cF,sC) {

    console.log('--checkDataIntegrity--');
    //per ogni file viene calcolato l'hash e controllato
    uF.forEach((item) => {

      console.log('controllo:', item.fieldname);

      item.vv_hash = this.buildHash(item.path);
      // item.vv_file_size = this.getFileSize(item.path);

      // deve esistere nei dati una chiave
      var o_hash = "";
      if(uD[item.fieldname]) {
        o_hash = uD[item.fieldname];
      } else {
        console.log('no file key in model');
        return false;
      }

      if(item.vv_hash === o_hash) {
        console.log('hash valid', o_hash);
      } else {
        console.log('hash not valid!');
        return false;
      }
     
    });
    // calcola l'hashmac dei dati e lo confronta con quello passato
    var hash = sha256.hmac.create(sC.rrtoken);
    Object.keys(uD).forEach((key, index) => {
 
      
      console.log('hash add', key, uD[key]);
      hash.update(uD[key]);
      
    });

    var cH = hash.hex();
    if(cH === sC.rrhash) {
      console.log('hash corretto!', cH, sC.rrhash);
    } else {
      console.log('hash errato:', cH, sC.rrhash);
      return false;
    }
  

    return true;

  },

  checkSvgCapthca: function(uD, sC) {
    console.log('--checkSvgCapthca--');

    // controlla se esiste la risposta

    // dal securityContext recupera i dati

    // verifica la risposta 

    return true;
  },

  checkDataTypeAndValue: function(a,b,c,d) {
    console.log('--checkDataTypeAndValue--');
    return true;
  }


  // ritorna il contesto di sicurezza locale
  // sC securityContext
  // eC environent configuration
  getLocalSecurityContext: function(sC, eC) {
    console.log('---getLocalSecurityContext---');
    var lsC = {};
    var fName = path.join([eC.configPath , sC.rrtoken]);
    console.log(fName);
    try {
      if (fs.existsSync(fName)) {
    //file exists
    }
    } catch(err) {
        console.error(err)
    }

    return lsC;
  }

}