import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoans } from "@/hooks/useLoans";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function TestLoan() {
  const { connected } = useWallet();
  const { fundProgram, applyForLoan, isSubmitting, isFundingProgram } = useLoans();
  const [fundAmount, setFundAmount] = useState("2000000000"); // 2 SOL in lamports
  const [loanAmount, setLoanAmount] = useState("1000000000"); // 1 SOL in lamports
  const [loanTerm, setLoanTerm] = useState("30"); // 30 days

  const handleFundProgram = async () => {
    try {
      const signature = await fundProgram(Number(fundAmount));
      if (signature) {
        toast({
          title: "Program Funded Successfully",
          description: `Program funded with ${Number(fundAmount) / LAMPORTS_PER_SOL} SOL`,
        });
      }
    } catch (error) {
      console.error("Error funding program:", error);
    }
  };

  const handleApplyForLoan = async () => {
    try {
      const signature = await applyForLoan(
        Number(loanAmount),
        Number(loanTerm),
        "Test loan"
      );
      if (signature) {
        toast({
          title: "Loan Application Successful",
          description: `Applied for ${Number(loanAmount) / LAMPORTS_PER_SOL} SOL loan`,
        });
      }
    } catch (error) {
      console.error("Error applying for loan:", error);
    }
  };

  if (!connected) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>Please connect your wallet to test the loan functionality</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fund Program Card */}
        <Card>
          <CardHeader>
            <CardTitle>Fund Program</CardTitle>
            <CardDescription>Add funds to the loan program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fundAmount">Amount (Lamports)</Label>
                <Input
                  id="fundAmount"
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="Enter amount in lamports"
                />
                <p className="text-sm text-muted-foreground">
                  Equivalent to {(Number(fundAmount) / LAMPORTS_PER_SOL).toFixed(2)} SOL
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleFundProgram}
              disabled={isFundingProgram || !fundAmount || Number(fundAmount) <= 0}
              className="w-full"
            >
              {isFundingProgram ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Funding...
                </>
              ) : "Fund Program"}
            </Button>
          </CardFooter>
        </Card>

        {/* Apply for Loan Card */}
        <Card>
          <CardHeader>
            <CardTitle>Apply for Loan</CardTitle>
            <CardDescription>Create a new loan application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (Lamports)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter loan amount in lamports"
                />
                <p className="text-sm text-muted-foreground">
                  Equivalent to {(Number(loanAmount) / LAMPORTS_PER_SOL).toFixed(2)} SOL
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (Days)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="Enter loan term in days"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleApplyForLoan}
              disabled={isSubmitting || !loanAmount || !loanTerm || Number(loanAmount) <= 0 || Number(loanTerm) <= 0}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : "Apply for Loan"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 