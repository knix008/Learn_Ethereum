// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.9.3/token/ERC1155/ERC1155.sol";

contract ERC1155NFTToken is ERC1155 {
    uint256 public constant MomentOfSilence = 0;
    uint256 public constant Finchwing = 1;
    uint256 public constant GirlAndBird = 2;
    uint256 public constant Kitty = 3;
    uint256 public constant MargayCat = 4;
    uint256 public constant Nighthill = 5;
    uint256 public constant Storm = 6;

    constructor()
        ERC1155(
            "https://ipfs.io/ipfs/bafybeifcatfkx7jehcieim4ujuf6rin7jqcqjkqwdvtra3stpndgmznydm/{id}.json"
        )
    {
        _mint(msg.sender, MomentOfSilence, 10, "");
        _mint(msg.sender, Finchwing, 10, "");
        _mint(msg.sender, GirlAndBird, 10, "");
        _mint(msg.sender, Kitty, 10, "");
        _mint(msg.sender, MargayCat, 10, "");
        _mint(msg.sender, Nighthill, 10, "");
        _mint(msg.sender, Storm, 10, "");
    }
}
