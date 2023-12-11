package com.learnethereum.web3j.app;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tuples.generated.Tuple3;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 1.5.0.
 */
@SuppressWarnings("rawtypes")
public class Orders extends Contract {
    public static final String BINARY = "608060405234801561001057600080fd5b50610502806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80636eba2b131461003b5780639790528914610066575b600080fd5b61004e6100493660046102cd565b61007b565b60405161005d9392919061033c565b60405180910390f35b610079610074366004610415565b6101cd565b005b6001600160a01b03811660009081526020819052604081206002810154815460609384939092909160018301919083906100b490610491565b80601f01602080910402602001604051908101604052809291908181526020018280546100e090610491565b801561012d5780601f106101025761010080835404028352916020019161012d565b820191906000526020600020905b81548152906001019060200180831161011057829003601f168201915b5050505050925081805461014090610491565b80601f016020809104026020016040519081016040528092919081815260200182805461016c90610491565b80156101b95780601f1061018e576101008083540402835291602001916101b9565b820191906000526020600020905b81548152906001019060200180831161019c57829003601f168201915b505050505091509250925092509193909250565b6001600160a01b038416600090815260208181526040909120845190916101f8918391870190610218565b50825161020e9060018301906020860190610218565b5060020155505050565b82805461022490610491565b90600052602060002090601f016020900481019282610246576000855561028c565b82601f1061025f57805160ff191683800117855561028c565b8280016001018555821561028c579182015b8281111561028c578251825591602001919060010190610271565b5061029892915061029c565b5090565b5b80821115610298576000815560010161029d565b80356001600160a01b03811681146102c857600080fd5b919050565b6000602082840312156102df57600080fd5b6102e8826102b1565b9392505050565b6000815180845260005b81811015610315576020818501810151868301820152016102f9565b81811115610327576000602083870101525b50601f01601f19169290920160200192915050565b60608152600061034f60608301866102ef565b828103602084015261036181866102ef565b915050826040830152949350505050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261039957600080fd5b813567ffffffffffffffff808211156103b4576103b4610372565b604051601f8301601f19908116603f011681019082821181831017156103dc576103dc610372565b816040528381528660208588010111156103f557600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000806000806080858703121561042b57600080fd5b610434856102b1565b9350602085013567ffffffffffffffff8082111561045157600080fd5b61045d88838901610388565b9450604087013591508082111561047357600080fd5b5061048087828801610388565b949793965093946060013593505050565b600181811c908216806104a557607f821691505b602082108114156104c657634e487b7160e01b600052602260045260246000fd5b5091905056fea2646970667358221220422343225058a05bac9007092b4b616d37351b529c37516dd4379c5b201f0d8764736f6c63430008090033";

    public static final String FUNC_GETORDER = "getOrder";

    public static final String FUNC_SETORDER = "setOrder";

    @Deprecated
    protected Orders(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected Orders(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected Orders(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected Orders(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public RemoteFunctionCall<Tuple3<String, String, BigInteger>> getOrder(String _address) {
        final Function function = new Function(FUNC_GETORDER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _address)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Uint256>() {}));
        return new RemoteFunctionCall<Tuple3<String, String, BigInteger>>(function,
                new Callable<Tuple3<String, String, BigInteger>>() {
                    @Override
                    public Tuple3<String, String, BigInteger> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple3<String, String, BigInteger>(
                                (String) results.get(0).getValue(), 
                                (String) results.get(1).getValue(), 
                                (BigInteger) results.get(2).getValue());
                    }
                });
    }

    public RemoteFunctionCall<TransactionReceipt> setOrder(String _address, String _buyer, String _product, BigInteger _quantity) {
        final Function function = new Function(
                FUNC_SETORDER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _address), 
                new org.web3j.abi.datatypes.Utf8String(_buyer), 
                new org.web3j.abi.datatypes.Utf8String(_product), 
                new org.web3j.abi.datatypes.generated.Uint256(_quantity)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static Orders load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new Orders(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static Orders load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new Orders(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static Orders load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new Orders(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static Orders load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new Orders(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<Orders> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(Orders.class, web3j, credentials, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<Orders> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(Orders.class, web3j, credentials, gasPrice, gasLimit, BINARY, "");
    }

    public static RemoteCall<Orders> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(Orders.class, web3j, transactionManager, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<Orders> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(Orders.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "");
    }
}
