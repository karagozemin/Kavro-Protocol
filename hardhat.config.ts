import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    ogGalileo: {
      url: process.env.NEXT_PUBLIC_0G_RPC_URL ?? process.env.OG_GALILEO_RPC_URL ?? "https://evmrpc-testnet.0g.ai",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 16602
    },
    ogMainnet: {
      url: process.env.OG_MAINNET_RPC_URL ?? "https://evmrpc.0g.ai",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 16661
    },
    arbitrumSepolia: {
      url: process.env.ARB_SEPOLIA_RPC_URL ?? "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 421614
    }
  }
};

export default config;
