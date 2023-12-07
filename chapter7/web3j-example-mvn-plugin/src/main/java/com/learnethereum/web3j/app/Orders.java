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
    public static final String BINARY = "608060405234801561000f575f80fd5b506105418061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80636eba2b13146100385780639790528914610063575b5f80fd5b61004b61004636600461021b565b610078565b60405161005a9392919061027e565b60405180910390f35b610076610071366004610350565b6101c5565b005b6001600160a01b0381165f9081526020819052604081206002810154815460609384939092909160018301919083906100b0906103c7565b80601f01602080910402602001604051908101604052809291908181526020018280546100dc906103c7565b80156101275780601f106100fe57610100808354040283529160200191610127565b820191905f5260205f20905b81548152906001019060200180831161010a57829003601f168201915b5050505050925081805461013a906103c7565b80601f0160208091040260200160405190810160405280929190818152602001828054610166906103c7565b80156101b15780601f10610188576101008083540402835291602001916101b1565b820191905f5260205f20905b81548152906001019060200180831161019457829003601f168201915b505050505091509250925092509193909250565b6001600160a01b0384165f908152602081905260409020806101e7858261044b565b50600181016101f6848261044b565b5060020155505050565b80356001600160a01b0381168114610216575f80fd5b919050565b5f6020828403121561022b575f80fd5b61023482610200565b9392505050565b5f81518084525f5b8181101561025f57602081850181015186830182015201610243565b505f602082860101526020601f19601f83011685010191505092915050565b606081525f610290606083018661023b565b82810360208401526102a2818661023b565b915050826040830152949350505050565b634e487b7160e01b5f52604160045260245ffd5b5f82601f8301126102d6575f80fd5b813567ffffffffffffffff808211156102f1576102f16102b3565b604051601f8301601f19908116603f01168101908282118183101715610319576103196102b3565b81604052838152866020858801011115610331575f80fd5b836020870160208301375f602085830101528094505050505092915050565b5f805f8060808587031215610363575f80fd5b61036c85610200565b9350602085013567ffffffffffffffff80821115610388575f80fd5b610394888389016102c7565b945060408701359150808211156103a9575f80fd5b506103b6878288016102c7565b949793965093946060013593505050565b600181811c908216806103db57607f821691505b6020821081036103f957634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561044657805f5260205f20601f840160051c810160208510156104245750805b601f840160051c820191505b81811015610443575f8155600101610430565b50505b505050565b815167ffffffffffffffff811115610465576104656102b3565b6104798161047384546103c7565b846103ff565b602080601f8311600181146104ac575f84156104955750858301515b5f19600386901b1c1916600185901b178555610503565b5f85815260208120601f198616915b828110156104da578886015182559484019460019091019084016104bb565b50858210156104f757878501515f19600388901b60f8161c191681555b505060018460011b0185555b50505050505056fea2646970667358221220671ae8b03e84db44dfd3cbeec9ef10686833991beee593e1a028ba60cf21710564736f6c63430008170033";

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
