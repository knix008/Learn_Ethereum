var MyERC20Tokens = artifacts.require("./MyERC20Tokens.sol");

module.exports = function(deployer, network, accounts) {
  console.dir(accounts);

  var name = "My ERC20 Token";
  var symbol = "MTK";
  var address = accounts[0];
  var initial_supply = 1000;
  
  deployer.deploy(MyERC20Tokens, name, symbol, address, initial_supply);
  //deployer.deploy()
};