import { Button } from "@/components/ui/button";
import { ArrowDownUp, ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";

export function SortButton({ 
    query, 
    orderBy, 
    label, 
    handleSort 
}: { 
    query: { [key: string]: any }, 
    orderBy: string, 
    label: string,
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
            {label}
        </Button>
    );
}