import { HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config"

const SEPOLIA_ALCHEMY_URL = process.env.SEPOLIA_ALCHEMY_URL;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA_ALCHEMY_URL,
      accounts: [SEPOLIA_PRIVATE_KEY!]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};

export default config;
