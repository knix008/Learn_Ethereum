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

async function setOrder(web3, account) {
    // Import the contract file
    const contractJsonFile = fs.readFileSync('Orders.json')
    const contract = JSON.parse(contractJsonFile)
    const fromAddress = account
    // Create address variables
    const accountFrom = {
        privateKey: `${process.env.privateKey}`,
        address: fromAddress,
    }
    // Create address variables
    const contractAddress = '0xe332Ca5Ec1Fb1Dad33e84cf9f7F92Ab1F2a92783'
    // Get the bytecode and API
    const abi = contract.abi;
    // Create contract instance
    const contractInst = new web3.eth.Contract(abi, contractAddress)
    console.log(`Calling the setOrder function in contract at address: ${contractAddress}`)

    // Get Tx nonce
    console.log(accountFrom.address)

    let txCount = await web3.eth.getTransactionCount(accountFrom.address)
    console.log(txCount)

    // Sign Tx with PK
    const setOrderTx = contractInst.methods.setOrder(fromAddress, "Alice", "Asset1", 10);
    console.log('Contract Instance Done!!!')
    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            nonce: txCount,
            to: contractAddress,
            data: setOrderTx.encodeABI(),
            gas: await setOrderTx.estimateGas(),
            maxPriorityFeePerGas: 1,
            maxFeePerGas: 875000000,
        },
        accountFrom.privateKey
    );
    console.log('Signing Done!!!')

    // Send Tx and Wait for Receipt
    const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
    console.log(`Tx successful with hash: ${createReceipt.transactionHash}`)
}

async function main() {
    let web3 = await getWeb3()
    let accounts = await getAccounts(web3)
    console.dir(accounts)
    
    setOrder(web3, accounts[0])
}

main()