"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { Loader2, Upload } from "lucide-react";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limit size to 2MB to keep DB light (since we store base64)
        if (file.size > 2 * 1024 * 1024) {
            setError("Ukuran file maksimal 2MB");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

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

                // Update session instantly
                await update({ logo: base64 });
                setMessage("Logo berhasil diperbarui!");
            } catch (err) {
                setError("Terjadi kesalahan saat upload.");
            } finally {
                setLoading(false);
            }
        };
    };

    return (
        <div className="space-y-6">
            <Header title="Pengaturan Perusahaan" />

            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>Logo Perusahaan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400 text-xs">No Logo</span>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="logo" className="cursor-pointer">
                                <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
                                    <Upload size={16} />
                                    <span>Upload Logo Baru</span>
                                </div>
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />
                            </Label>
                            <p className="text-xs text-muted-foreground mt-2">Maksimal 2MB (JPG/PNG)</p>
                        </div>
                    </div>

                    {loading && <p className="text-sm text-blue-600 flex items-center"><Loader2 className="animate-spin mr-2 h-4 w-4" /> Mengupload...</p>}
                    {message && <p className="text-sm text-green-600 font-medium">{message}</p>}
                    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                </CardContent>
            </Card>
        </div>
    );
}
