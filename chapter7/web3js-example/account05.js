async function getWeb3() {
    const { Web3 } = require('web3')
    var net = require('net')
    var web3 = new Web3("/home/shkwon/private-chain/geth.ipc", net)
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