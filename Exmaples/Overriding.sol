// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract G {
    function isGood() virtual  public returns (bool) {
        return false;
    }
}

contract H is G {
    function isGood() pure public  override(G) returns (bool) {
        return true;
    }
}

contract I is G {
}
