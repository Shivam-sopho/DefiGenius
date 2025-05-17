
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useWallet } from "@solana/wallet-adapter-react";
import { AlertTriangle, Info, Loader2 } from "lucide-react";
import { useLoans } from "@/hooks/useLoans";
import { useNavigate } from "react-router-dom";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const formSchema = z.object({
  loanAmount: z.string().min(1, "Loan amount is required"),
  loanPurpose: z.string().min(1, "Loan purpose is required"),
  loanTerm: z.string().min(1, "Loan term is required"),
  collateralType: z.string().optional(),
});

export default function NewLoan() {
  const { connected } = useWallet();
  const [sliderValue, setSliderValue] = useState(1000000000); // 1 SOL in lamports as default
  const { applyForLoan, isSubmitting } = useLoans();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: "1000000000",
      loanPurpose: "",
      loanTerm: "30",
      collateralType: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!connected) {
      return;
    }
    
    try {
      console.log(`Submitting loan application: ${values.loanAmount} lamports`);
      
      // Direct lamports amount
      const lamports = parseInt(values.loanAmount);
      const signature = await applyForLoan(
        lamports, 
        parseInt(values.loanTerm),
        values.loanPurpose
      );
      
      if (signature) {
        // After successful submission, navigate to the loans page
        setTimeout(() => {
          navigate("/loans");
        }, 2000);
      }
    } catch (error) {
      console.error("Loan application error:", error);
    }
  }

  const handleAmountChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setSliderValue(numValue);
    form.setValue("loanAmount", value);
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
    form.setValue("loanAmount", String(value[0]));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 md:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Apply for a Loan</h1>
          <p className="text-xl text-muted-foreground">
            Submit your application directly to our on-chain loan program
          </p>
        </div>
        
        {!connected && (
          <Card className="mb-8 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-yellow-700 dark:text-yellow-400">Wallet Not Connected</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Please connect your Solana wallet to apply for a loan. All loan agreements are stored on-chain.</p>
            </CardContent>
          </Card>
        )}
        
        <Alert className="mb-6 bg-blue-50 border-blue-300">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800">
            This loan program runs on the Solana blockchain and requires the smart contract to have sufficient funds.
            If you receive an "insufficient funds" error, please fund the program through the "Fund Program" button on the loans page.
          </AlertDescription>
        </Alert>
        
        <Alert className="mb-6 bg-yellow-50 border-yellow-300">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <div>
            <AlertTitle className="text-yellow-800 font-medium">Important Note About Funds</AlertTitle>
            <AlertDescription className="text-yellow-700">
              The smart contract needs to be funded to process loan requests. If you receive an "insufficient funds" error, please fund the program first.
            </AlertDescription>
          </div>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle>Loan Application - Lamports Only</CardTitle>
            <CardDescription>Fill out the form below to apply for a DeFi loan using lamports (Solana's native unit)</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount (Lamports)</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => handleAmountChange(e.target.value)}
                            value={sliderValue}
                          />
                          <Slider
                            defaultValue={[1000000000]}
                            max={10000000000}
                            min={100000000}
                            step={100000000}
                            value={[sliderValue]}
                            onValueChange={handleSliderChange}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>100,000,000 lamports</span>
                            <span>10,000,000,000 lamports</span>
                          </div>
                          <div className="text-base font-semibold text-emerald-700">
                            Equivalent to {(sliderValue / LAMPORTS_PER_SOL).toFixed(2)} SOL
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select the amount of lamports you'd like to borrow
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loanPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Purpose</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a purpose for your loan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="business">Business Expansion</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="personal">Personal Use</SelectItem>
                          <SelectItem value="investment">Investment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This helps our AI provide appropriate recommendations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loanTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Term (Days)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select loan duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">365 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose how long you need the loan for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collateralType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collateral Type (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select collateral type (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sol">SOL</SelectItem>
                          <SelectItem value="usdc">USDC</SelectItem>
                          <SelectItem value="nft">NFT</SelectItem>
                          <SelectItem value="none">No Collateral</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Providing collateral may result in better loan terms
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={!connected || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="text-sm text-muted-foreground">
              By submitting this application, you agree to allow our smart contract to create an on-chain loan record with your wallet address.
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
