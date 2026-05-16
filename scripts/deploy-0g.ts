import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  if (hardhat.network.name !== "ogMainnet") {
    throw new Error("Kavro deployment is mainnet-only. Use --network ogMainnet.");
  }

  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();
  await identityRegistry.waitForDeployment();

  const AgentRegistry = await ethers.getContractFactory("KavroAgentRegistry");
  const agentRegistry = await AgentRegistry.deploy();
  await agentRegistry.waitForDeployment();

  const AgentID = await ethers.getContractFactory("KavroAgentID");
  const agentID = await AgentID.deploy();
  await agentID.waitForDeployment();

  const DealRoom = await ethers.getContractFactory("KavroDealRoom");
  const dealRoom = await DealRoom.deploy(await identityRegistry.getAddress());
  await dealRoom.waitForDeployment();

  const dealRoomAddress = await dealRoom.getAddress();
  const agentRegistryAddress = await agentRegistry.getAddress();
  const agentIDAddress = await agentID.getAddress();
  const identityRegistryAddress = await identityRegistry.getAddress();
  const explorer = process.env.OG_MAINNET_EXPLORER_URL ?? "https://chainscan.0g.ai";

  console.log("Kavro Protocol deployed on 0G Mainnet");
  console.log("KavroDealRoom:", dealRoomAddress);
  console.log("KavroAgentRegistry:", agentRegistryAddress);
  console.log("KavroAgentID:", agentIDAddress);
  console.log("IdentityRegistry:", identityRegistryAddress);
  console.log("");
  console.log(`NEXT_PUBLIC_KAVRO_DEAL_ROOM_ADDRESS=${dealRoomAddress}`);
  console.log(`NEXT_PUBLIC_KAVRO_AGENT_REGISTRY_ADDRESS=${agentRegistryAddress}`);
  console.log(`NEXT_PUBLIC_KAVRO_AGENT_ID_ADDRESS=${agentIDAddress}`);
  console.log(`NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=${identityRegistryAddress}`);
  console.log("NEXT_PUBLIC_0G_CHAIN_ID=16661");
  console.log(`NEXT_PUBLIC_0G_EXPLORER_URL=${explorer}`);
  console.log("");
  console.log(`${explorer}/address/${dealRoomAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
