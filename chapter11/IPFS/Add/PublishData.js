const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: '127.0.0.1', port: 5001, protocol: 'http' });
const myData = "Hello IPFS";
ipfs.add(myData, function (error, data) {
    if (error === null) {
        console.log("IPFS Hash : ", data);
    } else {
        console.log("Cannot connect to local IPFS : ", error);
    }
});