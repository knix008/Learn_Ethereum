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
exports.L2ToL1MessageWriterClassic = exports.L2ToL1MessageReaderClassic = exports.L2ToL1MessageClassic = void 0;
const constants_1 = require("../dataEntities/constants");
const ArbSys__factory_1 = require("../abi/factories/ArbSys__factory");
const Outbox__factory_1 = require("../abi/classic/factories/Outbox__factory");
const NodeInterface__factory_1 = require("../abi/factories/NodeInterface__factory");
const eventFetcher_1 = require("../utils/eventFetcher");
const signerOrProvider_1 = require("../dataEntities/signerOrProvider");
const lib_1 = require("../utils/lib");
const errors_1 = require("../dataEntities/errors");
const message_1 = require("../dataEntities/message");
const networks_1 = require("../dataEntities/networks");
class L2ToL1MessageClassic {
    constructor(batchNumber, indexInBatch) {
        this.batchNumber = batchNumber;
        this.indexInBatch = indexInBatch;
    }
    static fromBatchNumber(l1SignerOrProvider, batchNumber, indexInBatch, l1Provider) {
        return signerOrProvider_1.SignerProviderUtils.isSigner(l1SignerOrProvider)
            ? new L2ToL1MessageWriterClassic(l1SignerOrProvider, batchNumber, indexInBatch, l1Provider)
            : new L2ToL1MessageReaderClassic(l1SignerOrProvider, batchNumber, indexInBatch);
    }
    static async getL2ToL1Events(l2Provider, filter, batchNumber, destination, uniqueId, indexInBatch) {
        const eventFetcher = new eventFetcher_1.EventFetcher(l2Provider);
        const events = (await eventFetcher.getEvents(ArbSys__factory_1.ArbSys__factory, t => t.filters.L2ToL1Transaction(null, destination, uniqueId, batchNumber), Object.assign(Object.assign({}, filter), { address: constants_1.ARB_SYS_ADDRESS }))).map(l => (Object.assign(Object.assign({}, l.event), { transactionHash: l.transactionHash })));
        if (indexInBatch) {
            const indexItems = events.filter(b => b.indexInBatch.eq(indexInBatch));
            if (indexItems.length === 1) {
                return indexItems;
            }
            else if (indexItems.length > 1) {
                throw new errors_1.ArbSdkError('More than one indexed item found in batch.');
            }
            else
                return [];
        }
        else
            return events;
    }
}
exports.L2ToL1MessageClassic = L2ToL1MessageClassic;
/**
 * Provides read-only access for classic l2-to-l1-messages
 */
