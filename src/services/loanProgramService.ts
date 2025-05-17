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
import { simulationService, LoanTransaction } from './simulationService';

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
    amount: number,
    termDays: number,
    purpose: string
  ): Promise<string> {
    try {
      if (!wallet.publicKey) throw new Error("Wallet not connected");

      // Create a unique loan ID
      const loanId = `L-${wallet.publicKey.toString().substring(0, 4)}-${Date.now()}`;
      
      // Create loan application
      const loan: LoanApplication = {
        id: loanId,
        borrower: wallet.publicKey.toString(),
        amount: amount,
        termDays: termDays,
        status: 'pending',
        purpose: purpose,
        createdAt: Date.now()
      };

      // Store loan in simulation service
      simulationService.addLoan(loan);

      // Simulate transfer from lender wallet
      const transaction: LoanTransaction = {
        id: `TX-${loanId}`,
        loanId: loanId,
        type: 'transfer',
        amount: amount,
        from: 'DahnMn7khqD73k8B3nhFp3MJxpZC5n5Spr6acdiLmSrv',
        to: wallet.publicKey.toString(),
        timestamp: Date.now(),
        signature: `simulated_${Date.now()}`
      };

      // Store transaction in simulation service
      simulationService.addTransaction(transaction);

      // Update loan status to approved
      loan.status = 'approved';
      simulationService.addLoan(loan);

      toast({
        title: "Loan Application Successful",
        description: `Your loan for ${amount / LAMPORTS_PER_SOL} SOL has been approved and funded.`,
      });

      return transaction.signature;
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

  // Get all loan applications for a user
  async getUserLoans(userPubkey: PublicKey): Promise<LoanApplication[]> {
    try {
      return simulationService.getUserLoans(userPubkey);
    } catch (error) {
      console.error('Error fetching user loans:', error);
      return [];
    }
  },

  // Get loan details
  async getLoanDetails(loanId: string): Promise<LoanApplication | null> {
    try {
      return simulationService.getLoanDetails(loanId);
    } catch (error) {
      console.error('Error fetching loan details:', error);
      return null;
    }
  },

  // Fund the program account
  async fundProgram(
    wallet: any,
    amount: number
  ): Promise<string> {
    try {
      if (!wallet.publicKey) throw new Error("Wallet not connected");

      // Simulate funding transaction
      const transaction: LoanTransaction = {
        id: `TX-FUND-${Date.now()}`,
        loanId: 'PROGRAM_FUND',
        type: 'transfer',
        amount: amount,
        from: wallet.publicKey.toString(),
        to: 'DahnMn7khqD73k8B3nhFp3MJxpZC5n5Spr6acdiLmSrv',
        timestamp: Date.now(),
        signature: `simulated_fund_${Date.now()}`
      };

      // Store transaction in simulation service
      simulationService.addTransaction(transaction);

      toast({
        title: "Program Funded Successfully",
        description: `You have funded the loan program with ${amount / LAMPORTS_PER_SOL} SOL.`,
      });

      return transaction.signature;
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

  // Get all transactions for a user
  async getUserTransactions(userPubkey: PublicKey): Promise<LoanTransaction[]> {
    try {
      return simulationService.getUserTransactions(userPubkey);
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
  },
};
