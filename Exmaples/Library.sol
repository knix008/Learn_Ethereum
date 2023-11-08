// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library TestLib {
    event calledLibEvent(
        address txOrigin,
        address msgSenderAddress,
        address fromAddress,
        uint256 msgValue
    );

    function calledTestMethod() public {
        emit calledLibEvent(tx.origin, msg.sender, address(this), msg.value);
    }
}

contract A {
    event calledLibEvent(
        address txOrigin,
        address msgSenderAddress,
        address fromAddress,
        uint256 msgValue
    );

    function calledTestMethod() public payable {
        emit calledLibEvent(tx.origin, msg.sender, address(this), msg.value);
    }
}

contract TestLibContract {
    address testContractAddr = address(new A());

    function testDelegatecall() public payable {
        testContractAddr.delegatecall(
            abi.encodeWithSignature("calledTestMethod()")
        );
    }

    function directTestLibMethod() public payable {
        TestLib.calledTestMethod();
    }
}