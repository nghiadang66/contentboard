export enum ArticleStatus {
    draft,
    published
}

export interface Article {
    id: string,
    title: string,
    slug: string,
    content: string,
    category: string,
    tags: string[],
    status: ArticleStatus,
    createdAt: string
}