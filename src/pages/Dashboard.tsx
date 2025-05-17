import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Loader2, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLoans } from "@/hooks/useLoans";
import { LoanApplication } from "@/services/loanProgramService";
import { useProgramFund } from "@/hooks/useProgramFund";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  const { balance, isLoading, requestAirdrop } = useSolanaWallet();
  const { loans, isLoading: isLoadingLoans, transactions } = useLoans();
  const { fundProgram, isLoading: isFunding } = useProgramFund();

  // Format a loan status into a component with the appropriate styling
  const formatLoanStatus = (status: string) => {
    const statusConfig: Record<string, { bgColor: string; textColor: string }> = {
      pending: { bgColor: "bg-yellow-50", textColor: "text-yellow-700" },
      approved: { bgColor: "bg-green-50", textColor: "text-green-700" },
      rejected: { bgColor: "bg-red-50", textColor: "text-red-700" },
      repaid: { bgColor: "bg-blue-50", textColor: "text-blue-700" },
    };

    const config = statusConfig[status] || { bgColor: "bg-gray-50", textColor: "text-gray-700" };

    return (
      <span 
        className={`inline-flex items-center rounded-md ${config.bgColor} px-2 py-1 text-xs font-medium ${config.textColor} ring-1 ring-inset ring-${status === 'pending' ? 'yellow' : status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'blue'}-600/20`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Calculate total loan value in SOL
  const calculateTotalLoanValue = (loans: LoanApplication[]) => {
    const totalLamports = loans.reduce((total, loan) => total + loan.amount, 0);
    return (totalLamports / LAMPORTS_PER_SOL).toFixed(2);
  };

  // Generate a simulated credit score for the user
  const getCreditScore = () => {
    if (!publicKey) return 0;
    
    // Generate a deterministic score based on the public key
    const pubkeyString = publicKey.toString();
    const numValue = parseInt(pubkeyString.slice(0, 10), 16);
    return 600 + (numValue % 300); // Score between 600-900
  };

  const creditScore = getCreditScore();
  
  return (
    <Layout>
      <div className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage your on-chain loans and financial overview</p>
          </div>
          {connected ? (
            <Button asChild>
              <Link to="/new-loan">Apply for New Loan</Link>
            </Button>
          ) : (
            <Card className="w-full md:w-auto p-4 bg-muted/30 border-dashed">
              <p className="text-center text-muted-foreground">Connect your wallet to apply for loans</p>
            </Card>
          )}
        </div>

        {/* Wallet Information Card */}
        {connected && publicKey ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2" /> Wallet Information
              </CardTitle>
              <CardDescription>Your connected Solana wallet details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-mono">{publicKey.toBase58()}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-muted-foreground">Balance:</span>
                  <span>{isLoading ? "Loading..." : balance !== null ? `${balance.toFixed(4)} SOL` : "Unknown"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button onClick={requestAirdrop} disabled={isLoading}>
                Request 1 SOL Airdrop (Devnet)
              </Button>
              <Button onClick={() => fundProgram(1 * LAMPORTS_PER_SOL)} disabled={isFunding}>
                Fund Program with 1 SOL
              </Button>
            </CardFooter>
          </Card>
        ) : null}

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {/* Summary Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{creditScore}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {creditScore > 750 ? "Excellent" : creditScore > 700 ? "Good" : creditScore > 650 ? "Fair" : "Needs Improvement"} - Based on on-chain data
              </p>
              <Progress value={creditScore / 10} className="mt-3" />
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild className="p-0">
                <Link to="/credit-details">
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              {connected ? (
                isLoadingLoans ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{loans.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total value: {calculateTotalLoanValue(loans)} SOL
                    </p>
                    <Progress value={65} className="mt-3" indicatorColor="bg-amber-500" />
                  </>
                )
              ) : (
                <>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connect wallet to view
                  </p>
                  <Progress value={0} className="mt-3" />
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild className="p-0">
                <Link to="/loans">
                  Manage Loans <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connected ? `${(creditScore * 5 / LAMPORTS_PER_SOL).toFixed(2)} SOL` : "-"}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on your current blockchain credit score
              </p>
              <Progress value={connected ? 85 : 0} className="mt-3" indicatorColor="bg-green-500" />
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild className="p-0">
                <Link to="/new-loan">
                  Apply Now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="loans">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="loans">Your Loans</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            <TabsContent value="loans" className="mt-6">
              {!connected ? (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">Connect your wallet to view your loans</p>
                  </CardContent>
                </Card>
              ) : isLoadingLoans ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  </CardContent>
                </Card>
              ) : loans.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Term</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {loans.map((loan) => (
                        <tr key={loan.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">{loan.id}</td>
                          <td className="p-4 align-middle">{(loan.amount / LAMPORTS_PER_SOL).toFixed(2)} SOL</td>
                          <td className="p-4 align-middle">{loan.termDays} days</td>
                          <td className="p-4 align-middle">
                            {formatLoanStatus(loan.status)}
                          </td>
                          <td className="p-4 align-middle">
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/loans`}>View</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">You don't have any loans yet. Apply for your first loan today!</p>
                    <div className="flex justify-center mt-4">
                      <Button asChild>
                        <Link to="/new-loan">Apply for a Loan</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              {!connected ? (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">Connect your wallet to view transaction history</p>
                  </CardContent>
                </Card>
              ) : transactions.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">From</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">To</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">{tx.type}</td>
                          <td className="p-4 align-middle">{(tx.amount / LAMPORTS_PER_SOL).toFixed(2)} SOL</td>
                          <td className="p-4 align-middle">{tx.from.slice(0, 4)}...{tx.from.slice(-4)}</td>
                          <td className="p-4 align-middle">{tx.to.slice(0, 4)}...{tx.to.slice(-4)}</td>
                          <td className="p-4 align-middle">{new Date(tx.timestamp).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">No transaction history available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="recommendations" className="mt-6">
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">Recommendations coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
