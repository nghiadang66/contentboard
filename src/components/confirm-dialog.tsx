import {
    Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({ 
    triggerChildren,
    confirmChildren,
    title = "Are you sure?",
    message = "Do you want to continue?",
}: { 
    triggerChildren: React.ReactNode,
    confirmChildren: React.ReactNode,
    title?: string,
    message?: string,
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {triggerChildren}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <p>{message}</p>
                <DialogFooter className="pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                        Close
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        {confirmChildren}
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}