var MyERC20Tokens = artifacts.require("./MyERC20Tokens.sol");

module.exports = function(deployer) {
  deployer.deploy(MyERC20Tokens);
};
