var DigitalArtContract = artifacts.require("./DigitalArt");

module.exports = function(deployer, network, accounts) {
  var name = "Digital Art Token";
  var symbol = "DAT";
  
  deployer.deploy(DigitalArtContract, name, symbol);
};