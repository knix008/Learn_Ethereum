"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.L2ToL1MessageStatus = exports.InboxMessageKind = void 0;
/**
 * The inbox message kind as defined in:
 * https://github.com/OffchainLabs/nitro/blob/c7f3429e2456bf5ca296a49cec3bb437420bc2bb/contracts/src/libraries/MessageTypes.sol
 */
var InboxMessageKind;
(function (InboxMessageKind) {
    InboxMessageKind[InboxMessageKind["L1MessageType_submitRetryableTx"] = 9] = "L1MessageType_submitRetryableTx";
    InboxMessageKind[InboxMessageKind["L1MessageType_ethDeposit"] = 12] = "L1MessageType_ethDeposit";
    InboxMessageKind[InboxMessageKind["L2MessageType_signedTx"] = 4] = "L2MessageType_signedTx";
})(InboxMessageKind = exports.InboxMessageKind || (exports.InboxMessageKind = {}));
var L2ToL1MessageStatus;
(function (L2ToL1MessageStatus) {
    /**
     * ArbSys.sendTxToL1 called, but assertion not yet confirmed
     */
    L2ToL1MessageStatus[L2ToL1MessageStatus["UNCONFIRMED"] = 0] = "UNCONFIRMED";
    /**
     * Assertion for outgoing message confirmed, but message not yet executed
     */
    L2ToL1MessageStatus[L2ToL1MessageStatus["CONFIRMED"] = 1] = "CONFIRMED";
    /**
     * Outgoing message executed (terminal state)
     */
    L2ToL1MessageStatus[L2ToL1MessageStatus["EXECUTED"] = 2] = "EXECUTED";
})(L2ToL1MessageStatus = exports.L2ToL1MessageStatus || (exports.L2ToL1MessageStatus = {}));
