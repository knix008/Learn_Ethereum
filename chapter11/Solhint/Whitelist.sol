// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Owned.sol";

/**
 * manage whitelsit
 */
contract Whitelist is Owned {
    mapping(address => bool) private whitelist;

    function addWhitelist(address account) public onlyAdmin {
        require(account != address(0) && !whitelist[account]);
        whitelist[account] = true;
    }

    function isWhitelist(address account) public view returns (bool) {
        return whitelist[account];
    }

    function removeWhitelisted(address account) external onlyAdmin {
        require(account != address(0) && whitelist[account]);
        whitelist[account] = false;
    }
}
