require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

const alchemy_api_key = process.env["ALCHEMY_API_KEY"];
const sepolia_private_key = process.env["SEPOLIA_PRIVATE_KEY"];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${alchemy_api_key}`,
      accounts: [sepolia_private_key]
    }
  }
};