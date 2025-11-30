const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("Deploying FHE contracts...");

  // --- HealthDataLocker ---
  console.log("Deploying HealthDataLocker contract...");
  const HealthDataLocker = await hre.ethers.getContractFactory("HealthDataLocker");
  const healthLocker = await HealthDataLocker.deploy();
  await healthLocker.waitForDeployment();
  const healthLockerAddress = await healthLocker.getAddress();
  console.log(`HealthDataLocker deployed at: ${healthLockerAddress}`);

  // --- Summary ---
  console.log("\n=== Deployment Summary ===");
  console.log(`HealthDataLocker:   ${healthLockerAddress}`);
}

module.exports = main;