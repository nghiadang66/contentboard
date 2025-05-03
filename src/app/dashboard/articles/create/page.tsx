import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ArticleForm from "../form";

export default function ArticlesPage() {
    return (
        <div className="space-y-6">
            <div className="flex w-full justify-between">
                <h1 className="text-2xl font-bold">Create Articles</h1>

                <Button asChild variant="outline">
                    <Link href="/dashboard/articles">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Link>
                </Button>
            </div>

            <ArticleForm />
        </div>
    );
}  