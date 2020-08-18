/**
 * Modulo che implementa gli stessi controlli del modulo JSON
 * 
 * 
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
  }

}