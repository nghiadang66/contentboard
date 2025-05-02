import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="px-6 flex-1">
                <SidebarTrigger className="my-2" />
                {children}
            </main>
        </SidebarProvider>
    );
}