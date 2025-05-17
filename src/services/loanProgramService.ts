
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair
} from '@solana/web3.js';
import * as borsh from 'borsh';
import { Buffer } from 'buffer';
import { toast } from "@/components/ui/use-toast";

// Define the loan program ID - this would be the address of your deployed program
// You need to replace this with your actual deployed program ID
export const LOAN_PROGRAM_ID = new PublicKey('Dtj6mjrmMLFEywJ3D1qyMsLR1ibbruQdoPcWB25x57Jy');

// Network configuration
const NETWORK = 'devnet';
const connection = new Connection(`https://api.${NETWORK}.solana.com`, 'confirmed');

// Borsh schema for loan data
class LoanApplicationData {
  amount: number;
  termDays: number;
  creditScore: number;

  constructor(fields: { amount: number; termDays: number; creditScore: number }) {
    this.amount = fields.amount;
    this.termDays = fields.termDays;
    this.creditScore = fields.creditScore;
  }
}

// Define the Borsh schema for serialization
const loanApplicationSchema = {
  struct: {
    amount: 'u64',
    termDays: 'u16',
    creditScore: 'u16',
  }
};

// Instruction types that match our Rust program
export enum LoanInstructionType {
  Initialize = 0,
  ApproveLoan = 1,
  RepayLoan = 2,
  UpdateCreditScore = 3,
  FundProgram = 4,
}

// Define the loan state that will be stored on-chain
export interface LoanAccount {
  isInitialized: boolean;
  borrower: PublicKey;
  lender: PublicKey;
  amount: number;
  termDays: number;
  interestRate: number;
  startTime: number;
  endTime: number;
  isRepaid: boolean;
  creditScore: number;
}

export interface LoanApplication {
  id: string;
  borrower: string;
  amount: number;
  termDays: number;
  status: 'pending' | 'approved' | 'rejected' | 'repaid';
  purpose: string;
  createdAt: number;
}

// Helper function to create a buffer from a string
function bufferFrom(str: string): Buffer {
  return Buffer.from(str);
}

