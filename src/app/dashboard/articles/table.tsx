"use client"

import { useState, useEffect } from "react";
import {
    Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"; 
import { Article } from "@/generated/prisma";
import { Loading } from "@/components/loading";
import { PaginationBlock } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { SortButton } from "@/components/sort-button";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

type ArticleWithRelations = Article & {
    category?: { name: string };
    status?: { name: string };
    tags?: { name: string }[];
};

export default function ArticleTable() {
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState<{ [key: string]: string }>({});
    const [data, setData] = useState<ArticleWithRelations[]>([]);
    const [serverQuery, setServerQuery] = useState<{
        page?: string;
        total_pages?: string;
        [key: string]: any;
    }>({});

    useEffect(() => {
        const search = new URLSearchParams(query).toString();
        fetch("/api/articles?" + search)
            .then(res => res.json())
            .then(({ query, articles }) => {
                setData(articles);
                setServerQuery(query);
            })
            .catch(err => {
                console.error("Failed to load article data.", err);
                toast.error("Failed to load article data.", {
                    description: (err as Error).message
                });
            })
            .finally(() => setLoading(false));
    }, [query]);

    function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery({
            ...serverQuery,
            content: event.target.value,
        });
    }

    function handleSort(orderBy: string) {
        setQuery({
            ...serverQuery,
            orderBy,
            sort: serverQuery.orderBy !== orderBy ? "asc" : (serverQuery.sort !== "asc" ? "asc" : "desc")
        });
    }

    function goToPage(page: number) {
        setQuery({
            ...serverQuery,
            page: page.toString()
        });
    }

    async function handleDelete(id: string) {
        await toast.promise(
            fetch(`/api/articles/${id}`, {
                method: "DELETE",
            }).then(async res => {
                const result = await res.json();
                if (!res.ok) throw new Error(result.error || "Unknown error");
                return result;
            }),
            {
                loading: "Deleting...",
                success: "Article deleted.",
                error: "Failed to delete article.",
            }
        );

        setQuery({ ...serverQuery });
    }
      
    
    return (
        <div className="space-y-6">
            {loading ? <Loading /> : ""}
            
            <div className="w-full max-w-[480px]">
                <SearchBar value={query.content} onChange={onSearchChange} />
            </div>

            <h2 className="font-semibold">Total: {Number(serverQuery.total_results ?? 0)}</h2>

            <Table>
                <TableCaption>
                    Total per page: {Number(serverQuery.limit ?? 1)}. Pages: {Number(serverQuery.total_pages ?? 1)}.
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">
                            <SortButton 
                                query={serverQuery} 
                                orderBy="title" 
                                handleSort={handleSort} 
                            >Title</SortButton>
                        </TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[120px]">Category</TableHead>
                        <TableHead className="w-[120px]">Tags</TableHead>
                        <TableHead className="text-right w-[120px]">
                            <SortButton 
                                query={serverQuery} 
                                orderBy="createdAt"
                                handleSort={handleSort} 
                            >Created At</SortButton>
                        </TableHead>
                        <TableHead className="text-right w-[120px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(a => (
                        <TableRow key={a.id}>
                            <TableCell>
                                <span className="font-medium">{a.title}</span><br/>
                                <span className="italic text-xs">{a.slug}</span><br/>
                            </TableCell>
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
                            <TableCell className="flex space-x-2">
                            <Button asChild>
                                <Link href={`/dashboard/articles/edit/${a.id}`}>
                                    <Pencil className="h-4 w-4" />
                                </Link>
                            </Button>
                            <ConfirmDialog 
                                title="Delete Article"
                                message="Do you really want to delete this article?"
                                triggerChildren={
                                    <Button variant="destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                }
                                confirmChildren={
                                    <Button variant="destructive" onClick={() => handleDelete(a.id)}>
                                        Delete
                                    </Button>
                                }
                            />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <PaginationBlock
                page={serverQuery.page}
                total_pages={serverQuery.total_pages}
                goToPage={goToPage}
            />

        </div>
    );
}
  