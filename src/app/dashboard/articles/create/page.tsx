import ArticleForm from "./form";

export default function ArticlesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Create Article</h1>

            <ArticleForm />
        </div>
    );
}  