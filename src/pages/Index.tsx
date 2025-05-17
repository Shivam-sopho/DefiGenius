import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import FeatureCard from "@/components/FeatureCard";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            DeFiGenius
            <span className="text-primary block mt-2">Personalized, Trustless Borrowing with Agentic AI & Web3</span>
          </h1>
          <p className="text-xl max-w-3xl text-muted-foreground">
            The most intelligent, user-friendly, and transparent DeFi loan platform powered by LLMs, 
            personalized agents, and modular smart contracts on Solana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/dashboard">
                Launch App <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link to="/learn">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Separator />
      
      {/* Core Innovations Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Innovations</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Combining the power of AI and blockchain technology to revolutionize DeFi borrowing
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="Agentic Borrower Experience"
            description="LLM-powered agents assist users in navigating the borrowing process with personalized recommendations."
            icon="user"
          />
          <FeatureCard 
            title="AI Credit Scoring Engine"
            description="Uses both on-chain and off-chain data to generate a comprehensive credit score."
            icon="shield-check"
          />
          <FeatureCard 
            title="Fraud Risk Detection"
            description="Agent evaluates patterns of suspicious behavior using heuristics + AI."
            icon="shield"
          />
          <FeatureCard 
            title="DAO Dispute Mechanism"
            description="DAO members can view flagged loans and override AI-based decisions via voting."
            icon="users"
          />
          <FeatureCard 
            title="NFT-QR Agreement System"
            description="Loan agreement minted as dynamic NFT containing on-chain metadata."
            icon="qr-code"
          />
          <FeatureCard 
            title="Solana Smart Contracts"
            description="Built on Solana for near-instant, low-cost transactions ideal for micro-lending."
            icon="wallet"
          />
        </div>
      </section>
      
      <Separator />
      
      {/* How It Works Section */}
      <section className="bg-muted py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A seamless borrowing experience powered by AI and blockchain
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Connect your Phantom or Solflare wallet to get started</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <p>AI agent walks you through the loan application process</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Approve</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your application is analyzed and a smart contract is invoked</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage</CardTitle>
              </CardHeader>
              <CardContent>
                <p>NFT agreement is minted and repayments are tracked on-chain</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-4 md:px-8">
        <Card className="max-w-4xl mx-auto bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Ready to experience the future of DeFi?</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Join the revolution in decentralized finance with AI-powered borrowing.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/dashboard">
                Launch App <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </Layout>
  );
}
