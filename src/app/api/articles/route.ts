import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { toInt } from "@/lib/utils";

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get('title') ?? '';
    const slug = req.nextUrl.searchParams.get('slug') ?? '';
    const content = req.nextUrl.searchParams.get('content') ?? '';
    const status = req.nextUrl.searchParams.get('status') ?? '';
    let orderBy = req.nextUrl.searchParams.get('orderBy') ?? '';
    let sort = req.nextUrl.searchParams.get('sort') ?? '';
    let limit = toInt(req.nextUrl.searchParams.get('limit'), 100);
    let page = toInt(req.nextUrl.searchParams.get('page'), 1);

    if (!['id', 'title', 'createdAt'].includes(orderBy)) {
        orderBy = 'title';
    }

    if (!['asc', 'desc'].includes(sort)) {
        sort = 'asc';
    }

    const where: any = {
        title: { contains: title },
        slug: { contains: slug },
        content: { contains: content }
    }

    if (status) {
        where.status = {
            is: { id: status }, // status is a relation, so use "is"
        };
    }

    const total_results = await prisma.article.count({ where });

    const total_pages = Math.ceil(total_results / limit);
    const skip = (page - 1) * limit;

    const articles = await prisma.article.findMany({
        where,
        orderBy: {
            [orderBy]: sort,
        },
        take: limit,
        skip,
        include: {
            category: true,
            tags: true,
            status: true, // include relations for display
        },
    });

    return NextResponse.json({
        query: {
            title,
            slug,
            content,
            status,
            orderBy,
            sort,
            limit,
            page,
            total_pages,
            total_results
        },
        articles
    });
}