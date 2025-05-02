import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationBlock(
    { 
        page, 
        total_pages, 
        goToPage 
    }: 
    { 
        page?: string|number,
        total_pages?: string|number,
        goToPage: Function
    }
) {
    const currentPage = Number(page ?? 1);
    const totalPages = Number(total_pages ?? 1);

    // Helper: determine which page numbers to show
    const getVisiblePages = () => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 7) {
            // show all if small
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 4) {
                pages.push("...");
            }

            for (
                let i = Math.max(2, currentPage - 1);
                i <= Math.min(totalPages - 1, currentPage + 1);
                i++
            ) {
                pages.push(i);
            }

            if (currentPage < totalPages - 3) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        aria-disabled={currentPage <= 1}
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) goToPage(currentPage - 1);
                        }}
                    />
                </PaginationItem>

                {getVisiblePages().map((p, i) =>
                    p === "..." ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={`page-${p}`}>
                            <PaginationLink
                                href="#"
                                aria-disabled={p === currentPage}
                                isActive={p === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToPage(Number(p));
                                }}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext
                        aria-disabled={currentPage >= totalPages}
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) goToPage(currentPage + 1);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}