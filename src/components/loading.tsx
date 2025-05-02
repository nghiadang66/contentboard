import { Loader2 } from "lucide-react";

export function Loading({ 
    message = 'Loading...', 
    children, // Skeleton
}: { 
    message?: string, 
    children?: React.ReactNode 
}) {
    return (
        <div className="space-y-6 animate-pulse">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{message}</span>
          </div>
          {children}
        </div>
    );
}