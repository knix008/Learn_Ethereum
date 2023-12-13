var ERC1155NFTToken = artifacts.require("./ERC1155NFTToken");

module.exports = function(deployer) {
  deployer.deploy(ERC1155NFTToken, name, symbol);
};