import { PrismaClient } from "@/generated/prisma";
import { genSlug } from "@/lib/utils";
import { Status } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const draft = await prisma.status.upsert({
    where: { name: "draft" },
    update: {},
    create: { name: "draft" }
  });

  const published = await prisma.status.upsert({
    where: { name: "published" },
    update: {},
    create: { name: "published" }
  });

  await sample(draft);
}

async function sample(stt: Status) {
    const cat = await prisma.category.create({ data: { name: "Tutorials" } });
    const tag = await prisma.tag.create({ data: { name: "Next.js" } });
    const tag2 = await prisma.tag.create({ data: { name: "Tailwind" } });

    await prisma.article.create({
        data: {
            title: "Getting Started with Next.js",
            slug: genSlug("Getting Started with Next.js"),
            content: "This is a guide for beginners.",
            statusId: stt.id,
            categoryId: cat.id,
            tags: {
                connect: [
                    { id: tag.id },
                    { id: tag2.id }
                ]
            }
        }
    })
}

main().finally(() => prisma.$disconnect());