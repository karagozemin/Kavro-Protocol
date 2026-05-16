import hardhat from "hardhat";

const { ethers } = hardhat;

type TxLike = {
  wait: () => Promise<{ hash?: string } | null>;
  hash: string;
};

const explorerForNetwork = () => {
  if (hardhat.network.name === "ogMainnet") {
    return process.env.OG_MAINNET_EXPLORER_URL ?? "https://chainscan.0g.ai";
  }
  throw new Error("Kavro proof seeding is mainnet-only. Use --network ogMainnet.");
};

const waitAndLink = async (label: string, tx: TxLike, explorer: string) => {
  console.log(`${label} tx: ${tx.hash}`);
  await tx.wait();
  console.log(`${label} explorer: ${explorer}/tx/${tx.hash}`);
  return tx.hash;
};

async function main() {
  const explorer = explorerForNetwork();
  const [deployer] = await ethers.getSigners();

  const dealRoomAddress = process.env.NEXT_PUBLIC_KAVRO_DEAL_ROOM_ADDRESS;
  const identityRegistryAddress = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS;

  if (!dealRoomAddress) throw new Error("Missing NEXT_PUBLIC_KAVRO_DEAL_ROOM_ADDRESS");
  if (!identityRegistryAddress) throw new Error("Missing NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS");

  const dealRoom = await ethers.getContractAt("KavroDealRoom", dealRoomAddress);
  const identityRegistry = await ethers.getContractAt("IdentityRegistry", identityRegistryAddress);

  console.log(`Kavro proof flow on ${hardhat.network.name}`);
  console.log(`Operator: ${deployer.address}`);
  console.log(`KavroDealRoom: ${dealRoomAddress}`);
  console.log(`IdentityRegistry: ${identityRegistryAddress}`);

  const verified = await identityRegistry.isVerified(deployer.address);
  if (!verified) {
    const identityHash = ethers.keccak256(
      ethers.toUtf8Bytes(`kavro-demo-kyc:${deployer.address}:${hardhat.network.name}`)
    );
    await waitAndLink(
      "KYC identity registration",
      await identityRegistry.registerIdentity(deployer.address, identityHash),
      explorer
    );
  }

  const dealId = await dealRoom.getDealsCount();
  const storageRef = process.env.KAVRO_DEAL_STORAGE_REF;
  const aiReportRef = process.env.KAVRO_AI_REPORT_STORAGE_REF;
  const bidStorageRef = process.env.KAVRO_BID_STORAGE_REF;
  const disclosureRef = process.env.KAVRO_DISCLOSURE_STORAGE_REF;
  if (!storageRef) throw new Error("Missing KAVRO_DEAL_STORAGE_REF from a real 0G Storage upload");
  if (!aiReportRef) throw new Error("Missing KAVRO_AI_REPORT_STORAGE_REF from a real 0G Storage upload");
  if (!bidStorageRef) throw new Error("Missing KAVRO_BID_STORAGE_REF from a real 0G Storage upload");
  if (!disclosureRef) throw new Error("Missing KAVRO_DISCLOSURE_STORAGE_REF from a real 0G Storage upload");
  const maturityDate = BigInt(Math.floor(Date.now() / 1000) + 180 * 24 * 60 * 60);

  await waitAndLink(
    "DealCreated",
    await dealRoom.createDeal({
      title: "Singapore Invoice Financing Clearing Round",
      category: "Private Credit / Invoice Finance",
      maturityDate,
      description:
        "Kavro demo credit room: sealed RWA funding round with AI underwriting, private bid commitments, repayment state, and permissioned auditor disclosure.",
      storageRef
    }),
    explorer
  );

  await waitAndLink("FundingOpened", await dealRoom.openFunding(dealId), explorer);

  const reportHash = ethers.keccak256(
    ethers.toUtf8Bytes(`kavro-underwriting-swarm:${dealId.toString()}:${aiReportRef}`)
  );
  await waitAndLink("AIReportCommitted", await dealRoom.setAIReportRef(dealId, 4, reportHash, aiReportRef), explorer);

  const bidCommitment = ethers.keccak256(
    ethers.toUtf8Bytes(`sealed-bid:${dealId.toString()}:500000:13.8:private-demo-salt`)
  );
  await waitAndLink(
    "SealedBidSubmitted",
    await dealRoom.submitSealedBid(dealId, bidCommitment, bidStorageRef, reportHash),
    explorer
  );

  await waitAndLink("DealFunded", await dealRoom.markFunded(dealId), explorer);

  const repaymentCommitment = ethers.keccak256(
    ethers.toUtf8Bytes(`repayment:${dealId.toString()}:principal-plus-yield:private-demo-salt`)
  );
  await waitAndLink("RepaymentRecorded", await dealRoom.recordRepayment(dealId, repaymentCommitment), explorer);

  await waitAndLink(
    "AuditorAccessGranted",
    await dealRoom.grantAuditorAccess(dealId, deployer.address, deployer.address, disclosureRef),
    explorer
  );

  console.log("");
  console.log("Proof-of-Credit Packet seed complete");
  console.log(`dealId=${dealId.toString()}`);
  console.log(`dealStorageRef=${storageRef}`);
  console.log(`aiReportStorageRef=${aiReportRef}`);
  console.log(`bidStorageRef=${bidStorageRef}`);
  console.log(`disclosureRef=${disclosureRef}`);
  console.log(`dealRoomExplorer=${explorer}/address/${dealRoomAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
