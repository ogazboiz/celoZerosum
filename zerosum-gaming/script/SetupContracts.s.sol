// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {ZeroSumSimplified} from "../src/ZeroSumSimplified.sol";
import {ZeroSumSpectator} from "../src/ZeroSumSpectator.sol";

/**
 * @title SetupContracts
 * @notice Links already deployed ZeroSumSimplified and ZeroSumSpectator contracts
 * @dev Use this if you deployed contracts separately and need to link them
 *
 * Instructions:
 * 1. Set GAME_CONTRACT_ADDRESS environment variable
 * 2. Set SPECTATOR_CONTRACT_ADDRESS environment variable
 * 3. Run this script
 */
contract SetupContracts is Script {
    function setUp() public {}

    function run() public {
        // Get deployed contract addresses from environment
        address gameAddress = vm.envAddress("GAME_CONTRACT_ADDRESS");
        address spectatorAddress = vm.envAddress("SPECTATOR_CONTRACT_ADDRESS");

        require(gameAddress != address(0), "GAME_CONTRACT_ADDRESS not set");
        require(spectatorAddress != address(0), "SPECTATOR_CONTRACT_ADDRESS not set");

        // Handle private key
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
        uint256 deployerPrivateKey;

        if (bytes(privateKeyStr).length == 66) {
            deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        } else {
            deployerPrivateKey = vm.parseUint(string(abi.encodePacked("0x", privateKeyStr)));
        }

        address deployer = vm.addr(deployerPrivateKey);

        console.log("=== Contract Setup ===");
        console.log("Deployer address:", deployer);
        console.log("Game Contract:", gameAddress);
        console.log("Spectator Contract:", spectatorAddress);

        // Connect to existing contracts
        ZeroSumSimplified zeroSum = ZeroSumSimplified(payable(gameAddress));
        ZeroSumSpectator spectator = ZeroSumSpectator(spectatorAddress);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Register the game contract with the spectator
        console.log("\n[1/2] Registering game contract with spectator...");
        spectator.registerGameContract(address(zeroSum));
        console.log("  Game contract registered successfully");

        // 2. Set the spectator contract in the game contract
        console.log("\n[2/2] Setting spectator contract in game...");
        zeroSum.setSpectatorContract(address(spectator));
        console.log("  Spectator contract linked successfully");

        vm.stopBroadcast();

        // Verify the setup
        console.log("\n=== Verification ===");
        console.log("Game's spectator contract:", zeroSum.spectatorContract());
        console.log("Spectator has game registered:", spectator.registeredContracts(address(zeroSum)));

        bool success = (zeroSum.spectatorContract() == address(spectator)) &&
            spectator.registeredContracts(address(zeroSum));

        if (success) {
            console.log("\n SUCCESS: Contracts linked successfully!");
        } else {
            console.log("\n ERROR: Contract linking failed!");
        }
    }
}
