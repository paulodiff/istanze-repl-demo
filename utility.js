/**
 * Modulo che implementa gli stessi controlli del modulo 
 * utiliy per salvataggio file ed altro
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

 /**
  * Memorizza uuid di transazione per verificare la correttezza del ritorno dal gateway
 */
  saveUuidRequest : function( v ) {
    var data = {};
    data.ts = this.getLocalTimestamp();
    data.uuid = v;
    fs.writeFileSync("./authenticationIds/" + v, JSON.stringify(data));
    console.log('utility.saveUuidRequest', data);
  },

/**
 * Controlla che un determinato uuid esiste e se esiste lo rimuove non serve più
 */
  checkIfExistsUuiAndRemove : function(v) {
    console.log('utility.checkIfExistsUuidRequest', v);
    if (fs.existsSync("./authenticationIds/" + v)) {
      fs.unlinkSync("./authenticationIds/" + v);
      return true;
    } else {
      return false;
    }
  },

  saveSession : function (uuid, data) {
    fs.writeFileSync("./sessions/" + uuid + '.json', JSON.stringify(data));
  },

  getSession : function (uuid) {
    try {
    let fC = fs.readFileSync("./sessions/" + uuid + '.json');
    return JSON.parse(fC);
    } catch (err) {
      console.log('utility.getSession', err);
      return null;
    }
  },

  removeSession : function (uuid) {
    try {
      fs.unlinkSync("./sessions/" + uuid + '.json');
      return uuid + ' removed!';
    } catch (err) {
      console.log('utility.removeSession', err);
      return uuid + ' removed!';

    }
  },

  getLocalTimestamp : function() {
    return momentTZ().tz("Europe/Rome").format();
  }
}