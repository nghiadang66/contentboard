import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { toInt } from "@/lib/utils";
import { genSlug } from "@/lib/utils";

async function generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = genSlug(title);
    let slug = baseSlug;
    let suffix = 1;

    while (await prisma.article.findUnique({ where: { slug }})) {
        slug = baseSlug + '-' + suffix;
        suffix++;
    }

    return slug;
}

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
        orderBy = 'createdAt';
    }

    if (!['asc', 'desc'].includes(sort)) {
        sort = 'desc';
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

export async function POST(req: NextRequest) {
    const body = await req.json();

    const {
        title,
        content,
        status,
        category,
        tags = [],
    } = body;

    if (!title || !content || !status) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const slug = await generateUniqueSlug(title);

    const data = {
        title,
        slug,
        content,
        status: { connect: { id: status }},
        category: category ? { connect: { id: category }} : undefined,
        tags: { connect: tags.map((id: string) => ({ id }))}
    }

    const article = await prisma.article.create({ data });

    return NextResponse.json(article);
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const {
        id,
        title,
        content,
        status,
        category,
        tags = [],
    } = body;

    if (!id || !title || !content || !status) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const existing = await prisma.article.findUnique({
        where: { id },
    });

    if (!existing) {
        return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    let slug = existing.slug;

    if (existing.title !== title) {
        slug = await generateUniqueSlug(title);
    }

    const data = {
        title,
        slug,
        content,
        status: { connect: { id: status } },
        category: category ? { connect: { id: category } } : undefined,
        tags: {
            set: tags.map((id: string) => ({ id })), // full replace
        },
    };

    const updated = await prisma.article.update({
        where: { id },
        data,
    });

    return NextResponse.json(updated);
}