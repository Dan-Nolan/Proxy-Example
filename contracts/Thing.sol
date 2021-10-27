//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Thing {
    uint public num = 100;

    function action(uint _num) public {
        num = _num;
    }
}
