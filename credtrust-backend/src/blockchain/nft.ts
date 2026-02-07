import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ArbitrumSepolia } from '@thirdweb-dev/chains';

const sdk = new ThirdwebSDK(ArbitrumSepolia, {
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

export async function mintCreditProofNFT(proofData: {
  borrower: string;
  riskTier: number;
  zkProof: any;
  publicInputHash: string;
  scoreHash: string;
  teeAttestation: string;
  underwriter: string;
}) {
  const CREDIT_PROOF_CONTRACT = await sdk.getContract(
    process.env.CREDIT_PROOF_NFT_ADDRESS!,
    'nft-collection'
  );

  // Note: For gasless AA, you would typically use the SmartWallet class from Thirdweb SDK
  // Here we follow the pattern from the issue description
  
  const tx = await CREDIT_PROOF_CONTRACT.erc721.mintTo(proofData.borrower, {
    name: `Credit Proof #${Date.now()}`,
    description: `Risk Tier ${tierToLetter(proofData.riskTier)}`,
    image: '/api/metadata/proof.png',
    attributes: [
        { trait_type: 'Risk Tier', value: tierToLetter(proofData.riskTier) },
        { trait_type: 'Public Input Hash', value: proofData.publicInputHash },
    ]
  });

  return { tokenId: tx.id, txHash: tx.receipt.transactionHash };
}

function tierToLetter(tier: number): string {
  return ['A', 'B', 'C', 'D'][tier] || 'F';
}
