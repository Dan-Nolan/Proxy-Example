//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Proxy {
    uint public num = 100;
    address thing;

    constructor(address _addr) {
        thing = _addr;
    }

    // this is the function that gets called
    // IF not other function matches the target selector
    fallback() external {
      address _impl = thing;

      assembly {
        let ptr := mload(0x40)

        // (1) copy incoming call data
        calldatacopy(ptr, 0, calldatasize())

        // (2) forward call to logic contract
        let result := delegatecall(gas(), _impl, ptr, calldatasize(), 0, 0)
        let size := returndatasize()

        // (3) retrieve return data
        returndatacopy(ptr, 0, size)

        // (4) forward return data back to caller
        switch result
        case 0 { revert(ptr, size) }
        default { return(ptr, size) }
      }
    }

    function changeAddress(address _thing) external {
        // we might need some good security
        thing = _thing;
    }
}
