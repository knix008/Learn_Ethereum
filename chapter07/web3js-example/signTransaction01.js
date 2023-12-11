require('dotenv').config()

async function getWeb3() {
    const { Web3 } = require('web3')
    // We will use Ganache GUI. Run it first before you run this program.
    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
    return web3
}

async function getAccounts(web3) {
    return await web3.eth.getAccounts()
}

async function transfer(web3) {
    const fromAddress = '0xf7F0e1438c3B900C5BE0e3440084a6772Ef151c5'
    const toAddress = '0xDdE117684a6A719AF3948e750eDDC4C0aB096f35'
    const accountFrom = {
        privateKey: `${process.env.privateKey}`,
        address: fromAddress,
    };

    let txCount = await web3.eth.getTransactionCount("0xf7F0e1438c3B900C5BE0e3440084a6772Ef151c5")
    console.log(txCount)
    // Sign tx with PK
    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            nonce: txCount,
            to: toAddress,
            value: '1000000000',
            gas: 21000,
            maxPriorityFeePerGas: 1, // Minimum value
            maxFeePerGas: 875000000, // Minimum value
        },
        accountFrom.privateKey
    );
    console.log("Signing Done!!!")
    // Send tx and wait for receipt
    const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    console.log(`Transaction successful with hash : ${createReceipt.transactionHash}`);
}

async function main() {
    let web3 = await getWeb3()
    let accounts = await getAccounts(web3)
    console.dir(accounts)

    console.log(`Account 0 : ${accounts[0]}`)
    console.log(await web3.eth.getBalance(accounts[0]))
    console.log(`Account 1 : ${accounts[1]}`)
    console.log(await web3.eth.getBalance(accounts[1]))

    transfer(web3)
}

main()