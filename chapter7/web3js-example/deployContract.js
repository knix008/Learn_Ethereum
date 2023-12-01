require('dotenv').config()

async function getWeb3() {
    const { Web3 } = require('web3')
    // We will use Ganache GUI. Run it first before you run this program.
    const web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.L1RPC}`))
    return web3
}

function getContract() {
    const fs = require('fs');
    // Import the contract file
    const contractJsonFile = fs.readFileSync('Orders.json');
    const contract = JSON.parse(contractJsonFile);
    return contract
}

async function deployContract(web3, contract) {
    const fromAddress = '0xf7F0e1438c3B900C5BE0e3440084a6772Ef151c5'
    // Create address variables.
    const accountFrom = {
        privateKey: `${process.env.privateKey}`,
        address: fromAddress,
    };

    // Get the bytecode and API
    const bytecode = contract.bytecode;
    const abi = contract.abi;
    console.log(`Attempting to deploy from account ${accountFrom.address}`);

    // Create contract instance
    const contractInst = new web3.eth.Contract(abi);
    console.log('Contract instantiation done!!!')

    // Create constructor tx
    const contractTx = contractInst.deploy({
        data: bytecode
    });
    console.log('Contract transaction constructor done!!!')

    // Sign transacation and send
    let txCount = await web3.eth.getTransactionCount(accountFrom.address)
    console.log(txCount)
    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            nonce: txCount,
            data: contractTx.encodeABI(),
            gas: await contractTx.estimateGas(),
            maxPriorityFeePerGas: 1,
            maxFeePerGas: 875000000,
        },
        accountFrom.privateKey
    );
    console.log('Signing done!!!')

    // Send tx and wait for receipt
    const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    console.log(`Contract deployed at address: ${createReceipt.contractAddress}`);
}

async function main() {
    let web3 = await getWeb3()
    let contract = getContract()

    deployContract(web3, contract)
}

main()