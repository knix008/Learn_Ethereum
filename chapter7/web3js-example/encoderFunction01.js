async function getWeb3() {
    const { Web3 } = require('web3')
    //Instantiating a Web3 instance and using localhost Ethereum node
    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
    return web3
}

async function encodeFunctionSignatureJson(web3) {
    return await web3.eth.abi.encodeFunctionSignature({
        name: 'myMethod',
        type: 'function',
        inputs: [{
            type: 'uint256',
            name: 'input1'
        }, {
            type: 'string',
            name: 'input2'
        }]
    })
}

async function encodeFunctionSignatureString(web3) {
    return await web3.eth.abi.encodeFunctionSignature('myMethod(uint256,string)')
}

async function main() {
    let web3 = await getWeb3()
    let encodeOutPut = await encodeFunctionSignatureJson(web3)
    console.log(`encodeFunctionSignature by Json: ${encodeOutPut}`)
    encodeOutPut = await encodeFunctionSignatureString(web3)
    console.log(`encodeFunctionSignature by String: ${encodeOutPut}`)
}

main()