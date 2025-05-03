export const runtime = "nodejs"; // ✅ fix the Edge Runtime restriction

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        const article = await prisma.article.findUnique({
            where: { id },
            include: {
                category: true,
                tags: true,
                status: true,
            },
        });

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: article.id,
            title: article.title,
            content: article.content,
            status: article.statusId,
            category: article.categoryId,
            tags: article.tags.map((t) => t.id),
        });
    } catch (err) {
        console.error("GET /api/articles/[id] failed:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
  
    if (!id) {
        return NextResponse.json({ error: "Missing article ID." }, { status: 400 });
    }
  
    try {
        const existing = await prisma.article.findUnique({ where: { id } });
    
        if (!existing) {
            return NextResponse.json({ error: "Article not found." }, { status: 404 });
        }
    
        await prisma.article.delete({ where: { id } });
    
        return NextResponse.json({ message: "Article deleted successfully." });
    } catch (err) {
        console.error("DEL /api/articles/[id] failed:", err);
        return NextResponse.json({ error: "Failed to delete article." }, { status: 500 });
    }
}