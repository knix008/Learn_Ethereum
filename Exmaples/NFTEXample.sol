// SPDX-License-Identifier: No License
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyERC721 is ERC721 {
    // Name and symbol of the token
    string public name = "My ERC-721 Token";
    string public symbol = "MTOKEN";
    // ID of the next token to be created
    uint256 public nextTokenId = 1;
    // Mapping from token ID to owner
    mapping (uint256 => address) public tokenOwner;
    // Mapping from token ID to metadata
    mapping (uint256 => string) public tokenMetadata;
    // Array of all token IDs
    uint256[] public tokens;

    constructor() public {
        // Set the contract owner as the token owner of the first token
        tokenOwner[nextTokenId] = msg.sender;
        // Add the first token to the array of tokens
        tokens.push(nextTokenId);
        // Increment the next token ID
        nextTokenId++;
    }

    function create(string memory metadata) public {
        // Set the token owner as the contract owner
        tokenOwner[nextTokenId] = msg.sender;
        // Set the token metadata
        tokenMetadata[nextTokenId] = metadata;
        // Add the token to the array of tokens
        tokens.push(nextTokenId);
        // Increment the next token ID
        nextTokenId++;
    }

    function balanceOf(address owner) public view override returns (uint256) {
        return tokens.length;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        require(index < balanceOf(owner), "Index out of range");
        return tokens[index];
    }

    function ownerOf(uint256 tokenId) public view override returns (address) {
        return tokenOwner[tokenId];
    }

    function metadata(uint256 tokenId) public view returns (string memory) {
        return tokenMetadata[tokenId];
    }

    function transfer(address to, uint256 tokenId) public {
        require(tokenOwner[tokenId] == msg.sender, "You are not the owner of this token");
        require(to != address(0), "Cannot transfer to the zero address");
        tokenOwner[tokenId] = to;
    }
}
