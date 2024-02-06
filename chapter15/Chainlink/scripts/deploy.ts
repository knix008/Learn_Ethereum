import { ethers } from "hardhat";

/**
 * run below command to deploy contract
 * npx hardhat run scripts/deploy.ts --network sepolia
 */
async function main() {
  const diceRollGame = await ethers.getContractFactory("DiceRollGame");
  // deploy the contract
  const deployedDiceRollGameContract = await diceRollGame.deploy();

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