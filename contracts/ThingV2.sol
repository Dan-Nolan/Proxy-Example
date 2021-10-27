//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ThingV2 {
    uint public num = 100;

    function action(uint _num) public {
        num = _num * 50;
    }
}
