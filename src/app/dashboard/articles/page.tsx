import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ArticlesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Articles</h1>

            <Button asChild>
                <Link href="/dashboard/articles/create">Create New</Link>
            </Button>
        </div>
    );
}  