/**
 * Modulo che implementa gli stessi controlli del modulo JSON
 * 
 * 
 * https://github.com/emn178/js-sha256
 */

// const shajs = require('sha.js');
var fs = require('fs');
var sha256 = require('js-sha256');

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
    }

    // controlla che esistano le proprietà in sC
    var rV = sC && ("rrtoken" in sC) && ("rrhash" in sC);

    if(rV) {
      return rV;
    } else {
      return null;
    }
    return rV;
  },

  formNameIsValidAndExists: function(fN) {
    return true;
  },

  // controlla gli hash dei dati e dei files
  // uD upload data
  // uF upload files
  // cF config form
  // sC Security

  checkDataIntegrity: function(uD,uF,cF,sC) {

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
 
      if ( uD[key] instanceof File ) {
        console.log('hash add', key, uD[key].file_hash);
        hash.update(uD[key].file_hash);
      } 

      if (typeof uD[key] === 'string') {
        console.log('hash add', key, uD[key]);
        hash.update(uD[key]);
      }
              
       if (typeof currentModel[key] === 'boolean') {
        console.log('hash add', key, uD[key]);
        hash.update(uD[key].toString());
      }

    });

    var cH = hash.hex();
    if(cH === sC.rrhash) {
      console.log('hash corretto!');
    } else {
      console.log('hash errato:', cH, sC.rrhash);
      return false;
    }

    

    return true;

  },

  checkSvgCapthca(u) {
    return true;
  },

  checkDataTypeAndValue(a,b,c,d) {
    return true;
  }

}