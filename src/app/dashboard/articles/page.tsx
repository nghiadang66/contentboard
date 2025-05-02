import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ArticleTable from "./table";

export default function ArticlesPage() {
    return (
        <div className="space-y-6">
            <div className="flex w-full justify-between">
                <h1 className="text-2xl font-bold">Articles</h1>

                <Button asChild>
                    <Link href="/dashboard/articles/create">
                        <Plus /> Create New
                    </Link>
                </Button>
            </div>

            <ArticleTable />
        </div>
    );
}  