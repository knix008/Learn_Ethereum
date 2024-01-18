require('dotenv').config();
const mnemonic = process.env["MNEMONIC"];
const infuraProjectId = process.env["INFURA_PROJECT_ID"];
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraEndPoint = "https://sepolia.infura.io/v3/63b88bff40b44390a1e3f162f2e7c6b1";

console.log("The MNEMONIC : " + mnemonic);
console.log("The INFURA_PROJECT_ID " + infuraProjectId);

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(mnemonic, infuraEndPoint),
      network_id: 11155111,       // Sepolia's id
      chain_id: 11155111
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13",      // Fetch exact version from solc-bin
    }
  }
};
