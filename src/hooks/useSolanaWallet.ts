
import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';
import { solanaService } from '@/services/solanaService';
import { toast } from '@/components/ui/use-toast';

export function useSolanaWallet() {
  const { publicKey, connected, connecting } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch wallet balance
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connected) {
      setBalance(null);
      return;
    }

    setIsLoading(true);
    try {
      const walletBalance = await solanaService.getBalance(publicKey);
      setBalance(walletBalance);
    } catch (error: any) {
      console.error('Error fetching balance:', error);
      toast({
        title: "Failed to fetch balance",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connected]);

  // Request an airdrop (devnet only)
  const requestAirdrop = useCallback(async () => {
    if (!publicKey || !connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const signature = await solanaService.requestAirdrop(publicKey);
      toast({
        title: "Airdrop successful",
        description: `1 SOL added to your wallet. TX: ${signature.slice(0, 8)}...`,
      });
      // Update balance after airdrop
      await fetchBalance();
    } catch (error: any) {
      console.error('Airdrop error:', error);
      toast({
        title: "Airdrop failed",
        description: error.message || "Could not request SOL airdrop",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connected, fetchBalance]);

  // Fetch balance whenever wallet connection changes
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [connected, publicKey, fetchBalance]);

  return {
    publicKey,
    connected,
    connecting,
    balance,
    isLoading,
    fetchBalance,
    requestAirdrop,
  };
}
