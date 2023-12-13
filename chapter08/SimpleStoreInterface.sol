// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 *@notice smart contract for SimpleStoreInterface
 * @ Learn Ethereum 2nd Edition
 * @author brian wu
 */
interface SimpleStoreInterface {
    function getValue() external view returns (uint256);
}
