import { ethers } from "hardhat";

const diceRollGameContract = require("../artifacts/contracts/DiceRollGame.sol/DiceRollGame.json");
//Make sure replace the below address with yours. 
const diceRollGameContractAddress = "0xbAF5d2AeAc82440c43C18111FaE91d307133f874";
/**
 * run below command to call rollDice function
 * npx hardhat run scripts/diceRollGameCall.ts --network goerli
 */
async function main() {
    const DiceRollGameContract = await ethers.getContractFactory("DiceRollGame");
    const diceRollGame = await DiceRollGameContract.attach(diceRollGameContractAddress);
    console.log("Dice Roll Game Contract:", await diceRollGame.getAddress());

    const requestID = await diceRollGame.requestRandomWords();
    console.log("The request ID : ", requestID.value);

    // Wait for 60 second for random number to change.
    console.log("Sleeping... 60 sec");
    await sleep(60000);

    console.log("Calliong rollDice() function...");
    const diceNum = await diceRollGame.rollDice();
    console.log("Calling success....!!!");
    console.log("Dice Roll Game Contract rollDice:", diceNum.toNumber());
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main();