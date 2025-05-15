const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('VehicleRegistry Manual Tests', function () {
  let VehicleRegistry;
  let VehicleNFT;
  let vehicleRegistry;
  let vehicleNFT;
  let owner;
  let manufacturer;
  let dealer;
  let customer;

  beforeEach(async () => {
    [owner, manufacturer, dealer, customer] = await ethers.getSigners();

    // Deploy VehicleNFT first
    VehicleNFT = await ethers.getContractFactory('VehicleNFT');
    vehicleNFT = await VehicleNFT.deploy();
    await vehicleNFT.waitForDeployment();

    // Deploy VehicleRegistry with VehicleNFT address
    VehicleRegistry = await ethers.getContractFactory('VehicleRegistry');
    vehicleRegistry = await VehicleRegistry.deploy(await vehicleNFT.getAddress());
    await vehicleRegistry.waitForDeployment();

    // Transfer ownership of VehicleNFT to VehicleRegistry
    await vehicleNFT.transferOwnership(await vehicleRegistry.getAddress());
  });

  describe('Manufacturer Operations', () => {
    beforeEach(async () => {
      await vehicleRegistry.addManufacturer(await manufacturer.getAddress(), 'Tesla');
    });

    it('should register a manufacturer', async () => {
      const manufacturerInfo = await vehicleRegistry.manufacturers(await manufacturer.getAddress());
      expect(manufacturerInfo.name).to.equal('Tesla');
      expect(manufacturerInfo.isActive).to.be.true;
    });

    it('should allow manufacturer to register a vehicle', async () => {
      const vin = '1HGCM82633A123456';
      const vehicleData = {
        make: 'Tesla',
        model: 'Model 3',
        year: 2024,
        color: 'Red',
        additionalInfo: 'Electric Vehicle'
      };

      await vehicleRegistry.connect(manufacturer).registerVehicle(
        vin,
        vehicleData.make,
        vehicleData.model,
        vehicleData.year,
        vehicleData.color,
        vehicleData.additionalInfo
      );

      const vehicle = await vehicleRegistry.vehicles(vin);
      expect(vehicle.make).to.equal(vehicleData.make);
      expect(vehicle.model).to.equal(vehicleData.model);
      expect(vehicle.year).to.equal(vehicleData.year);
    });
  });

  describe('Dealer Operations', () => {
    const vin = '1HGCM82633A123456';
    
    beforeEach(async () => {
      await vehicleRegistry.addManufacturer(await manufacturer.getAddress(), 'Tesla');
      await vehicleRegistry.addDealer(await dealer.getAddress(), 'Tesla Dealership');
      
      await vehicleRegistry.connect(manufacturer).registerVehicle(
        vin,
        'Tesla',
        'Model 3',
        2024,
        'Red',
        'Electric Vehicle'
      );
    });

    it('should register a dealer', async () => {
      const dealerInfo = await vehicleRegistry.dealers(await dealer.getAddress());
      expect(dealerInfo.name).to.equal('Tesla Dealership');
      expect(dealerInfo.isActive).to.be.true;
    });

    it('should allow dealer to process vehicle sale', async () => {
      await vehicleRegistry.connect(dealer).processVehicleSale(
        vin,
        await customer.getAddress(),
        ethers.parseEther('50000')
      );

      const vehicle = await vehicleRegistry.vehicles(vin);
      expect(vehicle.owner).to.equal(await customer.getAddress());
    });
  });

  describe('Customer Operations', () => {
    const vin = '1HGCM82633A123456';

    beforeEach(async () => {
      await vehicleRegistry.addManufacturer(await manufacturer.getAddress(), 'Tesla');
      await vehicleRegistry.addDealer(await dealer.getAddress(), 'Tesla Dealership');
      
      await vehicleRegistry.connect(manufacturer).registerVehicle(
        vin,
        'Tesla',
        'Model 3',
        2024,
        'Red',
        'Electric Vehicle'
      );

      await vehicleRegistry.connect(dealer).processVehicleSale(
        vin,
        await customer.getAddress(),
        ethers.parseEther('50000')
      );
    });

    it('should allow customer to view their vehicle', async () => {
      const vehicle = await vehicleRegistry.connect(customer).getVehicleDetails(vin);
      expect(vehicle.make).to.equal('Tesla');
      expect(vehicle.model).to.equal('Model 3');
      expect(vehicle.owner).to.equal(await customer.getAddress());
    });

    it('should allow customer to transfer vehicle ownership', async () => {
      const newOwner = await ethers.provider.getSigner(5);
      await vehicleRegistry.connect(customer).transferVehicle(
        vin,
        await newOwner.getAddress(),
        ethers.parseEther('45000')
      );

      const vehicle = await vehicleRegistry.vehicles(vin);
      expect(vehicle.owner).to.equal(await newOwner.getAddress());
    });
  });
}); 