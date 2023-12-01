const fs = require('fs')
require('dotenv').config()

async function getWeb3() {
    const { Web3 } = require('web3')
    // We will use Ganache GUI. Run it first before you run this program.
    const web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.L1RPC}`))
    return web3
}

async function getAccounts(web3) {
    return await web3.eth.getAccounts()
}

// Create getOrder function
async function getOrder(web3, account) {
    // Import the contract file
    const contractJsonFile = fs.readFileSync('Orders.json')
    const contract = JSON.parse(contractJsonFile)
    const fromAddress = account
    console.log(`The address : ${fromAddress}`)

    // Create address variables
    const contractAddress = '0xe332Ca5Ec1Fb1Dad33e84cf9f7F92Ab1F2a92783'
    // Get the bytecode and API
    const abi = contract.abi;
    // Create contract instance
    const contractInst = new web3.eth.Contract(abi, contractAddress)
    console.log(`Making a call to contract at address: ${contractAddress}`)
    // Call contract
    const orders = await contractInst.methods.getOrder(fromAddress).call()
    const customJson = JSON.stringify(orders, (key, value) => {
        return typeof value === 'bigint' ? value.toString() : value;
    });

    outputObject = JSON.parse(customJson)
    console.log(`The current order is: ${JSON.stringify(outputObject)}`)
};

async function main() {
    let web3 = await getWeb3()
    let accounts = await getAccounts(web3)
    console.dir(accounts)

    getOrder(web3, accounts[0])
}

main()