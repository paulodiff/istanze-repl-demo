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

  saveUuidRequest : function( v ) {
    fs.writeFileSync("./authenticationIds/" + v, v);
    console.log('utility.saveUuidRequest', v);
  },

  checkIfExistsUuidRequest : function(v) {
    console.log('utility.checkIfExistsUuidRequest', v);
    if (fs.existsSync("./authenticationIds/" + v)) {
      return true;
    } else {
      return false;
    }
  },

  saveSession : function (uuid, data) {
    fs.writeFileSync("./sessions/" + uuid + '.json', JSON.stringify(data));
  }

}