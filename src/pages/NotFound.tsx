
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 md:px-8 text-center">
        <h1 className="text-9xl font-extrabold tracking-tighter text-primary">404</h1>
        <h2 className="text-3xl font-bold mt-6">Page Not Found</h2>
        <p className="text-muted-foreground text-lg max-w-md mt-4 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Button asChild size="lg">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </Layout>
  );
}
