// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface OrderInterface {   
    struct Order {
        string buyer;
        string product;
        uint quantity;
    }
    enum OrderType { PhoneOrder, MailOrder, InternetOrder}
    
    function setOrder(address _address, string calldata _buyer, string calldata _product, uint _quantity) external;
    function getOrder(address _address) view external returns (string memory, string memory, uint);
}
