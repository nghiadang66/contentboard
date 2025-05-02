import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { toInt } from "@/lib/utils";

export async function GET(req: NextRequest) {
    const name = req.nextUrl.searchParams.get('name') ?? '';
    let orderBy = req.nextUrl.searchParams.get('orderBy') ?? '';
    let sort = req.nextUrl.searchParams.get('sort') ?? '';
    let limit = toInt(req.nextUrl.searchParams.get('limit'), 100);
    let page = toInt(req.nextUrl.searchParams.get('page'), 1);

    if (!['id', 'name'].includes(orderBy)) {
        orderBy = 'name';
    }

    if (!['asc', 'desc'].includes(sort)) {
        sort = 'asc';
    }

    const where = {
        name: {
            contains: name
        }
    }

    const total_results = await prisma.category.count({ where });

    const total_pages = Math.ceil(total_results / limit);
    const skip = (page - 1) * limit;

    const categories = await prisma.category.findMany({
        where,
        orderBy: {
            [orderBy]: sort,
        },
        take: limit,
        skip
    });

    return NextResponse.json({
        query: {
            name,
            orderBy,
            sort,
            limit,
            page,
            total_pages,
            total_results
        },
        categories
    });
}