// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract A {
}

contract B is A {
}

contract C is A {
}

contract D is B, C {
}

contract E is A, B{
}

contract F is B, A { 
    //This won't compile
}

contract G is A, C { 
}