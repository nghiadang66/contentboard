import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ArticleForm from "./form";

export default function ArticlesPage() {
    return (
        <div className="space-y-6">
            <div className="flex w-full justify-between">
                <h1 className="text-2xl font-bold">Create Articles</h1>

                <Button asChild>
                    <Link href="/dashboard/articles">
                        <ArrowLeft /> Back
                    </Link>
                </Button>
            </div>

            <ArticleForm />
        </div>
    );
}  