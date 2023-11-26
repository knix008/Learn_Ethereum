async function getWeb3() {
    const { Web3 } = require('web3')
    //Instantiating a Web3 instance and using localhost Ethereum node
    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
    return web3
}

async function encodeFunctionCall(web3, jsonInterface, parameters) {
    return await web3.eth.abi.encodeFunctionCall(jsonInterface, parameters);
}

async function main() {
    let web3 = await getWeb3()
    let jsonInterface = {
        name: 'myMethod',
        type: 'function',
        inputs: [{
            type: 'uint256',
            name: 'input1'
        }, {
            type: 'string',
            name: 'input2'
        }]
    };
    let parameters2 = [100, 'test']
    let encodeFunctionCallOutput = await encodeFunctionCall(web3, jsonInterface, parameters2)
    console.log(`decodeOutput: ${encodeFunctionCallOutput}`)
}

main()