// test/Vehicle.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VehicleNFT & VehicleRegistry", function () {
  let VehicleNFT, VehicleRegistry;
  let nft, registry;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy VehicleNFT
    const VehicleNFTFactory = await ethers.getContractFactory("VehicleNFT");
    nft = await VehicleNFTFactory.deploy();
    await nft.waitForDeployment();

    // Deploy VehicleRegistry
    const VehicleRegistryFactory = await ethers.getContractFactory("VehicleRegistry");
    registry = await VehicleRegistryFactory.deploy(nft.target);
    await registry.waitForDeployment();

    // Transfer NFT ownership to registry
    await nft.transferOwnership(registry.target);
  });

  it("should register and mint a new vehicle", async function () {
    await registry.registerVehicle(
      "VIN123",
      user1.address,
      "V6",
      "AWD",
      "Auto",
      "Premium",
      "Black",
      "Beige",
      "Toyota",
      "Nagoya",
      "2025",
      "Sedan",
      "Petrol"
    );

    expect(await nft.ownerOf(0)).to.equal(user1.address);
    const vehicle = await registry.searchVehicle("VIN123");
    expect(vehicle.manufacturer).to.equal("Toyota");
  });

  it("should not register the same VIN twice", async function () {
    await registry.registerVehicle(
      "VIN123",
      user1.address,
      "V6",
      "AWD",
      "Auto",
      "Premium",
      "Black",
      "Beige",
      "Toyota",
      "Nagoya",
      "2025",
      "Sedan",
      "Petrol"
    );

    await expect(
      registry.registerVehicle(
        "VIN123",
        user2.address,
        "V8",
        "FWD",
        "Manual",
        "Basic",
        "White",
        "Black",
        "Honda",
        "Tokyo",
        "2024",
        "Coupe",
        "Diesel"
      )
    ).to.be.revertedWith("Vehicle exists");
  });

  it("should update shipment status", async function () {
    await registry.registerVehicle("VIN001", user1.address, "V6", "AWD", "Auto", "Premium", "Black", "Beige", "Toyota", "Nagoya", "2025", "Sedan", "Petrol");
    await registry.updateShipmentStatus("VIN001", 2); // Delivered
    const vehicle = await registry.searchVehicle("VIN001");
    expect(vehicle.shipmentStatus).to.equal(2);
  });

  it("should add and retrieve crash records", async function () {
    await registry.registerVehicle("VIN001", user1.address, "V6", "AWD", "Auto", "Premium", "Black", "Beige", "Toyota", "Nagoya", "2025", "Sedan", "Petrol");

    await registry.addCrashRecord("VIN001", "2024-05-01", "LA", "Frontal", "Minor scratch", true);
    const report = await registry.viewFullReport("VIN001");
    expect(report.crashHistory.length).to.equal(1);
    expect(report.crashHistory[0].description).to.equal("Minor scratch");
  });

  it("should transfer vehicle and mark unavailable", async function () {
    await registry.registerVehicle("VIN001", user1.address, "V6", "AWD", "Auto", "Premium", "Black", "Beige", "Toyota", "Nagoya", "2025", "Sedan", "Petrol");
    await registry.transferVehicle("VIN001", user2.address);

    const report = await registry.viewFullReport("VIN001");
    expect(report.currentOwner).to.equal(user2.address);
    expect(report.available).to.equal(false);
  });

  it("should mark a vehicle as available again", async function () {
    await registry.registerVehicle("VIN001", user1.address, "V6", "AWD", "Auto", "Premium", "Black", "Beige", "Toyota", "Nagoya", "2025", "Sedan", "Petrol");
    await registry.transferVehicle("VIN001", user2.address);
    await registry.markAsAvailable("VIN001");
    const vehicle = await registry.searchVehicle("VIN001");
    expect(vehicle.available).to.equal(true);
  });

  it("should return all vehicles", async function () {
    await registry.registerVehicle("VIN123", user1.address, "V6", "AWD", "Auto", "Premium", "Black", "Beige", "Toyota", "Nagoya", "2025", "Sedan", "Petrol");
    await registry.registerVehicle("VIN456", user2.address, "V8", "RWD", "Manual", "Sport", "Red", "Black", "Tesla", "Fremont", "2023", "SUV", "Electric");

    const allVehicles = await registry.getAllVehicles();
    expect(allVehicles.length).to.equal(2);
  });
});
