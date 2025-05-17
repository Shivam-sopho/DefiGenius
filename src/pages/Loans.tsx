
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Info, Loader2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLoans } from "@/hooks/useLoans";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Loans() {
  const { connected } = useWallet();
  const { loans, isLoading, selectedLoan, loadingLoanDetails, isFundingProgram, getLoanDetails, clearSelectedLoan, fundProgram } = useLoans();
  const [showFundDialog, setShowFundDialog] = useState(false);
  const [fundAmount, setFundAmount] = useState("1000000000"); // Default 1 SOL in lamports
  
  const handleViewLoanDetails = async (loanId: string) => {
    await getLoanDetails(loanId);
  };
  
  const handleFundProgram = async () => {
    await fundProgram(Number(fundAmount));
    setShowFundDialog(false);
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">DeFi Loans</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Apply for decentralized loans backed by our DAO and processed on-chain
          </p>
        </div>
        
        {!connected && (
          <Card className="mb-8 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-yellow-700 dark:text-yellow-400">Wallet Not Connected</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Please connect your Solana wallet to view your active loans and apply for new ones.</p>
            </CardContent>
          </Card>
        )}
        
        <Alert className="mb-6 bg-blue-50 border-blue-300 dark:bg-blue-900 dark:border-blue-700">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            The loan program needs to be funded before loans can be approved and funded. Use the "Fund Program" button to add funds.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Apply for a Loan</CardTitle>
              <CardDescription>Get funding for your next project or investment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">Our smart contract loan system securely stores and processes all loan applications on the Solana blockchain.</p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Fast on-chain approval process</li>
                <li>Transparent blockchain-based terms</li>
                <li>Full transaction history</li>
                <li>No hidden fees</li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row gap-3">
              <Link to="/new-loan" className="w-full">
                <Button className="w-full" size="lg" disabled={!connected}>
                  Apply Now
                </Button>
              </Link>
              <Button 
                className="w-full" 
                variant="outline" 
                size="lg" 
                disabled={!connected}
                onClick={() => setShowFundDialog(true)}
              >
                Fund Program
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Active Loans</CardTitle>
              <CardDescription>Manage your current on-chain loans</CardDescription>
            </CardHeader>
            <CardContent>
              {!connected ? (
                <p className="py-8 text-center text-muted-foreground">
                  Connect your wallet to view your active loans and payment history.
                </p>
              ) : isLoading ? (
                <div className="py-8 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading loans...</span>
                </div>
              ) : loans.length > 0 ? (
                <div className="space-y-4">
                  {loans.map((loan) => (
                    <div key={loan.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{loan.id.substring(0, 8)}...</h3>
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          loan.status === 'approved' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                          loan.status === 'pending' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                          loan.status === 'repaid' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                          'bg-red-50 text-red-700 ring-red-600/20'
                        }`}>
                          {loan.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Amount: {loan.amount.toLocaleString()} lamports ({(loan.amount / LAMPORTS_PER_SOL).toFixed(2)} SOL)</p>
                      <p className="text-sm text-muted-foreground mb-1">Term: {loan.termDays} days</p>
                      <p className="text-sm text-muted-foreground">Purpose: {loan.purpose}</p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleViewLoanDetails(loan.id)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                  You don't have any active loans. Apply for your first loan today!
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => loans.length > 0 && handleViewLoanDetails(loans[0].id)}
                disabled={!connected || loans.length === 0 || loadingLoanDetails}
              >
                {loadingLoanDetails ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : "View Latest Loan"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">1. Apply</h3>
              <p>Fill out our application form and submit it to the Solana blockchain.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">2. On-chain Verification</h3>
              <p>Our smart contract processes your application securely on the blockchain.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">3. Receive Funds</h3>
              <p>Once approved, funds are transferred directly to your wallet.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loan Details Dialog */}
      <Dialog open={!!selectedLoan} onOpenChange={(open) => !open && clearSelectedLoan()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loan Details</DialogTitle>
            <DialogDescription>
              Details for loan {selectedLoan?.id.substring(0, 8)}...
            </DialogDescription>
          </DialogHeader>
          
          {selectedLoan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Loan ID</h4>
                  <p className="text-sm text-muted-foreground break-all">{selectedLoan.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <p className={`text-sm font-medium ${
                    selectedLoan.status === 'approved' ? 'text-green-600' :
                    selectedLoan.status === 'pending' ? 'text-yellow-600' :
                    selectedLoan.status === 'repaid' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {selectedLoan.status.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Amount</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedLoan.amount.toLocaleString()} lamports ({(selectedLoan.amount / LAMPORTS_PER_SOL).toFixed(2)} SOL)
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Borrower</h4>
                <p className="text-sm text-muted-foreground break-all">{selectedLoan.borrower}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Term Days</h4>
                  <p className="text-sm text-muted-foreground">{selectedLoan.termDays} days</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Created</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedLoan.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Purpose</h4>
                <p className="text-sm text-muted-foreground">{selectedLoan.purpose}</p>
              </div>
              
              {selectedLoan.status === 'pending' && (
                <Alert className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    This loan is awaiting approval. Make sure the program has enough funds.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => clearSelectedLoan()}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Fund Program Dialog */}
      <Dialog open={showFundDialog} onOpenChange={setShowFundDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fund Loan Program</DialogTitle>
            <DialogDescription>
              Add funds to the loan program to enable loan approvals and disbursements.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
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
            
            <Alert className="bg-blue-50 border-blue-300 dark:bg-blue-900 dark:border-blue-700">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Funds will be transferred from your wallet to the loan program to enable loan disbursements.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFundDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleFundProgram}
              disabled={isFundingProgram || !fundAmount || Number(fundAmount) <= 0}
            >
              {isFundingProgram ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Funding...
                </>
              ) : "Fund Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
