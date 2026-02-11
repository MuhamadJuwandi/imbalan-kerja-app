"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function EmployeeForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            nik: formData.get("nik"),
            name: formData.get("name"),
            dob: formData.get("dob"),
            doj: formData.get("doj"),
            salary: formData.get("salary"),
            status: formData.get("status"),
        };

        try {
            const res = await fetch("/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to create employee");

            router.refresh();
            // Reset form logic usage here or simple reload
            (e.target as HTMLFormElement).reset();
            alert("Karyawan berhasil ditambahkan!");
        } catch (error) {
            alert("Gagal menyimpan data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tambah Karyawan Baru</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nik">NIK</Label>
                            <Input id="nik" name="nik" placeholder="12345678" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Tanggal Lahir</Label>
                            <Input id="dob" name="dob" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doj">Tanggal Masuk</Label>
                            <Input id="doj" name="doj" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary">Gaji Dasar (IDR)</Label>
                            <Input id="salary" name="salary" type="number" placeholder="5000000" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue="TETAP" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TETAP">TETAP</SelectItem>
                                    <SelectItem value="KONTRAK">KONTRAK</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan Data"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
