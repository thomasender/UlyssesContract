const UlyssesContract = artifacts.require("UlyssesContract");

module.exports = function (deployer) {
  deployer.deploy(UlyssesContract);
};
