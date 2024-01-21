var secp256k1 = require('elliptic-curve').secp256k1;
var privateKey = '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f';
console.log(secp256k1.getPublicKey(privateKey));