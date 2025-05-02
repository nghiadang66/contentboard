import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const name = req.nextUrl.searchParams.get('name') ?? '';

    const status = await prisma.status.findMany({
        where: {
            name: {
                contains: name,
            }
        }
    });

    return NextResponse.json(status);
}