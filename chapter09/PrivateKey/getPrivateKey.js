const keythereum = require("keythereum");

var address = "0xbbb4a9750dbe0d03207c9b0d1b1778f3b65d44cc"; // The account address.
var dir = "/home/shkwon/private-chain"; // The directory full path name, which has keystore directory.

var keyObject = keythereum.importFromFile(address, dir);
var pk = keythereum.recover('<Put your password here!!!>', keyObject); // Your password for the account address.

var privateKey = pk.toString('hex');
console.log(privateKey); // Write the private key.