
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu } from "lucide-react";
import WalletConnect from "./WalletConnect";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center">
          <span className="font-bold text-2xl text-primary">DeFiGenius</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/learn" className="text-muted-foreground hover:text-primary transition-colors">
            Learn
          </Link>
          <Link to="/loans" className="text-muted-foreground hover:text-primary transition-colors">
            Loans
          </Link>
          <Link to="/new-loan" className="text-muted-foreground hover:text-primary transition-colors">
            Apply
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/dao" className="text-muted-foreground hover:text-primary transition-colors">
            DAO
          </Link>
          <WalletConnect />
        </nav>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu />
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden px-4 pb-4 border-t pt-2">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/dashboard" 
                className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/learn" 
                className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Learn
              </Link>
            </li>
            <li>
              <Link 
                to="/loans" 
                className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Loans
              </Link>
            </li>
            <li>
              <Link 
                to="/new-loan" 
                className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apply for Loan
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/dao" 
                className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                DAO
              </Link>
            </li>
            <li className="pt-2">
              <WalletConnect className="w-full" />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
