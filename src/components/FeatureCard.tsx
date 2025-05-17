
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, ShieldCheck, User, Wallet, Users, QrCode, Globe } from "lucide-react";

// Define the icon types we'll be using
type IconType = "heart" | "shield" | "shield-check" | "user" | "wallet" | "users" | "qr-code" | "globe";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: IconType;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  // Function to render the appropriate icon
  const renderIcon = () => {
    switch (icon) {
      case "heart":
        return <Heart className="h-12 w-12 text-primary" />;
      case "shield":
        return <Shield className="h-12 w-12 text-primary" />;
      case "shield-check":
        return <ShieldCheck className="h-12 w-12 text-primary" />;
      case "user":
        return <User className="h-12 w-12 text-primary" />;
      case "wallet":
        return <Wallet className="h-12 w-12 text-primary" />;
      case "users":
        return <Users className="h-12 w-12 text-primary" />;
      case "qr-code":
        return <QrCode className="h-12 w-12 text-primary" />;
      case "globe":
        return <Globe className="h-12 w-12 text-primary" />;
      default:
        return <Heart className="h-12 w-12 text-primary" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start space-x-4">
        <div className="mt-1">{renderIcon()}</div>
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
