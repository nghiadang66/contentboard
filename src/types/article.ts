export interface Article {
    id: string,
    title: string,
    slug: string,
    content: string,
    category: string,
    tags: string[],
    status: string,
    createdAt: string
}