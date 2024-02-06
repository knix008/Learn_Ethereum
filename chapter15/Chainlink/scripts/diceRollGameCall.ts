import { ethers } from "hardhat";

const diceRollGameContract = require("../artifacts/contracts/DiceRollGame.sol/DiceRollGame.json");
//Make sure replace the below address with yours. 
const diceRollGameContractAddress = "0xD5440638d7d3f9E0AC14e0639979f0E8Dcf41C7A";
/**
 * run below command to call rollDice function
 * npx hardhat run scripts/diceRollGameCall.ts --network goerli
 */
async function main() {
    const DiceRollGameContract = await ethers.getContractFactory("DiceRollGame");
    const diceRollGame = await DiceRollGameContract.attach(diceRollGameContractAddress);
    console.log("Dice Roll Game Contract:", await diceRollGame.getAddress());

    await diceRollGame.getRandomNumber();

    // Wait for 60 second for random number to change.
    console.log("Sleeping... 60 sec");
    await sleep(60000);

    console.log("Calliong rollDice() function...");
    await diceRollGame.rollDice();
    console.log("Calling success....!!!");
    console.log("Dice Roll Game Contract rollDice:", diceNum);
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main();