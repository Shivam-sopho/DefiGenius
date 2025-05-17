
import Layout from "@/components/Layout";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <Layout>
      <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About DeFiGenius</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Revolutionizing DeFi lending with the power of AI and Solana blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="mb-4 text-lg">
              DeFiGenius was founded with a clear mission: to create the most intelligent, user-friendly, 
              and transparent DeFi loan platform powered by LLMs, personalized agents, and modular 
              smart contracts on Solana.
            </p>
            <p className="text-lg">
              We believe that access to financial services should be democratized, with personalized 
              experiences that guide users through complex financial decisions while maintaining 
              the trustless nature of blockchain technology.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-8">
            <h3 className="font-bold text-xl mb-4">Core Values</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mt-1">1</span>
                <div>
                  <h4 className="font-medium">User Empowerment</h4>
                  <p className="text-muted-foreground">
                    We design our platform to educate and empower users, not just facilitate transactions.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mt-1">2</span>
                <div>
                  <h4 className="font-medium">Technological Innovation</h4>
                  <p className="text-muted-foreground">
                    We continuously push the boundaries of what's possible with AI and blockchain integration.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mt-1">3</span>
                <div>
                  <h4 className="font-medium">Transparency</h4>
                  <p className="text-muted-foreground">
                    We believe in complete transparency for all loan terms and platform operations.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mt-1">4</span>
                <div>
                  <h4 className="font-medium">Community Governance</h4>
                  <p className="text-muted-foreground">
                    Our platform is governed by our DAO members, ensuring all voices are heard.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-16" />

        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">The Technology Stack</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-3">AI Layer</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>LangChain for orchestration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>GPT-4 for natural language processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Custom fine-tuned models for finance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Vector DB for context memory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Function calling for structured outputs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-3">Blockchain Layer</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Solana for high throughput</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Custom smart contracts for loans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>NFT-based loan agreements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>DAO governance framework</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Oracle integration for price feeds</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-3">User Experience</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>React Native mobile-first design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Embedded W3C Web Components</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Progressive Web App capabilities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Full WCAG accessibility compliance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Chatbot for guided experiences</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-16" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            DeFiGenius is built by a team of experts in AI, blockchain technology, and decentralized finance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4"></div>
            <h3 className="font-bold">Sophia Chen</h3>
            <p className="text-muted-foreground">CEO & AI Architect</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4"></div>
            <h3 className="font-bold">Marcus Williams</h3>
            <p className="text-muted-foreground">CTO & Blockchain Lead</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4"></div>
            <h3 className="font-bold">Aisha Johnson</h3>
            <p className="text-muted-foreground">COO & Financial Strategist</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
