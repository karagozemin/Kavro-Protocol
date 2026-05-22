import { identityRegistryAbi } from "@/lib/abi";

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export function isValidEthAddress(value: string) {
  return ADDRESS_RE.test(value);
}

export async function grantMockKyc(investorAddress: string) {
  const normalized = investorAddress as `0x${string}`;
  if (!isValidEthAddress(normalized)) {
    throw new Error("Invalid investor address");
  }

  const registryAddress = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS;
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  const rpcUrl =
    process.env.OG_MAINNET_RPC_URL ??
    process.env.NEXT_PUBLIC_0G_RPC_URL ??
    "https://evmrpc.0g.ai";

  if (!registryAddress) {
    throw new Error("Missing NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS");
  }
  if (!privateKey) {
    throw new Error("Mock KYC is not configured (missing DEPLOYER_PRIVATE_KEY)");
  }

  const ethers = await import("ethers");
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const registry = new ethers.Contract(registryAddress, identityRegistryAbi, signer);

  const alreadyVerified = await registry.isVerified(normalized);
  if (alreadyVerified) {
    return {
      alreadyVerified: true as const,
      address: normalized,
      txHash: null
    };
  }

  const identityHash = ethers.keccak256(
    ethers.toUtf8Bytes(`kavro-mock-kyc:${normalized.toLowerCase()}`)
  );
  const tx = await registry.registerIdentity(normalized, identityHash);
  const receipt = await tx.wait();

  return {
    alreadyVerified: false as const,
    address: normalized,
    txHash: (receipt?.hash ?? tx.hash) as string
  };
}
