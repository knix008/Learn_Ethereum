import { ethers } from "hardhat";

/**
 * run below command to deploy contract
 * npx hardhat run scripts/deploy.ts --network sepolia
 */
async function main() {
  const LINK_TOKEN = "0x779877a7b0d9e8603169ddbd7836e478b4624789";
  const VRF_COORDINATOR = "0x8103b0a8a00be2ddc778e6e7eaa21791cd364625";
  const KEY_HASH = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
  const diceRollGame = await ethers.getContractFactory("DiceRollGame");
  // deploy the contract
  const deployedDiceRollGameContract = await diceRollGame.deploy(
    VRF_COORDINATOR,
    LINK_TOKEN,
    KEY_HASH
  );

  await deployedDiceRollGameContract.waitForDeployment();
  // print the address of the deployed contract
  console.log("Dice Roll Game Contract Address:", await deployedDiceRollGameContract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});