"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isL2ToL1TransactionRequest = exports.isL1ToL2TransactionRequest = void 0;
const lib_1 = require("../utils/lib");
/**
 * Check if an object is of L1ToL2TransactionRequest type
 * @param possibleRequest
 * @returns
 */
const isL1ToL2TransactionRequest = (possibleRequest) => {
    return (0, lib_1.isDefined)(possibleRequest.txRequest);
};
exports.isL1ToL2TransactionRequest = isL1ToL2TransactionRequest;
/**
 * Check if an object is of L2ToL1TransactionRequest type
 * @param possibleRequest
 * @returns
 */
const isL2ToL1TransactionRequest = (possibleRequest) => {
    return possibleRequest.txRequest != undefined;
};
exports.isL2ToL1TransactionRequest = isL2ToL1TransactionRequest;
