
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@solana/wallet-adapter-react";
import { Clock, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";

interface ProposalProps {
  id: number;
  title: string;
  description: string;
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  timeRemaining: string;
  type: "parameter" | "dispute" | "governance";
}

const mockProposals: ProposalProps[] = [
  {
    id: 1,
    title: "Increase maximum loan amount to 50,000 SOL",
    description: "This proposal seeks to increase the maximum loan amount from 10,000 SOL to 50,000 SOL to accommodate larger borrowing needs for institutional clients.",
    status: "active",
    votesFor: 120000,
    votesAgainst: 45000,
    timeRemaining: "2 days",
    type: "parameter"
  },
  {
    id: 2,
    title: "Override AI rejection: Loan Application #1234",
    description: "This dispute challenges an AI rejection for loan application #1234. The applicant believes the credit scoring was incorrect based on their transaction history.",
    status: "active",
    votesFor: 89000,
    votesAgainst: 92000,
    timeRemaining: "12 hours",
    type: "dispute"
  },
  {
    id: 3,
    title: "Add USDT as supported collateral",
    description: "Proposal to add USDT as a supported collateral type alongside SOL, USDC and NFTs.",
    status: "passed",
    votesFor: 230000,
    votesAgainst: 45000,
    timeRemaining: "Completed",
    type: "parameter"
  },
  {
    id: 4,
    title: "Reduce required collateralization ratio to 110%",
    description: "This proposal suggests reducing the required collateralization ratio from 125% to 110% to increase capital efficiency.",
    status: "rejected",
    votesFor: 67000,
    votesAgainst: 189000,
    timeRemaining: "Completed",
    type: "parameter"
  },
  {
    id: 5,
    title: "Add community representative to governance board",
    description: "This proposal would add an elected community representative to the governance board to ensure broader representation.",
    status: "pending",
    votesFor: 0,
    votesAgainst: 0,
    timeRemaining: "Starts in 2 days",
    type: "governance"
  }
];

function Proposal({ proposal }: { proposal: ProposalProps }) {
  const { connected } = useWallet();
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState(false);
  
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 50;
  
  const handleVote = (isFor: boolean) => {
    if (!connected) return;
    setHasVoted(true);
    setVotedFor(isFor);
  };
  
  const statusColors = {
    active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    passed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  };

  const typeColors = {
    parameter: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    dispute: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    governance: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[proposal.status]}`}>
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[proposal.type]}`}>
            {proposal.type.charAt(0).toUpperCase() + proposal.type.slice(1)}
          </span>
          {proposal.status === "active" && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> {proposal.timeRemaining}
            </span>
          )}
        </div>
        <CardTitle>{proposal.title}</CardTitle>
        <CardDescription>{proposal.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>For: {proposal.votesFor.toLocaleString()} votes</span>
              <span>Against: {proposal.votesAgainst.toLocaleString()} votes</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden">
              <div 
                className="bg-green-500" 
                style={{ width: `${forPercentage}%` }}
              />
              <div 
                className="bg-red-500" 
                style={{ width: `${100 - forPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {proposal.status === "active" ? (
          hasVoted ? (
            <p className="text-sm text-muted-foreground">
              You voted {votedFor ? "for" : "against"} this proposal
            </p>
          ) : (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center" 
                disabled={!connected}
                onClick={() => handleVote(true)}
              >
                <ThumbsUp className="h-4 w-4 mr-1" /> Vote For
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center" 
                disabled={!connected}
                onClick={() => handleVote(false)}
              >
                <ThumbsDown className="h-4 w-4 mr-1" /> Vote Against
              </Button>
            </div>
          )
        ) : proposal.status === "pending" ? (
          <p className="text-sm text-muted-foreground">Voting begins in {proposal.timeRemaining}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            This proposal has been {proposal.status}
          </p>
        )}
        
        <Button variant="outline" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  );
}

export default function DAO() {
  const { connected } = useWallet();
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">DeFiGenius DAO</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Participate in protocol governance and dispute resolution through our decentralized autonomous organization.
          </p>
        </div>

        {!connected && (
          <Card className="mb-8 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-yellow-700 dark:text-yellow-400">Wallet Not Connected</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Please connect your wallet to participate in DAO governance. Voting power is determined by your token holdings.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Learn About Governance</Button>
            </CardFooter>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">15</CardTitle>
              <CardDescription>Active Proposals</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">1.2M</CardTitle>
              <CardDescription>Total Votes Cast</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">67%</CardTitle>
              <CardDescription>Participation Rate</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">0</CardTitle>
              <CardDescription>Your Voting Power</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Proposals</TabsTrigger>
            <TabsTrigger value="past">Past Proposals</TabsTrigger>
            <TabsTrigger value="pending">Pending Proposals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            {mockProposals.filter(p => p.status === "active").map(proposal => (
              <Proposal key={proposal.id} proposal={proposal} />
            ))}
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            {mockProposals.filter(p => p.status === "passed" || p.status === "rejected").map(proposal => (
              <Proposal key={proposal.id} proposal={proposal} />
            ))}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            {mockProposals.filter(p => p.status === "pending").map(proposal => (
              <Proposal key={proposal.id} proposal={proposal} />
            ))}
            
            <Card className="text-center py-8 px-4">
              <CardContent>
                <p className="text-muted-foreground mb-4">Want to create a new proposal?</p>
                <Button disabled={!connected}>Create Proposal</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
