// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * define owner, transfer owner and assign admin
 */
contract Owned {
    address private _owner;
    mapping(address => bool) private admins;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        _owner = msg.sender;
        admins[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }
    modifier onlyAdmin() {
        require(admins[msg.sender]);
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    function isAdmin(address account) external view onlyOwner returns (bool) {
        return admins[account];
    }

    function addAdmin(address account) external onlyOwner {
        require(account != address(0) && !admins[account]);
        admins[account] = true;
    }

    function removeAdmin(address account) external onlyOwner {
        require(account != address(0) && admins[account]);
        admins[account] = false;
    }
}
