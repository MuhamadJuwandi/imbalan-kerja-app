import { Sidebar } from "@/components/layout/sidebar";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
