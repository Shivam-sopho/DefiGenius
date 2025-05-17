
import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const WalletConnect: FC<WalletConnectProps> = ({ 
  variant = "outline",
  size = "default",
  className = ""
}) => {
  const { connected, connecting, publicKey, connect, disconnect, wallet } = useWallet();
  
  const handleConnectClick = async () => {
    if (connected) {
      disconnect();
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected successfully."
      });
    } else {
      if (!wallet) {
        toast({
          title: "Please install Phantom",
          description: "Phantom wallet is required to connect. Please install the browser extension or mobile app.",
          variant: "destructive",
        });
        window.open('https://phantom.app/', '_blank');
        return;
      }
      
      try {
        await connect();
        toast({
          title: "Wallet connected",
          description: `Connected to ${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`
        });
      } catch (error: any) {
        toast({
          title: "Connection failed",
          description: error.message || "Could not connect to wallet",
          variant: "destructive",
        });
      }
    }
  };

  // Use the built-in WalletMultiButton for a complete UI solution
  return (
    <div className={className}>
      <WalletMultiButton className="phantom-button" />
      
      {/* Fallback/custom button if needed */}
      {false && ( 
        <Button 
          variant={variant} 
          size={size}
          onClick={handleConnectClick}
          disabled={connecting}
        >
          <Wallet className="mr-2" />
          {connected ? "Disconnect" : "Connect Wallet"}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
