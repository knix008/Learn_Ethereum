async function getWeb3() {
    const {Web3} = require('web3')
    //Instantiating a Web3 instance and using localhost Ethereum node
    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
    return web3
}

async function getAccounts(web3) {
    return await web3.eth.getAccounts()
}

async function main() {
    let web3 = await getWeb3()
    let accounts = await getAccounts(web3)

    console.dir(accounts)
}

main()