"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, BookOpen, Calculator, Menu } from "lucide-react";
import { useState } from "react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Manajemen Karyawan",
        href: "/karyawan",
        icon: Users,
    },
    {
        title: "Peraturan Perusahaan",
        href: "/peraturan",
        icon: BookOpen,
    },
    {
        title: "Perhitungan Aktuaria",
        href: "/perhitungan",
        icon: Calculator,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                <Menu size={24} />
            </button>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-[#516f54] text-white",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="h-full px-3 py-4 overflow-y-auto">
                    {/* Logo / Brand */}
                    <div className="flex items-center ps-2.5 mb-8 mt-4 gap-3">
                        <div className="bg-white/10 p-1.5 rounded-lg flex-shrink-0 backdrop-blur-sm">
                            <img
                                src="/logo-symbol.png"
                                alt="Logo"
                                className="h-8 w-8 object-contain"
                            />
                        </div>
                        <span className="self-center text-lg font-bold whitespace-nowrap text-white">
                            ImbalanKerja.id
                        </span>
                    </div>

                    {/* Navigation */}
                    <ul className="space-y-2 font-medium">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center p-2 rounded-lg hover:bg-white/10 group transition-colors",
                                            isActive ? "bg-white/20 text-secondary" : "text-white"
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                "w-5 h-5 transition duration-75",
                                                isActive ? "text-secondary" : "text-gray-300 group-hover:text-white"
                                            )}
                                        />
                                        <span className="ms-3">{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Footer / Version */}
                <div className="absolute bottom-4 left-0 w-full px-4 text-xs text-center text-gray-400">
                    v1.0.0 Alpha
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
