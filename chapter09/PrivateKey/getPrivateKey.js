const keythereum = require("keythereum");

var address = "0xbbb4a9750dbe0d03207c9b0d1b1778f3b65d44cc";
var dir = "/home/shkwon/private-chain"; //keystore가 있는 data 디렉토리 경로

var keyObject = keythereum.importFromFile(address, dir);
var pk = keythereum.recover('<Put your password here!!!>', keyObject);

var privateKey = pk.toString('hex');
console.log(privateKey);