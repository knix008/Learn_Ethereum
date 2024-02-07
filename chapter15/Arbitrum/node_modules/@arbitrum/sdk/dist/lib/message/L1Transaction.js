/*
 * Copyright 2021, Offchain Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-env node */
'use strict';
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.L1ContractCallTransactionReceipt = exports.L1EthDepositTransactionReceipt = exports.L1TransactionReceipt = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const L1ToL2Message_1 = require("./L1ToL2Message");
const L1ERC20Gateway__factory_1 = require("../abi/factories/L1ERC20Gateway__factory");
const signerOrProvider_1 = require("../dataEntities/signerOrProvider");
const errors_1 = require("../dataEntities/errors");
const Inbox__factory_1 = require("../abi/factories/Inbox__factory");
const message_1 = require("../dataEntities/message");
const Bridge__factory_1 = require("../abi/factories/Bridge__factory");
const event_1 = require("../dataEntities/event");
const lib_1 = require("../utils/lib");
const messageDataParser_1 = require("./messageDataParser");
const networks_1 = require("../dataEntities/networks");
class L1TransactionReceipt {
    constructor(tx) {
        this.to = tx.to;
        this.from = tx.from;
        this.contractAddress = tx.contractAddress;
        this.transactionIndex = tx.transactionIndex;
        this.root = tx.root;
        this.gasUsed = tx.gasUsed;
        this.logsBloom = tx.logsBloom;
        this.blockHash = tx.blockHash;
        this.transactionHash = tx.transactionHash;
        this.logs = tx.logs;
        this.blockNumber = tx.blockNumber;
        this.confirmations = tx.confirmations;
        this.cumulativeGasUsed = tx.cumulativeGasUsed;
        this.effectiveGasPrice = tx.effectiveGasPrice;
        this.byzantium = tx.byzantium;
        this.type = tx.type;
        this.status = tx.status;
    }
    /**
     * Check if is a classic transaction
     * @param l2SignerOrProvider
     */
    async isClassic(l2SignerOrProvider) {
        const provider = signerOrProvider_1.SignerProviderUtils.getProviderOrThrow(l2SignerOrProvider);
        const network = await (0, networks_1.getL2Network)(provider);
        return this.blockNumber < network.nitroGenesisL1Block;
    }
    /**
     * Get any MessageDelivered events that were emitted during this transaction
     * @returns
     */
    getMessageDeliveredEvents() {
        return (0, event_1.parseTypedLogs)(Bridge__factory_1.Bridge__factory, this.logs, 'MessageDelivered');
    }
    /**
     * Get any InboxMessageDelivered events that were emitted during this transaction
     * @returns
     */
    getInboxMessageDeliveredEvents() {
        return (0, event_1.parseTypedLogs)(Inbox__factory_1.Inbox__factory, this.logs, 'InboxMessageDelivered(uint256,bytes)');
    }
    /**
     * Get combined data for any InboxMessageDelivered and MessageDelivered events
     * emitted during this transaction
     * @returns
     */
    getMessageEvents() {
        const bridgeMessages = this.getMessageDeliveredEvents();
        const inboxMessages = this.getInboxMessageDeliveredEvents();
        if (bridgeMessages.length !== inboxMessages.length) {
            throw new errors_1.ArbSdkError(`Unexpected missing events. Inbox message count: ${inboxMessages.length} does not equal bridge message count: ${bridgeMessages.length}. ${JSON.stringify(inboxMessages)} ${JSON.stringify(bridgeMessages)}`);
        }
        const messages = [];
        for (const bm of bridgeMessages) {
            const im = inboxMessages.filter(i => i.messageNum.eq(bm.messageIndex))[0];
            if (!im) {
                throw new errors_1.ArbSdkError(`Unexepected missing event for message index: ${bm.messageIndex.toString()}. ${JSON.stringify(inboxMessages)}`);
            }
            messages.push({
                inboxMessageEvent: im,
                bridgeMessageEvent: bm,
            });
        }
        return messages;
    }
    /**
     * Get any eth deposit messages created by this transaction
     * @param l2SignerOrProvider
     */
    async getEthDeposits(l2Provider) {
        return Promise.all(this.getMessageEvents()
            .filter(e => e.bridgeMessageEvent.kind ===
            message_1.InboxMessageKind.L1MessageType_ethDeposit)
            .map(m => L1ToL2Message_1.EthDepositMessage.fromEventComponents(l2Provider, m.inboxMessageEvent.messageNum, m.bridgeMessageEvent.sender, m.inboxMessageEvent.data)));
    }
    /**
     * Get classic l1tol2 messages created by this transaction
     * @param l2Provider
     */
    async getL1ToL2MessagesClassic(l2Provider) {
        const network = await (0, networks_1.getL2Network)(l2Provider);
        const chainID = network.chainID.toString();
        const isClassic = await this.isClassic(l2Provider);
        // throw on nitro events
        if (!isClassic) {
            throw new Error("This method is only for classic transactions. Use 'getL1ToL2Messages' for nitro transactions.");
        }
        const messageNums = this.getInboxMessageDeliveredEvents().map(msg => msg.messageNum);
        return messageNums.map(messageNum => new L1ToL2Message_1.L1ToL2MessageReaderClassic(l2Provider, bignumber_1.BigNumber.from(chainID).toNumber(), messageNum));
    }
    async getL1ToL2Messages(l2SignerOrProvider) {
        const provider = signerOrProvider_1.SignerProviderUtils.getProviderOrThrow(l2SignerOrProvider);
        const network = await (0, networks_1.getL2Network)(provider);
        const chainID = network.chainID.toString();
        const isClassic = await this.isClassic(provider);
        // throw on classic events
        if (isClassic) {
            throw new Error("This method is only for nitro transactions. Use 'getL1ToL2MessagesClassic' for classic transactions.");
        }
        const events = this.getMessageEvents();
        return events
            .filter(e => e.bridgeMessageEvent.kind ===
            message_1.InboxMessageKind.L1MessageType_submitRetryableTx &&
            e.bridgeMessageEvent.inbox.toLowerCase() ===
                network.ethBridge.inbox.toLowerCase())
            .map(mn => {
            const messageDataParser = new messageDataParser_1.SubmitRetryableMessageDataParser();
            const inboxMessageData = messageDataParser.parse(mn.inboxMessageEvent.data);
            return L1ToL2Message_1.L1ToL2Message.fromEventComponents(l2SignerOrProvider, bignumber_1.BigNumber.from(chainID).toNumber(), mn.bridgeMessageEvent.sender, mn.inboxMessageEvent.messageNum, mn.bridgeMessageEvent.baseFeeL1, inboxMessageData);
        });
    }
    /**
     * Get any token deposit events created by this transaction
     * @returns
     */
    getTokenDepositEvents() {
        return (0, event_1.parseTypedLogs)(L1ERC20Gateway__factory_1.L1ERC20Gateway__factory, this.logs, 'DepositInitiated');
    }
}
exports.L1TransactionReceipt = L1TransactionReceipt;
_a = L1TransactionReceipt;
/**
 * Replaces the wait function with one that returns an L1TransactionReceipt
 * @param contractTransaction
 * @returns
 */
