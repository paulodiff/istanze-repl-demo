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

module.exports = {


  getF : function() {
    // console.log('returning', _files);
    return _files;
  },

  getB : function() {
    return _body;
  }


}