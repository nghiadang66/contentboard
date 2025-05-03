import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import remarkBreaks from "remark-breaks";

interface PageProps {
    params: { id: string };
}

export default async function ArticleViewPage({ params }: PageProps) {
    const article = await prisma.article.findUnique({
        where: { id: params.id },
        include: {
            category: true,
            status: true,
            tags: true,
        },
    });

    if (!article) return notFound();

    return (
        <div className="space-y-6 mb-12">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{article.title}</h1>
        
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href={`/dashboard/articles/edit/${params.id}`}>
                            <Pencil className="h-4 w-4" /> Edit
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/articles">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Link>
                    </Button>
                </div>
            </div>

            <p className="text-sm text-muted-foreground italic">
                Status: {article.status.name} · Category: {article.category?.name ?? "-"} ·{" "}
                {new Date(article.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">
                Tags: {article.tags.map(t => t.name).join(", ") || "-"}
            </p>

            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {article.content}
            </ReactMarkdown>
        </div>
    );
}