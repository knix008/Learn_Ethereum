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
 * <p>Generated with web3j version 1.4.2.
 */
@SuppressWarnings("rawtypes")
public class Orders extends Contract {
    public static final String BINARY = "608060405234801561001057600080fd5b5061098e806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80636eba2b131461003b578063979052891461006d575b600080fd5b6100556004803603810190610050919061035f565b610089565b60405161006493929190610435565b60405180910390f35b610087600480360381019061008291906105db565b610277565b005b60608060008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000016000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206001016000808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206002015482805461015e906106a9565b80601f016020809104026020016040519081016040528092919081815260200182805461018a906106a9565b80156101d75780601f106101ac576101008083540402835291602001916101d7565b820191906000526020600020905b8154815290600101906020018083116101ba57829003601f168201915b505050505092508180546101ea906106a9565b80601f0160208091040260200160405190810160405280929190818152602001828054610216906106a9565b80156102635780601f1061023857610100808354040283529160200191610263565b820191906000526020600020905b81548152906001019060200180831161024657829003601f168201915b505050505091509250925092509193909250565b60008060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050838160000190816102ca9190610886565b50828160010190816102dc9190610886565b508181600201819055505050505050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061032c82610301565b9050919050565b61033c81610321565b811461034757600080fd5b50565b60008135905061035981610333565b92915050565b600060208284031215610375576103746102f7565b5b60006103838482850161034a565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156103c65780820151818401526020810190506103ab565b60008484015250505050565b6000601f19601f8301169050919050565b60006103ee8261038c565b6103f88185610397565b93506104088185602086016103a8565b610411816103d2565b840191505092915050565b6000819050919050565b61042f8161041c565b82525050565b6000606082019050818103600083015261044f81866103e3565b9050818103602083015261046381856103e3565b90506104726040830184610426565b949350505050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6104bc826103d2565b810181811067ffffffffffffffff821117156104db576104da610484565b5b80604052505050565b60006104ee6102ed565b90506104fa82826104b3565b919050565b600067ffffffffffffffff82111561051a57610519610484565b5b610523826103d2565b9050602081019050919050565b82818337600083830152505050565b600061055261054d846104ff565b6104e4565b90508281526020810184848401111561056e5761056d61047f565b5b610579848285610530565b509392505050565b600082601f8301126105965761059561047a565b5b81356105a684826020860161053f565b91505092915050565b6105b88161041c565b81146105c357600080fd5b50565b6000813590506105d5816105af565b92915050565b600080600080608085870312156105f5576105f46102f7565b5b60006106038782880161034a565b945050602085013567ffffffffffffffff811115610624576106236102fc565b5b61063087828801610581565b935050604085013567ffffffffffffffff811115610651576106506102fc565b5b61065d87828801610581565b925050606061066e878288016105c6565b91505092959194509250565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806106c157607f821691505b6020821081036106d4576106d361067a565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261073c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826106ff565b61074686836106ff565b95508019841693508086168417925050509392505050565b6000819050919050565b600061078361077e6107798461041c565b61075e565b61041c565b9050919050565b6000819050919050565b61079d83610768565b6107b16107a98261078a565b84845461070c565b825550505050565b600090565b6107c66107b9565b6107d1818484610794565b505050565b5b818110156107f5576107ea6000826107be565b6001810190506107d7565b5050565b601f82111561083a5761080b816106da565b610814846106ef565b81016020851015610823578190505b61083761082f856106ef565b8301826107d6565b50505b505050565b600082821c905092915050565b600061085d6000198460080261083f565b1980831691505092915050565b6000610876838361084c565b9150826002028217905092915050565b61088f8261038c565b67ffffffffffffffff8111156108a8576108a7610484565b5b6108b282546106a9565b6108bd8282856107f9565b600060209050601f8311600181146108f057600084156108de578287015190505b6108e8858261086a565b865550610950565b601f1984166108fe866106da565b60005b8281101561092657848901518255600182019150602085019450602081019050610901565b86831015610943578489015161093f601f89168261084c565b8355505b6001600288020188555050505b50505050505056fea2646970667358221220c4bff563fbeeef39618d01dd38105d279a1c9c9079fe6b951b96cb549d3b5e5264736f6c63430008120033";

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
