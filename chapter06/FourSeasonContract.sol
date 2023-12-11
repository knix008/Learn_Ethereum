// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 < 0.8.10;

contract FourSeasonContract {
    enum Season {
        Spring,
        Summer,
        Autumn,
        Winter
    }

    Season public season;
    Season constant defaultSeason = Season.Spring;

    constructor() {
        season = defaultSeason;
    }

    // Update season by passing uint into input
    function setSeason(Season _season) public {
        season = _season;
    }

    // Returns uint
    // Spring  = 0
    // Summer  = 1
    // Autumn  = 2
    // Windter = 3
    function getSeason() public view returns(Season) {
        return season;
    }
}