export const loanProgramService = {
  // Get PDA (Program Derived Address) for a loan account
  async findLoanAccountAddress(borrowerPubkey: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [bufferFrom('loan'), borrowerPubkey.toBuffer()],
      LOAN_PROGRAM_ID
    );
  },

  // Get PDA for program fund account
  async findProgramFundAddress(): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [bufferFrom('program_fund')],
      LOAN_PROGRAM_ID
    );
  },

  // Create a new loan application
  async createLoanApplication(
    wallet: any,
    amount: number, // This is now directly in lamports
    termDays: number,
    purpose: string
  ): Promise<string> {
    try {
      console.log(`Creating loan application: ${amount} lamports, ${termDays} days, purpose: ${purpose}`);
      
      if (!wallet.publicKey) throw new Error("Wallet not connected");

      // Find the loan account PDA
      const [loanAccountPDA] = await this.findLoanAccountAddress(wallet.publicKey);
      
      // Create the loan application data
      const loanData = new LoanApplicationData({
        amount: amount, // Direct lamports amount
        termDays: termDays, 
        creditScore: 700 // Default credit score
      });
      
      console.log("Loan data to be serialized:", JSON.stringify(loanData, (_, v) => typeof v === 'bigint' ? v.toString() : v));
      
      // Serialize the loan data using borsh
      const serializedData = borsh.serialize(
        loanApplicationSchema,
        loanData
      );
      
      console.log("Serialized data length:", serializedData.length);
      
      // Create instruction data with the LoanInstructionType as the first byte
      const dataBuffer = Buffer.alloc(serializedData.length + 1);
      dataBuffer[0] = LoanInstructionType.Initialize;
      
      // Copy serialized data into the buffer at position 1
      for (let i = 0; i < serializedData.length; i++) {
        dataBuffer[i + 1] = serializedData[i];
      }
      
      // Create the transaction instruction
      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: loanAccountPDA, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: LOAN_PROGRAM_ID,
        data: dataBuffer,
      });
      
      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      
      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
      
      try {
        // Sign and send transaction
        console.log("Sending transaction to wallet for signature...");
        const signature = await wallet.sendTransaction(transaction, connection);
        
        console.log("Transaction sent, waiting for confirmation...");
        // Confirm transaction
        await connection.confirmTransaction(signature, 'confirmed');
        
        console.log("Loan application created with signature:", signature);

        // After successful application, try to auto-approve/fund the loan for demonstration purposes
        // In a real DAO system, this would be voted on by DAO members
        try {
          await this.approveLoanForDemo(wallet, loanAccountPDA, wallet.publicKey, amount);
        } catch (approvalError) {
          console.error("Loan was created but auto-approval failed:", approvalError);
          // We'll still return the original signature as the loan application was successful
        }
        
        return signature;
      } catch (error: any) {
        console.error('Error with blockchain transaction:', error);
        
        // Check if the error is related to the program not having enough funds
        if (error.message?.includes('insufficient funds') || 
            error.message?.includes('insufficient lamports')) {
          throw new Error('The smart contract does not have enough funds to process this loan. Please try a smaller amount or fund the program.');
        }
        
        throw error;
      }
    } catch (error: any) {
      console.error('Error creating loan application:', error);
      toast({
        title: "Loan Application Error",
        description: error.message || "Failed to create loan application",
        variant: "destructive",
      });
      throw error;
    }
  },

  // Auto-approve loan for demonstration purposes
  // In a real system, this would be done by DAO governance
  async approveLoanForDemo(
    wallet: any,
    loanPDA: PublicKey,
    borrowerPubkey: PublicKey,
    amount: number
  ): Promise<string | null> {
    try {
      // First, check if the program has enough funds to approve the loan
      const [programFundPDA] = await this.findProgramFundAddress();
      const programFundInfo = await connection.getAccountInfo(programFundPDA);
      
      // If program fund doesn't exist or doesn't have enough funds, fund it first
      if (!programFundInfo || programFundInfo.lamports < amount) {
        console.log("Program needs funding before loan approval. Attempting to fund...");
        try {
          // Fund the program with the necessary amount plus some extra for fees
          const fundAmount = amount + 10000000; // Add some extra lamports for fees
          await this.fundProgram(wallet, fundAmount);
          console.log(`Program funded with ${fundAmount} lamports`);
        } catch (fundingError) {
          console.error("Failed to fund program:", fundingError);
          toast({
            title: "Funding Required",
            description: "The loan program needs to be funded before loans can be approved. Please fund the program.",
            variant: "destructive",
          });
          return null;
        }
      }
      
      // Create instruction with LoanInstructionType.ApproveLoan
      const dataBuffer = Buffer.from(new Uint8Array(1));
      dataBuffer[0] = LoanInstructionType.ApproveLoan;
      
      // Find the program fund PDA again (it should be funded now)
      const [programFundPDA2] = await this.findProgramFundAddress();
      
      // Create the transaction instruction
      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: loanPDA, isSigner: false, isWritable: true },
          { pubkey: borrowerPubkey, isSigner: false, isWritable: true },
          { pubkey: programFundPDA2, isSigner: false, isWritable: true },
        ],
        programId: LOAN_PROGRAM_ID,
        data: dataBuffer,
      });
      
      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      
      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
      
      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast({
        title: "Loan Approved and Funded",
        description: `Your loan for ${amount} lamports has been approved and funds have been transferred to your wallet.`,
      });
      
      return signature;
    } catch (error: any) {
      console.error('Error approving loan:', error);
      toast({
        title: "Auto-Approval Failed",
        description: error.message || "Failed to auto-approve loan",
        variant: "destructive",
      });
      return null;
    }
  },

  // Get all loan applications for a user (borrower)
  async getUserLoans(userPubkey: PublicKey): Promise<LoanApplication[]> {
    try {
      console.log(`Fetching loans for user: ${userPubkey.toString()}`);
      
      // Find the loan account PDA
      const [loanAccountPDA] = await this.findLoanAccountAddress(userPubkey);
      
      // Try to fetch the loan account data
      try {
        const accountInfo = await connection.getAccountInfo(loanAccountPDA);
        
        if (accountInfo && accountInfo.data.length > 0) {
          // Deserialize the loan account data
          // Skip the first byte which is the instruction type
          const data = accountInfo.data.slice(1);
          
          // Create a buffer from the data
          const buffer = Buffer.from(data);
          
          // Deserialize using borsh
          const loanData = borsh.deserialize(
            loanApplicationSchema,
            buffer
          ) as unknown as LoanAccount;
          
          // Convert to LoanApplication format
          return [{
            id: loanAccountPDA.toString(),
            borrower: userPubkey.toString(),
            amount: loanData.amount, // Keep as lamports for consistency
            termDays: loanData.termDays,
            status: loanData.isRepaid ? 'repaid' : 
                  loanData.lender.toString() !== '11111111111111111111111111111111' ? 'approved' : 'pending',
            purpose: 'Loan', // We don't store purpose in the on-chain data
            createdAt: loanData.startTime || Date.now(),
          }];
        }
      } catch (error) {
        console.log('No on-chain loan data found, using simulation data');
      }
      
      // If no on-chain data or error, return simulated data
      const simulatedLoans: LoanApplication[] = [
        {
          id: `L-${userPubkey.toString().substring(0, 4)}1`,
          borrower: userPubkey.toString(),
          amount: 1000000000, // 1 SOL in lamports
          termDays: 30,
          status: 'pending',
          purpose: 'Business Expansion',
          createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        },
        {
          id: `L-${userPubkey.toString().substring(0, 4)}2`,
          borrower: userPubkey.toString(),
          amount: 500000000, // 0.5 SOL in lamports
          termDays: 15,
          status: 'approved',
          purpose: 'Investment',
          createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
        }
      ];
      
      return simulatedLoans;
    } catch (error) {
      console.error('Error fetching user loans:', error);
      return [];
    }
  },

  // Approve a loan (would be called by a DAO member or admin)
  async approveLoan(
    wallet: any,
    loanPDA: PublicKey,
    borrowerPubkey: PublicKey
  ): Promise<string> {
    try {
      // Find the program fund PDA
      const [programFundPDA] = await this.findProgramFundAddress();
      
      // Create instruction with LoanInstructionType.ApproveLoan
      const dataBuffer = Buffer.from(new Uint8Array(1));
      dataBuffer[0] = LoanInstructionType.ApproveLoan;
      
      // Create the transaction instruction
      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: loanPDA, isSigner: false, isWritable: true },
          { pubkey: borrowerPubkey, isSigner: false, isWritable: true },
          { pubkey: programFundPDA, isSigner: false, isWritable: true },
        ],
        programId: LOAN_PROGRAM_ID,
        data: dataBuffer,
      });
      
      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      
      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
      
      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      return signature;
    } catch (error: any) {
      console.error('Error approving loan:', error);
      throw error;
    }
  },

  // Repay a loan
  async repayLoan(
    wallet: any,
    loanPDA: PublicKey,
    lenderPubkey: PublicKey
  ): Promise<string> {
    try {
      // Create instruction with LoanInstructionType.RepayLoan
      const dataBuffer = Buffer.from(new Uint8Array(1));
      dataBuffer[0] = LoanInstructionType.RepayLoan;
      
      // Create the transaction instruction
      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: loanPDA, isSigner: false, isWritable: true },
          { pubkey: lenderPubkey, isSigner: false, isWritable: true },
        ],
        programId: LOAN_PROGRAM_ID,
        data: dataBuffer,
      });
      
      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      
      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
      
      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      return signature;
    } catch (error: any) {
      console.error('Error repaying loan:', error);
      throw error;
    }
  },

  // Fund the program account
  async fundProgram(
    wallet: any,
    amount: number
  ): Promise<string> {
    try {
      if (!wallet.publicKey) throw new Error("Wallet not connected");

      // Find the program fund account PDA
      const [programFundPDA] = await PublicKey.findProgramAddressSync(
        [bufferFrom('program_fund')],
        LOAN_PROGRAM_ID
      );

      // Create instruction with LoanInstructionType.FundProgram
      const dataBuffer = Buffer.alloc(9); // 1 byte for instruction + 8 bytes for amount
      dataBuffer[0] = LoanInstructionType.FundProgram;
      
      // Write amount as a 64-bit little-endian unsigned integer
      const amountBuffer = Buffer.alloc(8);
      amountBuffer.writeBigUInt64LE(BigInt(amount), 0);
      for (let i = 0; i < 8; i++) {
        dataBuffer[i + 1] = amountBuffer[i];
      }

      // Create the transaction instruction
      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: programFundPDA, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: LOAN_PROGRAM_ID,
        data: dataBuffer,
      });

      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      
      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      // Sign and send transaction
      const signature = await wallet.sendTransaction(transaction, connection);
      
      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed');
      
      console.log("Program funded with signature:", signature);
      
      toast({
        title: "Program Funded Successfully",
        description: `You have funded the loan program with ${amount} lamports.`,
      });
      
      return signature;
    } catch (error: any) {
      console.error('Error funding program:', error);
      toast({
        title: "Program Funding Error",
        description: error.message || "Failed to fund program",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  // Get loan details
  async getLoanDetails(loanId: string): Promise<LoanApplication | null> {
    try {
      // Convert loanId to PublicKey
      const loanPDA = new PublicKey(loanId);
      
      // Fetch the loan account data
      const accountInfo = await connection.getAccountInfo(loanPDA);
      
      if (!accountInfo || accountInfo.data.length === 0) {
        return null;
      }
      
      // Deserialize the loan account data
      // Skip the first byte which is the instruction type
      const data = accountInfo.data.slice(1);
      
      // Create a buffer from the data
      const buffer = Buffer.from(data);
      
      // Deserialize using borsh
      const loanData = borsh.deserialize(
        loanApplicationSchema,
        buffer
      ) as unknown as LoanAccount;
      
      // Convert to LoanApplication format
      return {
        id: loanPDA.toString(),
        borrower: loanData.borrower.toString(),
        amount: loanData.amount,
        termDays: loanData.termDays,
        status: loanData.isRepaid ? 'repaid' : 
               loanData.lender.toString() !== '11111111111111111111111111111111' ? 'approved' : 'pending',
        purpose: 'Loan', // We don't store purpose in the on-chain data
        createdAt: loanData.startTime || Date.now(),
      };
    } catch (error) {
      console.error('Error fetching loan details:', error);
      return null;
    }
  }
};
