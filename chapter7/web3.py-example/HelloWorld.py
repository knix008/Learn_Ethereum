import os
import json

from dotenv import load_dotenv
from web3 import Web3
from solcx import compile_standard, install_solc

load_dotenv() # You need to run load_dotenv() to load .env into this program.

with open("HelloWorld.sol", "r") as file:
    helloworld_file = file.read()

# Install Solidity version 0.8.9 here.
install_solc("0.8.9")
compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"HelloWorld.sol": {"content": helloworld_file}},
        "settings": {
            "outputSelection": {
                "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
            }
        },
    },
    solc_version="0.8.9",
)

# Get Bytecode and ABI
bytecode = compiled_sol["contracts"]["HelloWorld.sol"]["HelloWorld"]["evm"]["bytecode"]["object"]
abi = json.loads(compiled_sol["contracts"]["HelloWorld.sol"]["HelloWorld"]["metadata"])["output"]["abi"]

# Connect to Ganache and get account[0]
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))
w3.eth.default_account = w3.eth.accounts[0]

# Make a contract object.
Greeter = w3.eth.contract(abi=abi, bytecode=bytecode)

# Set the chain ID(Network ID)
chain_id = 1337

# Set account and private key for transaction signing 
my_address = w3.eth.accounts[0]
private_key = os.getenv("privateKey")  # Be sure that "K" is capital letter in privateKey
print(my_address)
print(private_key)

# Get Tx nonce
nonce = w3.eth.get_transaction_count(my_address)
print(nonce)

# Make a Tx
transaction = Greeter.constructor().build_transaction(
    {
        "chainId": chain_id,
        "gasPrice": w3.eth.gas_price,
        "from": my_address,
        "nonce": nonce,
    }
)

# Sign and Send Tx
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)
tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print(tx_receipt)

# Call the contract
greeter = w3.eth.contract(address=tx_receipt.contractAddress, abi=abi)
print(greeter.functions.greet().call())

# Set greeting message
tx_hash = greeter.functions.setGreeting('Nihao').transact()
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print(greeter.functions.greet().call())