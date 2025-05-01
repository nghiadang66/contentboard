import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const categories = await prisma.category.findMany();
    const tags = await prisma.tag.findMany();
    const status = await prisma.status.findMany();

    return NextResponse.json({
        categories,
        tags,
        status
    });
}