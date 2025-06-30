// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRustDiceValidator {
    function validateRoll(uint256 random) external view returns (uint256);
}

contract DiceGame {
    IRustDiceValidator public rustContract;
    uint256 public nonce;
    uint256 public dicePrice = 0.01 ether;

    mapping(address => uint256) public balances;

    event DiceRolled(address indexed player, uint256 diceNumber, uint256 reward);

    constructor(address _rustContract) {
        rustContract = IRustDiceValidator(_rustContract);
    }

    function buyDice() external payable {
        require(msg.value == dicePrice, "Incorrect price");
        balances[msg.sender] += 1;
    }

    function rollDice() external {
        require(balances[msg.sender] > 0, "No dice available");
        balances[msg.sender] -= 1;

        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % 10000;
        nonce++;

        uint256 diceNumber = rustContract.validateRoll(random);

        uint256 reward = 0;
        if (diceNumber == 6) {
            reward = dicePrice * 2;
            payable(msg.sender).transfer(reward);
        }

        emit DiceRolled(msg.sender, diceNumber, reward);
    }

    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {}
}
