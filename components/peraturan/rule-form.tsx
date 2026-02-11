"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

export function RuleForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        retirementAge: "55",
        pensionMultiplier: "1.75",
        disabilityMult: "2.0",
        deathMult: "2.0",
        resignMult: "0.0"
    });

    useEffect(() => {
        // Fetch current rules
        fetch("/api/company-rules")
            .then((res) => res.json())
            .then((data) => {
                if (data && !data.error) {
                    setFormData({
                        retirementAge: String(data.retirementAge || 55),
                        pensionMultiplier: String(data.pensionMultiplier || 1.75),
                        disabilityMult: String(data.disabilityMult || 2.0),
                        deathMult: String(data.deathMult || 2.0),
                        resignMult: String(data.resignMult || 0.0),
                    });
                }
            })
            .finally(() => setFetching(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/company-rules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update rules");

            alert("Peraturan Perusahaan berhasil diperbarui!");
            router.refresh();
        } catch (error) {
            alert("Gagal menyimpan perubahan.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Parameter Aktuaria</CardTitle>
                <CardDescription>
                    Pengaturan asumsi dasar untuk perhitungan imbalan kerja sesuai PP 35/2021.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="retirementAge">Usia Pensiun Normal</Label>
                            <Input
                                id="retirementAge"
                                name="retirementAge"
                                type="number"
                                value={formData.retirementAge}
                                onChange={handleChange}
                                required
                            />
                            <p className="text-xs text-muted-foreground">Tahun</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-sm">Faktor Pengali Manfaat (PP 35/2021)</h4>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="pensionMultiplier">Manfaat Pensiun</Label>
                                <Input
                                    id="pensionMultiplier"
                                    name="pensionMultiplier"
                                    type="number"
                                    step="0.01"
                                    value={formData.pensionMultiplier}
                                    onChange={handleChange}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Default: 1.75 x UP</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deathMult">Meninggal Dunia</Label>
                                <Input
                                    id="deathMult"
                                    name="deathMult"
                                    type="number"
                                    step="0.01"
                                    value={formData.deathMult}
                                    onChange={handleChange}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Default: 2.00 x UP</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="disabilityMult">Cacat Tetap</Label>
                                <Input
                                    id="disabilityMult"
                                    name="disabilityMult"
                                    type="number"
                                    step="0.01"
                                    value={formData.disabilityMult}
                                    onChange={handleChange}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Default: 2.00 x UP</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="resignMult">Mengundurkan Diri</Label>
                                <Input
                                    id="resignMult"
                                    name="resignMult"
                                    type="number"
                                    step="0.01"
                                    value={formData.resignMult}
                                    onChange={handleChange}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Default: 0.00 (Hanya Uang Pisah)</p>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Simpan Perubahan
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
