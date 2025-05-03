import { Button } from "@/components/ui/button";
import { ArrowDownUp, ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";

export function SortButton({ 
    query, 
    orderBy, 
    children, 
    handleSort 
}: { 
    query: { [key: string]: any }, 
    orderBy: string, 
    children?: React.ReactNode,
    handleSort: Function 
}) {
    return (
        <Button 
            variant="link"
            onClick={() => handleSort(orderBy)}
        >
            {query.orderBy === orderBy ? (
                query.sort === "asc" ? (
                    <ArrowUpNarrowWide />
                ): (
                    <ArrowDownNarrowWide />
                )
            ): (
                <ArrowDownUp />
            )}
            {children}
        </Button>
    );
}