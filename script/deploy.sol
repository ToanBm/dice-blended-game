// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DiceGame.sol";

contract DeployDiceGame is Script {
    function run() external {
        // Load biến môi trường
        string memory rustAddressEnv = vm.envString("RUST_CONTRACT_ADDRESS");
        address rustContractAddress = vm.parseAddress(rustAddressEnv);

        vm.startBroadcast();

        DiceGame diceGame = new DiceGame(rustContractAddress);

        vm.stopBroadcast();

        console2.log("DiceGame deployed at:", address(diceGame));
    }
}