L1TransactionReceipt.monkeyPatchWait = (contractTransaction) => {
    const wait = contractTransaction.wait;
    contractTransaction.wait = async (confirmations) => {
        const result = await wait(confirmations);
        return new L1TransactionReceipt(result);
    };
    return contractTransaction;
};
/**
 * Replaces the wait function with one that returns an L1EthDepositTransactionReceipt
 * @param contractTransaction
 * @returns
 */
L1TransactionReceipt.monkeyPatchEthDepositWait = (contractTransaction) => {
    const wait = contractTransaction.wait;
    contractTransaction.wait = async (confirmations) => {
        const result = await wait(confirmations);
        return new L1EthDepositTransactionReceipt(result);
    };
    return contractTransaction;
};
/**
 * Replaces the wait function with one that returns an L1ContractCallTransactionReceipt
 * @param contractTransaction
 * @returns
 */
L1TransactionReceipt.monkeyPatchContractCallWait = (contractTransaction) => {
    const wait = contractTransaction.wait;
    contractTransaction.wait = async (confirmations) => {
        const result = await wait(confirmations);
        return new L1ContractCallTransactionReceipt(result);
    };
    return contractTransaction;
};
/**
 * An L1TransactionReceipt with additional functionality that only exists
 * if the transaction created a single eth deposit.
 */
class L1EthDepositTransactionReceipt extends L1TransactionReceipt {
    /**
     * Wait for the funds to arrive on L2
     * @param confirmations Amount of confirmations the retryable ticket and the auto redeem receipt should have
     * @param timeout Amount of time to wait for the retryable ticket to be created
     * Defaults to 15 minutes, as by this time all transactions are expected to be included on L2. Throws on timeout.
     * @returns The wait result contains `complete`, a `status`, the L1ToL2Message and optionally the `l2TxReceipt`
     * If `complete` is true then this message is in the terminal state.
     * For eth deposits complete this is when the status is FUNDS_DEPOSITED, EXPIRED or REDEEMED.
     */
    async waitForL2(l2Provider, confirmations, timeout) {
        const message = (await this.getEthDeposits(l2Provider))[0];
        if (!message)
            throw new errors_1.ArbSdkError('Unexpected missing Eth Deposit message.');
        const res = await message.wait(confirmations, timeout);
        return {
            complete: (0, lib_1.isDefined)(res),
            l2TxReceipt: res,
            message,
        };
    }
}
exports.L1EthDepositTransactionReceipt = L1EthDepositTransactionReceipt;
/**
 * An L1TransactionReceipt with additional functionality that only exists
 * if the transaction created a single call to an L2 contract - this includes
 * token deposits.
 */
class L1ContractCallTransactionReceipt extends L1TransactionReceipt {
    /**
     * Wait for the transaction to arrive and be executed on L2
     * @param confirmations Amount of confirmations the retryable ticket and the auto redeem receipt should have
     * @param timeout Amount of time to wait for the retryable ticket to be created
     * Defaults to 15 minutes, as by this time all transactions are expected to be included on L2. Throws on timeout.
     * @returns The wait result contains `complete`, a `status`, an L1ToL2Message and optionally the `l2TxReceipt`.
     * If `complete` is true then this message is in the terminal state.
     * For contract calls this is true only if the status is REDEEMED.
     */
    async waitForL2(l2SignerOrProvider, confirmations, timeout) {
        const message = (await this.getL1ToL2Messages(l2SignerOrProvider))[0];
        if (!message)
            throw new errors_1.ArbSdkError('Unexpected missing L1ToL2 message.');
        const res = await message.waitForStatus(confirmations, timeout);
        return Object.assign(Object.assign({ complete: res.status === L1ToL2Message_1.L1ToL2MessageStatus.REDEEMED }, res), { message });
    }
}
exports.L1ContractCallTransactionReceipt = L1ContractCallTransactionReceipt;
