"use client"

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Article } from "@/generated/prisma";
import { Loading } from "@/components/loading";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input"
import { ErrorAlert } from "@/components/error-alert";

type ArticleWithRelations = Article & {
    category?: { name: string };
    status?: { name: string };
    tags?: { name: string }[];
  };

export default function ArticleTable() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState<{ [key: string]: string }>({});
    const [data, setData] = useState<ArticleWithRelations[]>([]);
    const [serverQuery, setServerQuery] = useState({});

    useEffect(() => {
        const search = new URLSearchParams(query).toString();
        setError("");
        setLoading(true);

        fetch("/api/articles?" + search)
            .then(res => res.json())
            .then(({ query, articles }) => {
                setData(articles);
                setServerQuery(query);
            })
            .catch(err => {
                console.error("Failed to load article table data:", err);
                setError("Failed to load article table data.");
            })
            .finally(() => setLoading(false));
    }, [JSON.stringify(query)]);

    function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery({
            ...serverQuery,
            content: event.target.value,
        });
    }
    
    return (
        <div className="space-y-6">
            {error ? <ErrorAlert message={error} /> : ""}

            <div className="w-full max-w-[480px]">
                <Input type="search" placeholder="Search..." 
                    value={query.content || ""} 
                    onChange={onSearchChange} 
                />
            </div>

            {loading ? (
                <Loading>
                    <Skeleton className="h-48 w-full"/>
                </Loading>
            ) : (
                <Table>
                    <TableCaption>A list of your recent articles.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Title</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead className="w-[120px]">Status</TableHead>
                            <TableHead className="w-[120px]">Category</TableHead>
                            <TableHead className="w-[120px]">Tags</TableHead>
                            <TableHead className="text-right w-[120px]">Created at</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(a => (
                            <TableRow key={a.id}>
                                <TableCell className="font-medium">{a.title}</TableCell>
                                <TableCell>
                                    <div 
                                        className="text-justify max-h-[60px] overflow-hidden text-ellipsis line-clamp-3"
                                        dangerouslySetInnerHTML={{
                                            __html: a.content
                                        }} 
                                    />
                                    </TableCell>
                                <TableCell>{a.status?.name ?? "-"}</TableCell>
                                <TableCell>{a.category?.name ?? "-"}</TableCell>
                                <TableCell>{a.tags?.map(t => t.name).join(", ") ?? "-"}</TableCell>
                                <TableCell className="text-right">
                                    {new Date(a.createdAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
  