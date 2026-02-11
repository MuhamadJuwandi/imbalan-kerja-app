"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calculator } from "lucide-react";

export function CalculationView() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/calculate", {
                method: "POST",
                body: JSON.stringify({ valDate: new Date() }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setResult(data);
        } catch (error) {
            alert("Perhitungan gagal: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Kontrol Perhitungan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleCalculate} disabled={loading} size="lg">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                            Jalankan Valuasi (PUC Method)
                        </Button>
                        {result && (
                            <div className="text-right flex-1">
                                <p className="text-sm text-muted-foreground">Total Kewajiban (PVDBO)</p>
                                <p className="text-2xl font-bold text-primary">Rp {Number(result.totalPVDBO).toLocaleString('id-ID')}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle>Hasil Perhitungan per Karyawan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">NIK</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Nama</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">PVDBO</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Biaya Jasa (CSC)</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Bunga (IC)</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {result.details.map((row: any) => (
                                        <tr key={row.employeeId} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{row.nik}</td>
                                            <td className="p-4 align-middle">{row.name}</td>
                                            <td className="p-4 align-middle text-right font-medium">
                                                Rp {Number(row.pvdbo).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                Rp {Number(row.serviceCost).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                Rp {Number(row.interestCost).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
