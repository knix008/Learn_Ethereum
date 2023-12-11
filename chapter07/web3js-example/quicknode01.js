async function getWeb3() {
    const {Web3} = require('web3')
    //Instantiating a Web3 instance and using localhost Ethereum node
    const web3 = new Web3(new Web3.providers.HttpProvider('https://proportionate-delicate-frost.ethereum-goerli.quiknode.pro/8199533ace86379cb6f28e210ed50b3e33b4dcd1/'))
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