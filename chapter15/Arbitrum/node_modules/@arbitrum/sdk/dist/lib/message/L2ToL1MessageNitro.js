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
Object.defineProperty(exports, "__esModule", { value: true });
exports.L2ToL1MessageWriterNitro = exports.L2ToL1MessageReaderNitro = exports.L2ToL1MessageNitro = void 0;
const constants_1 = require("../dataEntities/constants");
const bignumber_1 = require("@ethersproject/bignumber");
const ArbSys__factory_1 = require("../abi/factories/ArbSys__factory");
const RollupUserLogic__factory_1 = require("../abi/factories/RollupUserLogic__factory");
const Outbox__factory_1 = require("../abi/factories/Outbox__factory");
const NodeInterface__factory_1 = require("../abi/factories/NodeInterface__factory");
const async_mutex_1 = require("async-mutex");
const eventFetcher_1 = require("../utils/eventFetcher");
const errors_1 = require("../dataEntities/errors");
const signerOrProvider_1 = require("../dataEntities/signerOrProvider");
const lib_1 = require("../utils/lib");
const networks_1 = require("../dataEntities/networks");
const arbProvider_1 = require("../utils/arbProvider");
const message_1 = require("../dataEntities/message");
// expected number of L1 blocks that it takes for an L2 tx to be included in a L1 assertion
const ASSERTION_CREATED_PADDING = 50;
// expected number of L1 blocks that it takes for a validator to confirm an L1 block after the node deadline is passed
const ASSERTION_CONFIRMED_PADDING = 20;
const l2BlockRangeCache = {};
const mutex = new async_mutex_1.Mutex();
function getL2BlockRangeCacheKey({ l2ChainId, l1BlockNumber, }) {
    return `${l2ChainId}-${l1BlockNumber}`;
}
function setL2BlockRangeCache(key, value) {
    l2BlockRangeCache[key] = value;
}
async function getBlockRangesForL1BlockWithCache({ l1Provider, l2Provider, forL1Block, }) {
    const l2ChainId = (await l2Provider.getNetwork()).chainId;
    const key = getL2BlockRangeCacheKey({
        l2ChainId,
        l1BlockNumber: forL1Block,
    });
    if (l2BlockRangeCache[key]) {
        return l2BlockRangeCache[key];
    }
    // implements a lock that only fetches cache once
    const release = await mutex.acquire();
    // if cache has been acquired while awaiting the lock
    if (l2BlockRangeCache[key]) {
        release();
        return l2BlockRangeCache[key];
    }
    try {
        const l2BlockRange = await (0, lib_1.getBlockRangesForL1Block)({
            forL1Block,
            provider: l1Provider,
        });
        setL2BlockRangeCache(key, l2BlockRange);
    }
    finally {
        release();
    }
    return l2BlockRangeCache[key];
}
/**
 * Base functionality for nitro L2->L1 messages
 */
class L2ToL1MessageNitro {
    constructor(event) {
        this.event = event;
    }
    static fromEvent(l1SignerOrProvider, event, l1Provider) {
        return signerOrProvider_1.SignerProviderUtils.isSigner(l1SignerOrProvider)
            ? new L2ToL1MessageWriterNitro(l1SignerOrProvider, event, l1Provider)
            : new L2ToL1MessageReaderNitro(l1SignerOrProvider, event);
    }
    static async getL2ToL1Events(l2Provider, filter, position, destination, hash) {
        const eventFetcher = new eventFetcher_1.EventFetcher(l2Provider);
        return (await eventFetcher.getEvents(ArbSys__factory_1.ArbSys__factory, t => t.filters.L2ToL1Tx(null, destination, hash, position), Object.assign(Object.assign({}, filter), { address: constants_1.ARB_SYS_ADDRESS }))).map(l => (Object.assign(Object.assign({}, l.event), { transactionHash: l.transactionHash })));
    }
}
exports.L2ToL1MessageNitro = L2ToL1MessageNitro;
/**
 * Provides read-only access nitro for l2-to-l1-messages
 */
