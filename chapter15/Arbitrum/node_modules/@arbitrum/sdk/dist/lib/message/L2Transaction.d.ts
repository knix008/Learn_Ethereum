import { TransactionReceipt } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { Log } from '@ethersproject/abstract-provider';
import { ContractTransaction, providers } from 'ethers';
import { SignerOrProvider } from '../dataEntities/signerOrProvider';
import { L2ToL1MessageReaderOrWriter, L2ToL1TransactionEvent } from './L2ToL1Message';
import { RedeemScheduledEvent } from '../abi/ArbRetryableTx';
import { EventArgs } from '../dataEntities/event';
export interface L2ContractTransaction extends ContractTransaction {
    wait(confirmations?: number): Promise<L2TransactionReceipt>;
}
export interface RedeemTransaction extends L2ContractTransaction {
    waitForRedeem: () => Promise<TransactionReceipt>;
}
/**
 * Extension of ethers-js TransactionReceipt, adding Arbitrum-specific functionality
 */
export declare class L2TransactionReceipt implements TransactionReceipt {
    readonly to: string;
    readonly from: string;
    readonly contractAddress: string;
    readonly transactionIndex: number;
    readonly root?: string;
    readonly gasUsed: BigNumber;
    readonly logsBloom: string;
    readonly blockHash: string;
    readonly transactionHash: string;
    readonly logs: Array<Log>;
    readonly blockNumber: number;
    readonly confirmations: number;
    readonly cumulativeGasUsed: BigNumber;
    readonly effectiveGasPrice: BigNumber;
    readonly byzantium: boolean;
    readonly type: number;
    readonly status?: number;
    constructor(tx: TransactionReceipt);
    /**
     * Get an L2ToL1TxEvent events created by this transaction
     * @returns
     */
    getL2ToL1Events(): L2ToL1TransactionEvent[];
    /**
     * Get event data for any redeems that were scheduled in this transaction
     * @returns
     */
    getRedeemScheduledEvents(): EventArgs<RedeemScheduledEvent>[];
    /**
     * Get any l2-to-l1-messages created by this transaction
     * @param l2SignerOrProvider
     */
    getL2ToL1Messages<T extends SignerOrProvider>(l1SignerOrProvider: T): Promise<L2ToL1MessageReaderOrWriter<T>[]>;
    /**
     * Get number of L1 confirmations that the batch including this tx has
     * @param l2Provider
     * @returns number of confirmations of batch including tx, or 0 if no batch included this tx
     */
    getBatchConfirmations(l2Provider: providers.JsonRpcProvider): Promise<BigNumber>;
    /**
     * Get the number of the batch that included this tx (will throw if no such batch exists)
     * @param l2Provider
     * @returns number of batch in which tx was included, or errors if no batch includes the current tx
     */
    getBatchNumber(l2Provider: providers.JsonRpcProvider): Promise<BigNumber>;
    /**
     * Whether the data associated with this transaction has been
     * made available on L1
     * @param l2Provider
     * @param confirmations The number of confirmations on the batch before data is to be considered available
     * @returns
     */
    isDataAvailable(l2Provider: providers.JsonRpcProvider, confirmations?: number): Promise<boolean>;
    /**
     * Replaces the wait function with one that returns an L2TransactionReceipt
     * @param contractTransaction
     * @returns
     */
    static monkeyPatchWait: (contractTransaction: ContractTransaction) => L2ContractTransaction;
    /**
     * Adds a waitForRedeem function to a redeem transaction
     * @param redeemTx
     * @param l2Provider
     * @returns
     */
    static toRedeemTransaction(redeemTx: L2ContractTransaction, l2Provider: providers.Provider): RedeemTransaction;
}
