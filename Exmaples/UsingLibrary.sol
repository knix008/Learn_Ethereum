// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library Math {
    function add(uint x, uint y) internal pure returns (uint) {
        return x + y;
    }
}
contract TestMath {
    using Math for uint;
    function testAdd(uint x, uint y) public pure returns (uint) {
        return x.add(y);
    }
}
