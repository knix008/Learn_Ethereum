// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Owned.sol";

/**
 * make contract function pausable
 */
contract Pausable is Owned {
    event PausedEvt(address account);
    event UnpausedEvt(address account);
    bool private paused;

    constructor() {
        paused = false;
    }

    modifier whenNotPaused() {
        require(!paused);
        _;
    }
    modifier whenPaused() {
        require(paused);
        _;
    }

    function pause() external onlyAdmin whenNotPaused {
        paused = true;
        emit PausedEvt(msg.sender);
    }

    function unpause() external onlyAdmin whenPaused {
        paused = false;
        emit UnpausedEvt(msg.sender);
    }
}
