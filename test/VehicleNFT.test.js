const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('VehicleNFT Manual Tests', function () {
  let VehicleNFT;
  let vehicleNFT;
  let owner;
  let addr1;
  let addr2;

  // This runs before each test
  beforeEach(async () => {
    // Get test accounts
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a new VehicleNFT contract for each test
    VehicleNFT = await ethers.getContractFactory('VehicleNFT');
    vehicleNFT = await VehicleNFT.deploy();
    await vehicleNFT.waitForDeployment();
  });

  describe('Deployment', () => {
    it('should set the right owner', async () => {
      expect(await vehicleNFT.owner()).to.equal(await owner.getAddress());
    });

    it('should have correct name and symbol', async () => {
      expect(await vehicleNFT.name()).to.equal('Vehicle NFT');
      expect(await vehicleNFT.symbol()).to.equal('VNFT');
    });
  });

  describe('Minting', () => {
    it('should allow owner to mint NFTs', async () => {
      const tokenURI = 'ipfs://QmExample';
      await vehicleNFT.safeMint(await addr1.getAddress(), tokenURI);
      expect(await vehicleNFT.ownerOf(0)).to.equal(await addr1.getAddress());
      expect(await vehicleNFT.tokenURI(0)).to.equal(tokenURI);
    });

    it('should not allow non-owners to mint NFTs', async () => {
      const tokenURI = 'ipfs://QmExample';
      await expect(
        vehicleNFT.connect(addr1).safeMint(await addr2.getAddress(), tokenURI)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
}); 