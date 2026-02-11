"use client";

import { useSession } from "next-auth/react";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Header({ title }: { title: string }) {
    const { data: session, status } = useSession();
    const user = session?.user;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Manage image version to force refresh after upload
    const [imageVersion, setImageVersion] = useState(Date.now());
    const [hasLogo, setHasLogo] = useState(false);

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
        : "A";

    const logoUrl = user?.image ? `${user.image}?v=${imageVersion}` : null;

    // Check if logo actually exists (to handle 404 from API)
    useEffect(() => {
        if (logoUrl) {
            const img = new Image();
            img.src = logoUrl;
            img.onload = () => setHasLogo(true);
            img.onerror = () => setHasLogo(false);
        }
    }, [logoUrl]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran file maksimal 2MB");
            return;
        }

        setUploading(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64 = reader.result as string;

            try {
                const res = await fetch("/api/user/logo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ logo: base64 }),
                });

                if (!res.ok) throw new Error("Gagal mengupload logo");

                // Update version to force reload image
                setImageVersion(Date.now());
                setHasLogo(true); // Optimistic

            } catch (err) {
                console.error(err);
                alert("Gagal mengupload logo");
            } finally {
                setUploading(false);
            }
        };
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">{user?.name || "Administrator"}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                </div>

                <div
                    className={cn(
                        "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border shadow-sm cursor-pointer relative group",
                        uploading && "opacity-50 pointer-events-none"
                    )}
                    onClick={handleAvatarClick}
                    title="Klik untuk ganti logo"
                >
                    {status === "loading" || uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : hasLogo && logoUrl ? (
                        <>
                            <img
                                key={logoUrl} // Force instance recreation
                                src={logoUrl}
                                alt="Logo"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="w-4 h-4 text-white" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-full h-full bg-primary text-secondary flex items-center justify-center font-bold text-lg">
                                {initials}
                            </div>
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="w-4 h-4 text-white" />
                            </div>
                        </>
                    )}
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
        </header>
    );
}
