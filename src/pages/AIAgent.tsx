
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your DeFiGenius AI agent. I can help you understand loan terms, navigate the borrowing process, and provide personalized financial recommendations. How can I assist you today?"
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      let responseContent = "";
      
      if (input.toLowerCase().includes("loan")) {
        responseContent = "Based on your credit score of 725, you qualify for loans up to 3,500 USDC with interest rates starting at 5.8% APR. Would you like me to walk you through the application process?";
      } else if (input.toLowerCase().includes("credit") || input.toLowerCase().includes("score")) {
        responseContent = "Your DeFiGenius credit score is 725, which is considered 'Good'. This score is calculated based on your on-chain transaction history, wallet age, and previous borrowing behavior. To improve your score, consider maintaining regular repayments and increasing your wallet activity with consistent transactions.";
      } else if (input.toLowerCase().includes("interest") || input.toLowerCase().includes("rate")) {
        responseContent = "Current interest rates range from 5.8% to 12.5% APR, depending on loan term and amount. With your credit profile, you qualify for our mid-tier rates starting at 7.2% for standard 30-day loans.";
      } else {
        responseContent = "I'm here to help with any questions about DeFi loans, credit scoring, or navigating the platform. Feel free to ask about loan terms, application processes, or how to improve your borrowing potential.";
      }
      
      const aiResponse: Message = { role: "assistant", content: responseContent };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 order-2 md:order-1">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader>
                <CardTitle>AI Loan Agent</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-[calc(100%-5rem)]">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === "user" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="mt-4 flex gap-2">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about loans, credit scores, or terms..."
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-80 order-1 md:order-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-2 rounded">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Personalized Analysis</h4>
                    <p className="text-sm text-muted-foreground">Get credit advice tailored to your wallet history</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-2 rounded">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Contract Explanations</h4>
                    <p className="text-sm text-muted-foreground">Understand complex loan terms in plain language</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-2 rounded">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Guided Applications</h4>
                    <p className="text-sm text-muted-foreground">Step-by-step assistance with loan applications</p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <h4 className="font-medium">Suggested Questions</h4>
                  <ul className="mt-2 space-y-2">
                    <li>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-primary" 
                        onClick={() => {
                          setInput("What loans am I eligible for?");
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        What loans am I eligible for?
                      </Button>
                    </li>
                    <li>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-primary" 
                        onClick={() => {
                          setInput("How is my credit score calculated?");
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        How is my credit score calculated?
                      </Button>
                    </li>
                    <li>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-primary" 
                        onClick={() => {
                          setInput("What are the current interest rates?");
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        What are the current interest rates?
                      </Button>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
