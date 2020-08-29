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
const moment = require('moment');
var momentTZ = require('moment-timezone');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var base64url = require('base64url');

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

  // verifica se la risposta è corretta
  checkSvgCapthca: function(uD, sC) {
    console.log('--checkSvgCapthca--');
    if(uD.svgCaptcha && sC.svgCapthaResponse && 
    (uD.svgCaptcha === sC.svgCapthaResponse)) {
      console.log('svgCapthca ok!');     

    } else {
      console.log('no svgCapthca or not equal');
      return false;
    }

    // controlla se esiste la risposta

    // dal securityContext recupera i dati

    // verifica la risposta 

    return true;
  },

  checkDataTypeAndValue: function(a,b,c,d) {
    console.log('--checkDataTypeAndValue--');
    return true;
  },


  // ritorna il contesto di sicurezza locale
  // sC securityContext
  // eC environent configuration
  getLocalSecurityContext: function(sC, eC) {

    console.log('---getLocalSecurityContext---');
    var lsC = {};
    var fName = path.join(eC.configLocalSecurityPath, sC.rrtoken);
    console.log(fName);
    try {
      if (fs.existsSync(fName)) {
        let rawdata = fs.readFileSync(fName);
        lsC = JSON.parse(rawdata);
        console.log(lsC);

        // controllo del timestamp se è scaduto
        // current time stamp
        var cTS = momentTZ().tz("Europe/Rome");
        console.log('cTS:', cTS);

        var sTS = momentTZ.tz(lsC.ts, "Europe/Rome");
        console.log('sTS:', sTS);

        sTS.add(eC.tokenTimeoutInMinutes, 'minutes');
        console.log('sTS:', sTS);
        // security context creation time stamp
   
        console.log('isAfter?:', cTS.isAfter(sTS));

        if( cTS.isAfter(sTS)) {
          console.log('token expired!');
          return {};
        } else {
          return lsC;
        }

      } else {
        console.log('local security context not found!');
        return lsC;
      }
    } catch(err) {
        console.error(err);
        return lsC;
    }

    
  },

   // Encrypt with AES 64
  encryptStringWithAES_64: function(toEncrypt, iv) {

    let cipher_algorithm = 'AES-256-CBC';
    // logger.logVerbose('[#AES#e]','toEncrypt=', toEncrypt); // 098F6BCD4621D373CADE4E832627B4F6

    // get password's md5 hash
    let password = "12CHIAVESUPERSEGRETA12CHIAVESU12";
    // logger.logVerbose('[#AES#e]','password=', password); // 098F6BCD4621D373CADE4E832627B4F6

    // our data to encrypt
    // let data = '06401;0001001;04;15650.05;03';
    let data = toEncrypt;
    // logger.logVerbose('[#AES#e]','data=', data);
    // logger.logVerbose('[#AES#e]','iv=', iv);

    // encrypt data
    var cipher = crypto.createCipheriv(cipher_algorithm, password, iv);
    var encryptedData = cipher.update(data, 'utf8', 'base64');
    encryptedData += cipher.final('base64');
    // logger.logVerbose('[#AES#e]','encrypted data=', encryptedData);
    
    var encrypted64 = base64url(encryptedData);
    // logger.logVerbose('[#AES#e]','encrypted64 data=', encrypted64);

    // TO REMOVE!!! SOLO TEST DI VERIFICA 
    // var d1 = 'RFd1U2hIT29Qczh0dU4zOHJoU2FRVGF6cE5rMnltaG1pMHBRT0pIRHgvMGkxakllSEUwTTNidnJyaVJkLy92cndKdGxpcElKUDFhd3F6SGpjeEQ3MDM1NktGMzIvTU9mWVpORVR1ODN6Zmd2THh4dkUzRUhJMzFLWU53eDBqZXE3SDZudlFTMXRUbjJocjQyT2V6K3FWR1lWSkJWNjUxTVNIMGJMdjFDbXpGVlFJeW5UcDc5VHhsTTNIeE5vOC9iRE8rNEFVQWtLNDlYNktodXA4QTNzK0o3MUNFWFNNZERPVUZZMVFEZS81TT0';
    // var iv = 'GflWdWVhkGodG5yo';
    // var dataDecoded = base64url.decode(d1);
    // logger.logVerbose('[#AES# - reverse]','encryptedDecoded data=', dataDecoded);
    // var decryptor = crypto.createDecipheriv(cipher_algorithm, password, iv);
    // var decryptedData = decryptor.update(dataDecoded, 'base64', 'utf8') + decryptor.final('utf8');
    // logger.logVerbose('[#AES# - reverse]','decrypted data=', decryptedData);

    return encrypted64;
  },

  decryptStringWithAES_64: function(toDecrypt, iv) {

      let cipher_algorithm = 'AES-256-CBC';
      // logger.logVerbose('[#AES#d]','toDecrypt=', toDecrypt);
      
  
      // get password's md5 hash
      let password = "12CHIAVESUPERSEGRETA12CHIAVESU12";
      // logger.logVerbose('[#AES#d]','password=', password); // 098F6BCD4621D373CADE4E832627B4F6
  
      // logger.logVerbose('[#AES#d]','data=', toDecrypt);
      // logger.logVerbose('[#AES#d]','iv=', iv);
  
      // decrypt data
      var dataDecoded = base64url.decode(toDecrypt);
      // logger.logVerbose('[#AES#d]','dataDecoded=', dataDecoded);

      var decryptor = crypto.createDecipheriv(cipher_algorithm, password, iv);
      var decryptedData = decryptor.update(dataDecoded, 'base64', 'utf8') + decryptor.final('utf8');
 
      // logger.logVerbose('[#AES#d]','decrypted data=', decryptedData);
      return decryptedData;
  },



  createJWT: function(user, timeout1, timeout2) {

          // logger.logVerbose('utilityModule.js:createJWT');
          // moment.js syntax 
          // https://momentjs.com/docs/#/manipulating/add/
          // moment().add(7, 'd');
          timeout1 = timeout1 || 10;
          timeout2 = timeout2 || 'm';
          // logger.logVerbose('TIME >>>> ', timeout1, timeout2);
          // logger.logVerbose('utilityModule.js:timeout1:', timeout1);
          // logger.logVerbose('utilityModule.js:timeout2:', timeout2);
          timeOut = moment().add(timeout1, timeout2).unix();
          user.sessionTimeout = timeOut;
          // logger.logVerbose('utilityModule.js:now     :', moment().unix());
          // logger.logVerbose('utilityModule.js:timeout :', timeOut);

          // logger.logVerbose('TIME >>>> ', moment().unix(), moment().add(timeout1, timeout2).unix());

          var payload = {
            sub: user,
            iat: moment().unix(),
            // timeout di 8 ore
            exp: timeOut
          };
          return jwt.sign(payload, "12CHIAVESUPERSEGRETA12CHIAVESU12");
    }

}