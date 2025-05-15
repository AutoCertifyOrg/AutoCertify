const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VehicleNFT", function () {
  let VehicleNFT;
  let nft;
  let owner;
  let other;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    VehicleNFT = await ethers.getContractFactory("VehicleNFT");
    nft = await VehicleNFT.connect(owner).deploy();
    await nft.waitForDeployment();
  });

  it("should mint a new NFT and store VIN", async function () {
    await nft.connect(owner).mint(owner.address, "VIN123");
    expect(await nft.ownerOf(0)).to.equal(owner.address);
    expect(await nft.vehicleVIN(0)).to.equal("VIN123");
  });

  it("should increment tokenId after each mint", async function () {
    await nft.connect(owner).mint(owner.address, "VIN1");
    await nft.connect(owner).mint(owner.address, "VIN2");
    expect(await nft.nextTokenId()).to.equal(2);
  });

  it("should not allow non-owners to mint", async function () {
    await expect(
      nft.connect(other).mint(other.address, "NONOWNER123")
    ).to.be.reverted;
  });
});