class L2ToL1MessageReaderNitro extends L2ToL1MessageNitro {
    constructor(l1Provider, event) {
        super(event);
        this.l1Provider = l1Provider;
    }
    async getOutboxProof(l2Provider) {
        const { sendRootSize } = await this.getSendProps(l2Provider);
        if (!sendRootSize)
            throw new errors_1.ArbSdkError('Node not yet created, cannot get proof.');
        const nodeInterface = NodeInterface__factory_1.NodeInterface__factory.connect(constants_1.NODE_INTERFACE_ADDRESS, l2Provider);
        const outboxProofParams = await nodeInterface.callStatic.constructOutboxProof(sendRootSize.toNumber(), this.event.position.toNumber());
        return outboxProofParams.proof;
    }
    /**
     * Check if this message has already been executed in the Outbox
     */
    async hasExecuted(l2Provider) {
        const l2Network = await (0, networks_1.getL2Network)(l2Provider);
        const outbox = Outbox__factory_1.Outbox__factory.connect(l2Network.ethBridge.outbox, this.l1Provider);
        return outbox.callStatic.isSpent(this.event.position);
    }
    /**
     * Get the status of this message
     * In order to check if the message has been executed proof info must be provided.
     * @returns
     */
    async status(l2Provider) {
        const { sendRootConfirmed } = await this.getSendProps(l2Provider);
        if (!sendRootConfirmed)
            return message_1.L2ToL1MessageStatus.UNCONFIRMED;
        return (await this.hasExecuted(l2Provider))
            ? message_1.L2ToL1MessageStatus.EXECUTED
            : message_1.L2ToL1MessageStatus.CONFIRMED;
    }
    parseNodeCreatedAssertion(event) {
        return {
            afterState: {
                blockHash: event.event.assertion.afterState.globalState.bytes32Vals[0],
                sendRoot: event.event.assertion.afterState.globalState.bytes32Vals[1],
            },
        };
    }
    async getBlockFromNodeLog(l2Provider, log) {
        const arbitrumProvider = new arbProvider_1.ArbitrumProvider(l2Provider);
        if (!log) {
            console.warn('No NodeCreated events found, defaulting to block 0');
            return arbitrumProvider.getBlock(0);
        }
        const parsedLog = this.parseNodeCreatedAssertion(log);
        const l2Block = await arbitrumProvider.getBlock(parsedLog.afterState.blockHash);
        if (!l2Block) {
            throw new errors_1.ArbSdkError(`Block not found. ${parsedLog.afterState.blockHash}`);
        }
        if (l2Block.sendRoot !== parsedLog.afterState.sendRoot) {
            throw new errors_1.ArbSdkError(`L2 block send root doesn't match parsed log. ${l2Block.sendRoot} ${parsedLog.afterState.sendRoot}`);
        }
        return l2Block;
    }
    async getBlockFromNodeNum(rollup, nodeNum, l2Provider) {
        const { createdAtBlock } = await rollup.getNode(nodeNum);
        let createdFromBlock = createdAtBlock;
        let createdToBlock = createdAtBlock;
        // If L1 is Arbitrum, then L2 is an Orbit chain.
        if (await (0, lib_1.isArbitrumChain)(this.l1Provider)) {
            try {
                const nodeInterface = NodeInterface__factory_1.NodeInterface__factory.connect(constants_1.NODE_INTERFACE_ADDRESS, this.l1Provider);
                const l2BlockRangeFromNode = await nodeInterface.l2BlockRangeForL1(createdAtBlock);
                createdFromBlock = l2BlockRangeFromNode.firstBlock;
                createdToBlock = l2BlockRangeFromNode.lastBlock;
            }
            catch (_a) {
                // defaults to binary search
                try {
                    const l2BlockRange = await getBlockRangesForL1BlockWithCache({
                        l1Provider: this.l1Provider,
                        l2Provider: l2Provider,
                        forL1Block: createdAtBlock.toNumber(),
                    });
                    const startBlock = l2BlockRange[0];
                    const endBlock = l2BlockRange[1];
                    if (!startBlock || !endBlock) {
                        throw new Error();
                    }
                    createdFromBlock = bignumber_1.BigNumber.from(startBlock);
                    createdToBlock = bignumber_1.BigNumber.from(endBlock);
                }
                catch (_b) {
                    // fallback to the original method
                    createdFromBlock = createdAtBlock;
                    createdToBlock = createdAtBlock;
                }
            }
        }
        // now get the block hash and sendroot for that node
        const eventFetcher = new eventFetcher_1.EventFetcher(rollup.provider);
        const logs = await eventFetcher.getEvents(RollupUserLogic__factory_1.RollupUserLogic__factory, t => t.filters.NodeCreated(nodeNum), {
            fromBlock: createdFromBlock.toNumber(),
            toBlock: createdToBlock.toNumber(),
            address: rollup.address,
        });
        if (logs.length > 1)
            throw new errors_1.ArbSdkError(`Unexpected number of NodeCreated events. Expected 0 or 1, got ${logs.length}.`);
        return await this.getBlockFromNodeLog(l2Provider, logs[0]);
    }
    async getBatchNumber(l2Provider) {
        if (this.l1BatchNumber == undefined) {
            // findBatchContainingBlock errors if block number does not exist
            try {
                const nodeInterface = NodeInterface__factory_1.NodeInterface__factory.connect(constants_1.NODE_INTERFACE_ADDRESS, l2Provider);
                const res = await nodeInterface.findBatchContainingBlock(this.event.arbBlockNum);
                this.l1BatchNumber = res.toNumber();
            }
            catch (err) {
                // do nothing - errors are expected here
            }
        }
        return this.l1BatchNumber;
    }
    async getSendProps(l2Provider) {
        if (!this.sendRootConfirmed) {
            const l2Network = await (0, networks_1.getL2Network)(l2Provider);
            const rollup = RollupUserLogic__factory_1.RollupUserLogic__factory.connect(l2Network.ethBridge.rollup, this.l1Provider);
            const latestConfirmedNodeNum = await rollup.callStatic.latestConfirmed();
            const l2BlockConfirmed = await this.getBlockFromNodeNum(rollup, latestConfirmedNodeNum, l2Provider);
            const sendRootSizeConfirmed = bignumber_1.BigNumber.from(l2BlockConfirmed.sendCount);
            if (sendRootSizeConfirmed.gt(this.event.position)) {
                this.sendRootSize = sendRootSizeConfirmed;
                this.sendRootHash = l2BlockConfirmed.sendRoot;
                this.sendRootConfirmed = true;
            }
            else {
                // if the node has yet to be confirmed we'll still try to find proof info from unconfirmed nodes
                const latestNodeNum = await rollup.callStatic.latestNodeCreated();
                if (latestNodeNum.gt(latestConfirmedNodeNum)) {
                    // In rare case latestNodeNum can be equal to latestConfirmedNodeNum
                    // eg immediately after an upgrade, or at genesis, or on a chain where confirmation time = 0 like AnyTrust may have
                    const l2Block = await this.getBlockFromNodeNum(rollup, latestNodeNum, l2Provider);
                    const sendRootSize = bignumber_1.BigNumber.from(l2Block.sendCount);
                    if (sendRootSize.gt(this.event.position)) {
                        this.sendRootSize = sendRootSize;
                        this.sendRootHash = l2Block.sendRoot;
                    }
                }
            }
        }
        return {
            sendRootSize: this.sendRootSize,
            sendRootHash: this.sendRootHash,
            sendRootConfirmed: this.sendRootConfirmed,
        };
    }
    /**
     * Waits until the outbox entry has been created, and will not return until it has been.
     * WARNING: Outbox entries are only created when the corresponding node is confirmed. Which
     * can take 1 week+, so waiting here could be a very long operation.
     * @param retryDelay
     * @returns outbox entry status (either executed or confirmed but not pending)
     */
    async waitUntilReadyToExecute(l2Provider, retryDelay = 500) {
        const status = await this.status(l2Provider);
        if (status === message_1.L2ToL1MessageStatus.CONFIRMED ||
            status === message_1.L2ToL1MessageStatus.EXECUTED) {
            return status;
        }
        else {
            await (0, lib_1.wait)(retryDelay);
            return await this.waitUntilReadyToExecute(l2Provider, retryDelay);
        }
    }
    /**
     * Estimates the L1 block number in which this L2 to L1 tx will be available for execution.
     * If the message can or already has been executed, this returns null
     * @param l2Provider
     * @returns expected L1 block number where the L2 to L1 message will be executable. Returns null if the message can be or already has been executed
     */
    async getFirstExecutableBlock(l2Provider) {
        const l2Network = await (0, networks_1.getL2Network)(l2Provider);
        const rollup = RollupUserLogic__factory_1.RollupUserLogic__factory.connect(l2Network.ethBridge.rollup, this.l1Provider);
        const status = await this.status(l2Provider);
        if (status === message_1.L2ToL1MessageStatus.EXECUTED)
            return null;
        if (status === message_1.L2ToL1MessageStatus.CONFIRMED)
            return null;
        // consistency check in case we change the enum in the future
        if (status !== message_1.L2ToL1MessageStatus.UNCONFIRMED)
            throw new errors_1.ArbSdkError('L2ToL1Msg expected to be unconfirmed');
        const latestBlock = await this.l1Provider.getBlockNumber();
        const eventFetcher = new eventFetcher_1.EventFetcher(this.l1Provider);
        const logs = (await eventFetcher.getEvents(RollupUserLogic__factory_1.RollupUserLogic__factory, t => t.filters.NodeCreated(), {
            fromBlock: Math.max(latestBlock -
                bignumber_1.BigNumber.from(l2Network.confirmPeriodBlocks)
                    .add(ASSERTION_CONFIRMED_PADDING)
                    .toNumber(), 0),
            toBlock: 'latest',
            address: rollup.address,
        })).sort((a, b) => a.event.nodeNum.toNumber() - b.event.nodeNum.toNumber());
        const lastL2Block = logs.length === 0
            ? undefined
            : await this.getBlockFromNodeLog(l2Provider, logs[logs.length - 1]);
        const lastSendCount = lastL2Block
            ? bignumber_1.BigNumber.from(lastL2Block.sendCount)
            : bignumber_1.BigNumber.from(0);
        // here we assume the L2 to L1 tx is actually valid, so the user needs to wait the max time
        // since there isn't a pending node that includes this message yet
        if (lastSendCount.lte(this.event.position))
            return bignumber_1.BigNumber.from(l2Network.confirmPeriodBlocks)
                .add(ASSERTION_CREATED_PADDING)
                .add(ASSERTION_CONFIRMED_PADDING)
                .add(latestBlock);
        // use binary search to find the first node with sendCount > this.event.position
        // default to the last node since we already checked above
        let foundLog = logs[logs.length - 1];
        let left = 0;
        let right = logs.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const log = logs[mid];
            const l2Block = await this.getBlockFromNodeLog(l2Provider, log);
            const sendCount = bignumber_1.BigNumber.from(l2Block.sendCount);
            if (sendCount.gt(this.event.position)) {
                foundLog = log;
                right = mid - 1;
            }
            else {
                left = mid + 1;
            }
        }
        const earliestNodeWithExit = foundLog.event.nodeNum;
        const node = await rollup.getNode(earliestNodeWithExit);
        return node.deadlineBlock.add(ASSERTION_CONFIRMED_PADDING);
    }
}
exports.L2ToL1MessageReaderNitro = L2ToL1MessageReaderNitro;
/**
 * Provides read and write access for nitro l2-to-l1-messages
 */
