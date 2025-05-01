import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex items-center justify-center h-screen">
      <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </main>
  );
}