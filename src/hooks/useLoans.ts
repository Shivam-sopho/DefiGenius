import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from '@/components/ui/use-toast';
import { loanProgramService, LoanApplication } from '@/services/loanProgramService';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { LoanTransaction } from '@/services/simulationService';

export function useLoans() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [transactions, setTransactions] = useState<LoanTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [loadingLoanDetails, setLoadingLoanDetails] = useState(false);
  const [isFundingProgram, setIsFundingProgram] = useState(false);

  // Fetch loans for connected wallet
  const fetchLoans = useCallback(async () => {
    if (!publicKey || !connected) {
      setLoans([]);
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    try {
      const userLoans = await loanProgramService.getUserLoans(publicKey);
      setLoans(userLoans);
    } catch (error: any) {
      console.error('Error fetching loans:', error);
      toast({
        title: "Failed to fetch loans",
        description: error.message || "An error occurred while fetching your loans",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connected]);

  // Fetch transactions for connected wallet
  const fetchTransactions = useCallback(async () => {
    if (!publicKey || !connected) {
      setTransactions([]);
      return;
    }

    try {
      const userTransactions = await loanProgramService.getUserTransactions(publicKey);
      setTransactions(userTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Failed to fetch transactions",
        description: error.message || "An error occurred while fetching your transactions",
        variant: "destructive",
      });
    }
  }, [publicKey, connected]);

  // Apply for a new loan
  const applyForLoan = useCallback(async (amount: number, termDays: number, purpose: string) => {
    if (!publicKey || !connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to apply for a loan",
        variant: "destructive",
      });
      return null;
    }

    setIsSubmitting(true);
    try {
      const signature = await loanProgramService.createLoanApplication(
        { publicKey, sendTransaction },
        amount,
        termDays,
        purpose
      );
      
      toast({
        title: "Loan application successful",
        description: `Your loan application has been submitted for ${amount / LAMPORTS_PER_SOL} SOL.`,
      });
      
      // Refresh loans and transactions after application
      await Promise.all([fetchLoans(), fetchTransactions()]);
      return signature;
    } catch (error: any) {
      console.error('Error applying for loan:', error);
      toast({
        title: "Loan application failed",
        description: error.message || "An error occurred while applying for a loan",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [publicKey, connected, sendTransaction, fetchLoans, fetchTransactions]);

  // Fund the program
  const fundProgram = useCallback(async (amountLamports: number) => {
    if (!publicKey || !connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to fund the program",
        variant: "destructive",
      });
      return null;
    }

    setIsFundingProgram(true);
    try {
      const signature = await loanProgramService.fundProgram(
        { publicKey, sendTransaction },
        amountLamports
      );
      
      toast({
        title: "Program funded successfully",
        description: `You have funded the loan program with ${amountLamports / LAMPORTS_PER_SOL} SOL.`,
      });
      
      // Refresh transactions after funding
      await fetchTransactions();
      return signature;
    } catch (error: any) {
      console.error('Error funding program:', error);
      toast({
        title: "Program funding failed",
        description: error.message || "An error occurred while funding the program",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsFundingProgram(false);
    }
  }, [publicKey, connected, sendTransaction, fetchTransactions]);

  // Get loan details
  const getLoanDetails = useCallback(async (loanId: string) => {
    setLoadingLoanDetails(true);
    try {
      const loan = await loanProgramService.getLoanDetails(loanId);
      setSelectedLoan(loan);
      return loan;
    } catch (error: any) {
      console.error('Error fetching loan details:', error);
      toast({
        title: "Failed to fetch loan details",
        description: error.message || "An error occurred while fetching loan details",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoadingLoanDetails(false);
    }
  }, []);
  
  // Clear selected loan
  const clearSelectedLoan = useCallback(() => {
    setSelectedLoan(null);
  }, []);

  // Fetch loans and transactions when wallet connection changes
  useEffect(() => {
    if (connected && publicKey) {
      Promise.all([fetchLoans(), fetchTransactions()]);
    } else {
      setLoans([]);
      setTransactions([]);
    }
  }, [connected, publicKey, fetchLoans, fetchTransactions]);

  return {
    loans,
    transactions,
    isLoading,
    isSubmitting,
    selectedLoan,
    loadingLoanDetails,
    isFundingProgram,
    fetchLoans,
    fetchTransactions,
    applyForLoan,
    fundProgram,
    getLoanDetails,
    clearSelectedLoan
  };
}
