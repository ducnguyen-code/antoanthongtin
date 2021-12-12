require("babel-register");
require("babel-polyfill");
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const privKeys = [
  "DC1358E7D27BDB0CEFF3B7B776C812BBF2D88790C494CB3F6EF046C0DAA9F22C",
]; // private keys
const REMOTE_NODE =
  "https://rinkeby.infura.io/v3/9408096ab0f440838799d42bdae4887e";

module.exports = {
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    heroku: {
      host: "http://dai-coin-rewards.herokuapp.com/",
      port: 80,
      network_id: "*", // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(privKeys, REMOTE_NODE),
      network_id: "*",
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};