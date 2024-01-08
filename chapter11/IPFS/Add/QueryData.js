const IPFS = require('ipfs-mini');
const ipfs = new IPFS({
    host: '127.0.0.1', port: 8080, //It is a IPFS Gateway Port Number
    protocol: 'http'
});
const ipfsHash = "QmVXBKtQTF6SCNE1YQEEUQUKNBG48uR1uKKXPpzLtEy6xM"; // Change your IPFS hash value here!!!
ipfs.cat(ipfsHash, function (error, data) {
    if (error === null) {
        console.log("IPFS Hash : ", data);
    } else {
        console.log("Cannot connect to local IPFS : ", error);
    }
});