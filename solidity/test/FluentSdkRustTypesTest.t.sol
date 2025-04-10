// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {FluentSdkRustTypesTest} from "../src/FluentSdkRustTypesTest.sol";

contract FluentSdkRustTypesTestTest is Test {

    FluentSdkRustTypesTest public fluentSdkRustTypesTest;

    address constant rustContractFluentTestnet = 0x9030e7aa523b19D6A9d2327d45d3A3287b3EfAE1;

    function setUp() public {
        fluentSdkRustTypesTest = new FluentSdkRustTypesTest(rustContractFluentTestnet);
    }
    
    function test_get_uint256() view public {
        uint256 test_uint256 = fluentSdkRustTypesTest.getRustUint256();
        assertEq(test_uint256, 10);
    }

}
