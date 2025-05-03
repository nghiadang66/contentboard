"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import ArticleForm from "../../form";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditArticleClientPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/articles/${id}`)
        .then((res) => res.json())
        .then(setData)
        .catch((err) => {
            console.error("Failed to load article data.")
            toast.error("Failed to load article data.", {
                description: (err as Error).message
            });
        })
        .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Skeleton className="h-64 w-full" />;
    if (!data) return notFound();

    return (
        <div className="space-y-6">
            <div className="flex w-full justify-between">
                <h1 className="text-2xl font-bold">Edit Articles</h1>

                <Button asChild>
                    <Link href="/dashboard/articles">
                        <ArrowLeft /> Back
                    </Link>
                </Button>
            </div>

            <ArticleForm defaultValues={data} />;
        </div>
    )
}