class L2ToL1MessageReaderClassic extends L2ToL1MessageClassic {
    constructor(l1Provider, batchNumber, indexInBatch) {
        super(batchNumber, indexInBatch);
        this.l1Provider = l1Provider;
        /**
         * Contains the classic outbox address, or set to zero address if this network
         * did not have a classic outbox deployed
         */
        this.outboxAddress = null;
        this.proof = null;
    }
    /**
     * Classic had 2 outboxes, we need to find the correct one for the provided batch number
     * @param l2Provider
     * @param batchNumber
     * @returns
     */
    async getOutboxAddress(l2Provider, batchNumber) {
        if (!(0, lib_1.isDefined)(this.outboxAddress)) {
            const l2Network = await (0, networks_1.getL2Network)(l2Provider);
            // find the outbox where the activation batch number of the next outbox
            // is greater than the supplied batch
            const outboxes = (0, lib_1.isDefined)(l2Network.ethBridge.classicOutboxes)
                ? Object.entries(l2Network.ethBridge.classicOutboxes)
                : [];
            const res = outboxes
                .sort((a, b) => {
                if (a[1] < b[1])
                    return -1;
                else if (a[1] === b[1])
                    return 0;
                else
                    return 1;
            })
                .find((_, index, array) => array[index + 1] === undefined || array[index + 1][1] > batchNumber);
            if (!res) {
                this.outboxAddress = '0x0000000000000000000000000000000000000000';
            }
            else {
                this.outboxAddress = res[0];
            }
        }
        return this.outboxAddress;
    }
    async outboxEntryExists(l2Provider) {
        const outboxAddress = await this.getOutboxAddress(l2Provider, this.batchNumber.toNumber());
        const outbox = Outbox__factory_1.Outbox__factory.connect(outboxAddress, this.l1Provider);
        return await outbox.outboxEntryExists(this.batchNumber);
    }
    static async tryGetProof(l2Provider, batchNumber, indexInBatch) {
        const nodeInterface = NodeInterface__factory_1.NodeInterface__factory.connect(constants_1.NODE_INTERFACE_ADDRESS, l2Provider);
        try {
            return await nodeInterface.legacyLookupMessageBatchProof(batchNumber, indexInBatch);
        }
        catch (e) {
            const expectedError = "batch doesn't exist";
            const err = e;
            const actualError = err && (err.message || (err.error && err.error.message));
            if (actualError.includes(expectedError))
                return null;
            else
                throw e;
        }
    }
    /**
     * Get the execution proof for this message. Returns null if the batch does not exist yet.
     * @param l2Provider
     * @returns
     */
    async tryGetProof(l2Provider) {
        if (!(0, lib_1.isDefined)(this.proof)) {
            this.proof = await L2ToL1MessageReaderClassic.tryGetProof(l2Provider, this.batchNumber, this.indexInBatch);
        }
        return this.proof;
    }
    /**
     * Check if given outbox message has already been executed
     */
    async hasExecuted(l2Provider) {
        var _a, _b;
        const proofInfo = await this.tryGetProof(l2Provider);
        if (!(0, lib_1.isDefined)(proofInfo))
            return false;
        const outboxAddress = await this.getOutboxAddress(l2Provider, this.batchNumber.toNumber());
        const outbox = Outbox__factory_1.Outbox__factory.connect(outboxAddress, this.l1Provider);
        try {
            await outbox.callStatic.executeTransaction(this.batchNumber, proofInfo.proof, proofInfo.path, proofInfo.l2Sender, proofInfo.l1Dest, proofInfo.l2Block, proofInfo.l1Block, proofInfo.timestamp, proofInfo.amount, proofInfo.calldataForL1);
            return false;
        }
        catch (err) {
            const e = err;
            if ((_a = e === null || e === void 0 ? void 0 : e.message) === null || _a === void 0 ? void 0 : _a.toString().includes('ALREADY_SPENT'))
                return true;
            if ((_b = e === null || e === void 0 ? void 0 : e.message) === null || _b === void 0 ? void 0 : _b.toString().includes('NO_OUTBOX_ENTRY'))
                return false;
            throw e;
        }
    }
    /**
     * Get the status of this message
     * In order to check if the message has been executed proof info must be provided.
     * @param proofInfo
     * @returns
     */
    async status(l2Provider) {
        try {
            const messageExecuted = await this.hasExecuted(l2Provider);
            if (messageExecuted) {
                return message_1.L2ToL1MessageStatus.EXECUTED;
            }
            const outboxEntryExists = await this.outboxEntryExists(l2Provider);
            return outboxEntryExists
                ? message_1.L2ToL1MessageStatus.CONFIRMED
                : message_1.L2ToL1MessageStatus.UNCONFIRMED;
        }
        catch (e) {
            return message_1.L2ToL1MessageStatus.UNCONFIRMED;
        }
    }
    /**
     * Waits until the outbox entry has been created, and will not return until it has been.
     * WARNING: Outbox entries are only created when the corresponding node is confirmed. Which
     * can take 1 week+, so waiting here could be a very long operation.
     * @param retryDelay
     * @returns outbox entry status (either executed or confirmed but not pending)
     */
    async waitUntilOutboxEntryCreated(l2Provider, retryDelay = 500) {
        const exists = await this.outboxEntryExists(l2Provider);
        if (exists) {
            return (await this.hasExecuted(l2Provider))
                ? message_1.L2ToL1MessageStatus.EXECUTED
                : message_1.L2ToL1MessageStatus.CONFIRMED;
        }
        else {
            await (0, lib_1.wait)(retryDelay);
            return await this.waitUntilOutboxEntryCreated(l2Provider, retryDelay);
        }
    }
    /**
     * Estimates the L1 block number in which this L2 to L1 tx will be available for execution
     * @param l2Provider
     * @returns Always returns null for classic l2toL1 messages since they can be executed in any block now.
     */
    async getFirstExecutableBlock(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    l2Provider) {
        return null;
    }
}
exports.L2ToL1MessageReaderClassic = L2ToL1MessageReaderClassic;
/**
 * Provides read and write access for classic l2-to-l1-messages
 */
class L2ToL1MessageWriterClassic extends L2ToL1MessageReaderClassic {
    /**
     * Instantiates a new `L2ToL1MessageWriterClassic` object.
     *
     * @param {Signer} l1Signer The signer to be used for executing the L2-to-L1 message.
     * @param {BigNumber} batchNumber The number of the batch containing the L2-to-L1 message.
     * @param {BigNumber} indexInBatch The index of the L2-to-L1 message within the batch.
     * @param {Provider} [l1Provider] Optional. Used to override the Provider which is attached to `l1Signer` in case you need more control. This will be a required parameter in a future major version update.
     */
    constructor(l1Signer, batchNumber, indexInBatch, l1Provider) {
        super(l1Provider !== null && l1Provider !== void 0 ? l1Provider : l1Signer.provider, batchNumber, indexInBatch);
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
        const proofInfo = await this.tryGetProof(l2Provider);
        if (!(0, lib_1.isDefined)(proofInfo)) {
            throw new errors_1.ArbSdkError(`Unexpected missing proof: ${this.batchNumber.toString()} ${this.indexInBatch.toString()}}`);
        }
        const outboxAddress = await this.getOutboxAddress(l2Provider, this.batchNumber.toNumber());
        const outbox = Outbox__factory_1.Outbox__factory.connect(outboxAddress, this.l1Signer);
        // We can predict and print number of missing blocks
        // if not challenged
        return await outbox.functions.executeTransaction(this.batchNumber, proofInfo.proof, proofInfo.path, proofInfo.l2Sender, proofInfo.l1Dest, proofInfo.l2Block, proofInfo.l1Block, proofInfo.timestamp, proofInfo.amount, proofInfo.calldataForL1, overrides || {});
    }
}
exports.L2ToL1MessageWriterClassic = L2ToL1MessageWriterClassic;
