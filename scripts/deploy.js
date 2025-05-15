const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const VehicleNFT = await hre.ethers.getContractFactory("VehicleNFT");
  const nft = await VehicleNFT.deploy();
  await nft.waitForDeployment();

  const VehicleRegistry = await hre.ethers.getContractFactory("VehicleRegistry");
  const registry = await VehicleRegistry.deploy(nft.target);
  await registry.waitForDeployment();

  await nft.transferOwnership(registry.target);

  // Save for frontend
  const artifact = await hre.artifacts.readArtifact("VehicleRegistry");
  const frontendPath = path.join(__dirname, "../frontend/constants");
  fs.mkdirSync(frontendPath, { recursive: true });
  fs.writeFileSync(`${frontendPath}/VehicleRegistryABI.json`, JSON.stringify(artifact.abi, null, 2));
  fs.writeFileSync(`${frontendPath}/VehicleRegistryAddress.json`, JSON.stringify({ address: registry.target }, null, 2));

  console.log("✅ Deployed and exported ABI/address");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
