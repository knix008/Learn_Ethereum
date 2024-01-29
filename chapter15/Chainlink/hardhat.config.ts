import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_API_KEY = "yEweLj8PJaObGdzgif_Y7iP1Rg7L2lfy";
const PRIVATE_KEY = "0x4545954a61d55ea366aff98249030c237f0ac7e2c6c48bb4e8d0f1579f365ecb";

const config: HardhatUserConfig = {
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY]
    },
  },
  solidity: "0.8.19",
};

export default config;