
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
const NETWORK = 'devnet';
const connection = new Connection(`https://api.${NETWORK}.solana.com`, 'confirmed');

export const solanaService = {
  // Get the balance of a wallet
  getBalance: async (publicKey: PublicKey): Promise<number> => {
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  },

  // Request an airdrop (only works on devnet)
  requestAirdrop: async (publicKey: PublicKey): Promise<string> => {
    try {
      const signature = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL
      );
      
      await connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      console.error('Error requesting airdrop:', error);
      throw error;
    }
  },

  // Create a loan application transaction (placeholder for smart contract integration)
  createLoanApplication: async (
    wallet: any,
    amount: number,
    termDays: number,
    purpose: string
  ): Promise<string> => {
    try {
      // In a real implementation, this would call your deployed loan program
      // Here we're just simulating with a simple transaction
      
      // Create a simple transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: wallet.publicKey, // Just sending to self as placeholder
          lamports: 100, // Minimal amount
        })
      );

      // Sign and send the transaction
      const signature = await wallet.sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature);
      
      // In real implementation, you would store loan metadata on-chain or in a database
      console.log(`Loan application created: ${amount} USDC, ${termDays} days, for ${purpose}`);
      
      return signature;
    } catch (error) {
      console.error('Error creating loan application:', error);
      throw error;
    }
  }
};

// Example program ID for when we have a deployed smart contract
export const LOAN_PROGRAM_ID = 'YOUR_DEPLOYED_PROGRAM_ID';
