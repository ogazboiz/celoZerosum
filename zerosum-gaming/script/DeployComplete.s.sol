// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {ZeroSumSimplified} from "../src/ZeroSumSimplified.sol";
import {ZeroSumSpectator} from "../src/ZeroSumSpectator.sol";

/**
 * @title DeployComplete
 * @notice Deploys both ZeroSumSimplified and ZeroSumSpectator contracts and links them
 * @dev This is the recommended deployment script for full functionality
 */
contract DeployComplete is Script {
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

        console.log("=== Complete ZeroSum Deployment ===");
        console.log("Deploying from address:", deployer);
        console.log("Deployer balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy ZeroSumSimplified first
        console.log("\n[1/4] Deploying ZeroSumSimplified...");
        ZeroSumSimplified zeroSum = new ZeroSumSimplified();
        console.log("  ZeroSumSimplified deployed to:", address(zeroSum));

        // 2. Deploy ZeroSumSpectator
        console.log("\n[2/4] Deploying ZeroSumSpectator...");
        ZeroSumSpectator spectator = new ZeroSumSpectator();
        console.log("  ZeroSumSpectator deployed to:", address(spectator));

        // 3. Register the game contract with the spectator
        console.log("\n[3/4] Registering game contract with spectator...");
        spectator.registerGameContract(address(zeroSum));
        console.log("  Game contract registered successfully");

        // 4. Set the spectator contract in the game contract
        console.log("\n[4/4] Setting spectator contract in game...");
        zeroSum.setSpectatorContract(address(spectator));
        console.log("  Spectator contract linked successfully");

        // Configure spectator contract
        console.log("\nConfiguring spectator contract...");
        spectator.setGlobalBettingEnabled(true);
        spectator.setMinimumBet(0.001 ether);
        spectator.setBettingFee(3);
        console.log("  Global betting enabled: true");
        console.log("  Minimum bet: 0.001 ETH");
        console.log("  Betting fee: 3%");

        vm.stopBroadcast();

        // Verify the setup
        console.log("\n=== Deployment Summary ===");
        console.log("ZeroSumSimplified:", address(zeroSum));
        console.log("  Owner:", zeroSum.owner());
        console.log("  Game counter:", zeroSum.gameCounter());
        console.log("  Platform fee:", zeroSum.platformFee(), "%");
        console.log("  Time limit:", zeroSum.timeLimit(), "seconds");
        console.log("  Spectator contract:", zeroSum.spectatorContract());

        console.log("\nZeroSumSpectator:", address(spectator));
        console.log("  Owner:", spectator.owner());
        console.log("  Game registered:", spectator.registeredContracts(address(zeroSum)));
        console.log("  Global betting enabled:", spectator.globalBettingEnabled());
        console.log("  Minimum bet:", spectator.minimumBet());
        console.log("  Betting fee:", spectator.bettingFeePercent(), "%");

        console.log("\n=== Environment Variables for Frontend ===");
        console.log("NEXT_PUBLIC_GAME_CONTRACT_ADDRESS=", vm.toString(address(zeroSum)));
        console.log("NEXT_PUBLIC_SPECTATOR_CONTRACT_ADDRESS=", vm.toString(address(spectator)));

        console.log("\n=== Deployment Complete ===");
        console.log("Both contracts are deployed and linked successfully!");
        console.log("You can now start creating games and placing bets.");
    }
}
