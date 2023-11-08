// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface AInterface {
    function method1() external returns (bool);
    function method2() external view returns (uint256);
}

abstract contract AbstractContract is AInterface {
    function method1() external pure returns (bool) {
        return true;
    }
}

contract AbstractExample is AbstractContract {
    uint256 stateVar1;

    function method2() external view returns(uint256){
        return stateVar1;
    }    
}
