"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Category, Status, Tag } from "@/generated/prisma";
import { Loading } from "@/components/loading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import ReactSelect from "react-select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const formSchema = z.object({
    id: z.string().optional(),
    title: z.string().trim().nonempty("Field is required").max(75),
    content: z.string().trim().nonempty("Field is required"),
    category: z.string().trim(),
    tags: z.array(z.string().trim()),
    status: z.string().trim().nonempty("Field is required")
});

type FormSchema = z.infer<typeof formSchema>;

export default function ArticleForm({ 
    defaultValues = {
        id: "",
        title: "",
        content: "",
        category: "",
        tags: [],
        status: "",
    }
}: {
    defaultValues?: {
        id: string,
        title: string,
        content: string,
        category: string,
        tags: string[],
        status: string,
    }
}) {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues
    });
    const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [status, setStatus] = useState<Status[]>([]);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const [statusRes, categoryRes, tagRes] = await Promise.all([
                    fetch("/api/status"),
                    fetch("/api/categories"),
                    fetch("/api/tags"),
                ]);
            
                const status = await statusRes.json();
                const { categories } = await categoryRes.json();
                const { tags } = await tagRes.json();
            
                setStatus(status);
                setCategories(categories);
                setTags(tags);
            } catch (err) {
                console.error("Failed to load article options.", err);
                toast.error("Failed to load article options.", {
                    description: (err as Error).message
                });
            } finally {
                setLoading(false);
            }
        }
        
        fetchOptions();
    }, []);

    function onSubmit(values: FormSchema) {
        const method = values.id ? "PUT" : "POST";

        toast.promise(
            fetch("/api/articles", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }).then(async (res) => {
                const result = await res.json();
                if (!res.ok) throw new Error(result.error || "Unknown error");
                return result;
            }),
            {
              loading: "Saving article...",
              success: "Article saved successfully!",
              error: (err) => `Failed to save article: ${err.message}`,
            }
        );
    }

    if (loading) return (
        <Loading>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </Loading>
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormDescription>
                                Slug auto-generated from Title.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Status */}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {status.map(stt => (
                                        <SelectItem key={stt.id} value={stt.id}>
                                            {stt.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Category */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Tags */}
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <ReactSelect
                                    isMulti
                                    className="text-sm"
                                    options={tags.map(tag => ({ label: tag.name, value: tag.id }))}
                                    value={field.value.map(id => {
                                        const tag = tags.find(tag => tag.id === id);
                                        return tag ? { label: tag.name, value: tag.id } : null;
                                    }).filter(Boolean)}
                                    onChange={val => field.onChange(val.map(v => v?.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Content */}
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <MDEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    height={500}
                                    preview="edit"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit */}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Saving..." : "Submit"}
                </Button>
            </form>
        </Form>
    );
}