class L2ToL1MessageWriterNitro extends L2ToL1MessageReaderNitro {
    /**
     * Instantiates a new `L2ToL1MessageWriterNitro` object.
     *
     * @param {Signer} l1Signer The signer to be used for executing the L2-to-L1 message.
     * @param {EventArgs<L2ToL1TxEvent>} event The event containing the data of the L2-to-L1 message.
     * @param {Provider} [l1Provider] Optional. Used to override the Provider which is attached to `l1Signer` in case you need more control. This will be a required parameter in a future major version update.
     */
    constructor(l1Signer, event, l1Provider) {
        super(l1Provider !== null && l1Provider !== void 0 ? l1Provider : l1Signer.provider, event);
        this.l1Signer = l1Signer;
    }
    /**
     * Executes the L2ToL1Message on L1.
     * Will throw an error if the outbox entry has not been created, which happens when the
     * corresponding assertion is confirmed.
     * @returns
     */
    async execute(l2Provider, overrides) {
        const status = await this.status(l2Provider);
        if (status !== message_1.L2ToL1MessageStatus.CONFIRMED) {
            throw new errors_1.ArbSdkError(`Cannot execute message. Status is: ${status} but must be ${message_1.L2ToL1MessageStatus.CONFIRMED}.`);
        }
        const proof = await this.getOutboxProof(l2Provider);
        const l2Network = await (0, networks_1.getL2Network)(l2Provider);
        const outbox = Outbox__factory_1.Outbox__factory.connect(l2Network.ethBridge.outbox, this.l1Signer);
        return await outbox.executeTransaction(proof, this.event.position, this.event.caller, this.event.destination, this.event.arbBlockNum, this.event.ethBlockNum, this.event.timestamp, this.event.callvalue, this.event.data, overrides || {});
    }
}
exports.L2ToL1MessageWriterNitro = L2ToL1MessageWriterNitro;
