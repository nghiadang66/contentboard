import { AlertCircle } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function ErrorAlert({ message, title = "Error" }: { message: string, title?: string }) {
  return (
    <Alert variant="destructive" className="border-red-500 bg-red-50">
      <AlertCircle className="h-4 w-4 mb-2" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
}