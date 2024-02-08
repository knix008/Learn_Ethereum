import { ethers } from "hardhat";

const diceRollGameContract = require("../artifacts/contracts/DiceRollGame.sol/DiceRollGame.json");
//Make sure replace the below address with yours. 
const diceRollGameContractAddress = "0x82bfC5D009ad2EA5D38688Fb3BBd32237bf4f211";
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

    // Wait for 180 second for random number to change.
    console.log("Sleeping... 180 sec");
    await sleep(180000);

    console.log(await diceRollGame.getRequestStatus(requestID.value));
    return;

    console.log("Calliong rollDice() function...");
    const diceNum = await diceRollGame.rollDice();
    console.log("Calling success....!!!");
    console.log("Dice Roll Game Contract rollDice:", diceNum.toNumber());
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main();