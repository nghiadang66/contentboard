import { Input } from "@/components/ui/input";

export function SearchBar({ 
    value, 
    onChange 
}: { 
    value?: string, 
    onChange: React.ChangeEventHandler 
}) {
    return (
        <Input type="search" placeholder="Search..." 
            value={value ?? ""} 
            onChange={onChange}
        />
    );
}