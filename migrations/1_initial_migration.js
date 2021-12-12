const Migrations = artifacts.require("Migrations");
const DaiTokenMock = artifacts.require("DaiTokenMock");

module.exports = async function (deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(DaiTokenMock);
  const tokenMock = await DaiTokenMock.deployed();
  // Mint 1,000 Dai Tokens for the deployer
  await tokenMock.mint(
    "0xDfb72d9F1E6eB5F38B0d5F673B813056db81eA4C", // địa chỉ account nhận Daicoin, là cái ví trên matamask luôn
    "1000000000000000000000"
  );
};
