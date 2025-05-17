import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from '@/components/ui/use-toast';
import { loanProgramService } from '@/services/loanProgramService';

export function useProgramFund() {
  const { publicKey, connected, wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  // Fund the program
  const fundProgram = useCallback(async (amount: number) => {
    if (!publicKey || !connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to fund the program",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      console.log(`Funding program with ${amount} SOL`);
      console.log('Wallet object:', { publicKey, connected });
      console.log('Wallet methods:', Object.keys(wallet));
      
      const signature = await loanProgramService.fundProgram(
        wallet,
        amount
      );
      
      // Check if it's a simulated signature
      const isSimulated = signature.startsWith('sim_');
      
      if (isSimulated) {
        toast({
          title: "Program funding processed in simulation mode",
          description: "Due to wallet restrictions or domain blacklist, your funding was processed in simulation mode.",
        });
      } else {
        toast({
          title: "Program funding successful",
          description: `Program funded with ${amount} SOL. Transaction: ${signature.slice(0, 8)}...`,
        });
      }
      
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
      setIsLoading(false);
    }
  }, [publicKey, connected]);

  return {
    isLoading,
    fundProgram,
  };
} 