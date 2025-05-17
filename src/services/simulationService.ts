import { PublicKey } from '@solana/web3.js';
import { LoanApplication } from './loanProgramService';

export interface LoanTransaction {
  id: string;
  loanId: string;
  type: 'transfer' | 'repayment';
  amount: number;
  from: string;
  to: string;
  timestamp: number;
  signature: string;
}

class SimulationService {
  private static instance: SimulationService;
  private inMemoryLoans: Map<string, LoanApplication>;
  private inMemoryTransactions: Map<string, LoanTransaction[]>;

  private constructor() {
    this.inMemoryLoans = new Map();
    this.inMemoryTransactions = new Map();
  }

  public static getInstance(): SimulationService {
    if (!SimulationService.instance) {
      SimulationService.instance = new SimulationService();
    }
    return SimulationService.instance;
  }

  // Add a new loan to simulation
  public addLoan(loan: LoanApplication): void {
    this.inMemoryLoans.set(loan.id, loan);
  }

  // Get all loans for a user
  public getUserLoans(userPubkey: PublicKey): LoanApplication[] {
    const userLoans = Array.from(this.inMemoryLoans.values())
      .filter(loan => loan.borrower === userPubkey.toString());
    
    if (userLoans.length === 0) {
      // Return simulated data if no loans exist
      return [
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
    }
    
    return userLoans;
  }

  // Add a new transaction
  public addTransaction(transaction: LoanTransaction): void {
    const userTransactions = this.inMemoryTransactions.get(transaction.from) || [];
    userTransactions.push(transaction);
    this.inMemoryTransactions.set(transaction.from, userTransactions);
  }

  // Get all transactions for a user
  public getUserTransactions(userPubkey: PublicKey): LoanTransaction[] {
    const userTransactions = this.inMemoryTransactions.get(userPubkey.toString()) || [];
    
    if (userTransactions.length === 0) {
      // Return simulated transaction data if no transactions exist
      return [
        {
          id: `TX-${userPubkey.toString().substring(0, 4)}1`,
          loanId: `L-${userPubkey.toString().substring(0, 4)}1`,
          type: 'transfer',
          amount: 1000000000, // 1 SOL in lamports
          from: 'DahnMn7khqD73k8B3nhFp3MJxpZC5n5Spr6acdiLmSrv',
          to: userPubkey.toString(),
          timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
          signature: 'simulated_signature_1'
        },
        {
          id: `TX-${userPubkey.toString().substring(0, 4)}2`,
          loanId: `L-${userPubkey.toString().substring(0, 4)}2`,
          type: 'transfer',
          amount: 500000000, // 0.5 SOL in lamports
          from: 'DahnMn7khqD73k8B3nhFp3MJxpZC5n5Spr6acdiLmSrv',
          to: userPubkey.toString(),
          timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
          signature: 'simulated_signature_2'
        }
      ];
    }
    
    return userTransactions;
  }

  // Get loan details
  public getLoanDetails(loanId: string): LoanApplication | null {
    return this.inMemoryLoans.get(loanId) || null;
  }

  // Clear all simulation data (useful for testing)
  public clearAll(): void {
    this.inMemoryLoans.clear();
    this.inMemoryTransactions.clear();
  }
}

export const simulationService = SimulationService.getInstance(); 