async function getWeb3() {
    const { Web3 } = require('web3')
    //Instantiating a Web3 instance and using localhost Ethereum node
    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
    return web3
}

async function encodeParameters(web3, typesArray, parameters) {
    return await web3.eth.abi.encodeParameters(typesArray, parameters);
}

async function decodeParameters(web3, typesArray, hexString) {
    return await web3.eth.abi.decodeParameters(typesArray, hexString);
}

BigInt.prototype.toJSON = function () { return this.toString() };

async function main() {
    let web3 = await getWeb3()
    let typesArray = [
        'uint8[]',
        {
            "Struct": {
                "propertyOne": 'uint256',
                "propertyTwo": 'uint256'
            }
        }
    ];
    let parameters = [
        ['10', '11'],
        {
            "propertyOne": '100',
            "propertyTwo": '200',
        }
    ];
    let hexString = await encodeParameters(web3, typesArray, parameters);
    console.log(`encodeParameters hexString: ${hexString}`)
    let decodeOutput = await decodeParameters(web3, typesArray, hexString)
    console.log(`decodeOutput: ${JSON.stringify(decodeOutput)}`)
}

main()