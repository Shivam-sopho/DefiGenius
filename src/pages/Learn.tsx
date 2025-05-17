
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Code, VideoIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Learn() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">DeFi Learning Center</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expand your knowledge about DeFi, blockchain technology, and smart contracts
          </p>
        </div>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="basics">DeFi Basics</TabsTrigger>
            <TabsTrigger value="borrowing">Borrowing Fundamentals</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Topics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    What is DeFi?
                  </CardTitle>
                  <CardDescription>Understanding decentralized finance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Learn about the fundamental concepts of DeFi and how it's revolutionizing traditional finance through blockchain technology.</p>
                  <Button variant="outline" className="w-full mt-4">Read Article</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <VideoIcon className="h-5 w-5" />
                    Blockchain 101
                  </CardTitle>
                  <CardDescription>Video course for beginners</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>A comprehensive video series explaining blockchain technology, cryptocurrencies, and their real-world applications.</p>
                  <Button variant="outline" className="w-full mt-4">Watch Videos</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Smart Contracts Explained
                  </CardTitle>
                  <CardDescription>The building blocks of DeFi</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Understand how smart contracts work, their security considerations, and their role in enabling trustless transactions.</p>
                  <Button variant="outline" className="w-full mt-4">Learn More</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="borrowing">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Fundamentals</CardTitle>
                  <CardDescription>Understanding DeFi loans</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Learn about collateralized loans, interest rates, and loan-to-value ratios in decentralized finance.</p>
                  <Button variant="outline" className="w-full mt-4">Read Guide</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk Management</CardTitle>
                  <CardDescription>Staying safe in DeFi</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Understanding liquidation risks, volatility, and strategies to protect your assets when borrowing.</p>
                  <Button variant="outline" className="w-full mt-4">Learn Strategies</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>AI in Lending</CardTitle>
                  <CardDescription>The DeFiGenius advantage</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Discover how our AI-powered system creates better loan terms, reduces risk, and improves the borrowing experience.</p>
                  <Button variant="outline" className="w-full mt-4">Explore Technology</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>DAO Governance</CardTitle>
                  <CardDescription>Community decision-making</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Learn how our DAO governance model works and how you can participate in platform decisions.</p>
                  <Button variant="outline" className="w-full mt-4">Read Documentation</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Solana Development</CardTitle>
                  <CardDescription>For developers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Technical resources for developers looking to understand or contribute to our Solana-based smart contracts.</p>
                  <Button variant="outline" className="w-full mt-4">View Technical Docs</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>NFT Loan Agreements</CardTitle>
                  <CardDescription>Advanced feature guide</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Deep dive into our innovative NFT-based loan agreement system and how it ensures transparency and security.</p>
                  <Button variant="outline" className="w-full mt-4">Explore Feature</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-12" />
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to apply your knowledge?</h2>
          <Button asChild size="lg" className="mt-2">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
