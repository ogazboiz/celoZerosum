// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {ZeroSumSimplified} from "../src/ZeroSumSimplified.sol";

/**
 * @title DeployZeroSumSimplified
 * @notice Deploys ONLY the ZeroSumSimplified game contract (without spectator)
 * @dev Use this if you want to deploy the game contract independently
 */
contract DeployZeroSumSimplified is Script {
    function setUp() public {}

    function run() public {
        // Handle private key with or without 0x prefix
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
        uint256 deployerPrivateKey;

        // Check if private key has 0x prefix
        if (bytes(privateKeyStr).length == 66) {
            // Has 0x prefix
            deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        } else {
            // No 0x prefix, add it
            deployerPrivateKey = vm.parseUint(string(abi.encodePacked("0x", privateKeyStr)));
        }

        address deployer = vm.addr(deployerPrivateKey);

        console.log("=== ZeroSumSimplified Deployment ===");
        console.log("Deploying from address:", deployer);
        console.log("Deployer balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy ZeroSumSimplified
        console.log("\nDeploying ZeroSumSimplified...");
        ZeroSumSimplified zeroSum = new ZeroSumSimplified();
        console.log("ZeroSumSimplified deployed to:", address(zeroSum));

        // Verify initial state
        console.log("\n=== Deployment Summary ===");
        console.log("Contract Address:", address(zeroSum));
        console.log("Owner:", zeroSum.owner());
        console.log("Game counter:", zeroSum.gameCounter());
        console.log("Platform fee:", zeroSum.platformFee(), "%");
        console.log("Time limit:", zeroSum.timeLimit(), "seconds");
        console.log("Staking APY:", zeroSum.stakingAPY(), "basis points");
        console.log("Paused:", zeroSum.paused());

        vm.stopBroadcast();

        console.log("\n=== Environment Variable for Frontend ===");
        console.log("NEXT_PUBLIC_GAME_CONTRACT_ADDRESS=", vm.toString(address(zeroSum)));

        console.log("\n=== Next Steps ===");
        console.log("1. Save the contract address above");
        console.log("2. (Optional) Deploy ZeroSumSpectator using DeployComplete.s.sol");
        console.log("3. (Optional) Link contracts using SetupContracts.s.sol");
    }
}
