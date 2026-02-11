import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calculator, FileText, Activity } from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { format } from "date-fns";

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id) : null;

    // Default values if not logged in or no data
    let employeeCount = 0;
    let totalLiability = 0;
    let serviceCost = 0;
    let employeeGrowth = 0; // Placeholder for now

    if (userId) {
        // Fetch Real Data
        const [empCount, liabilityAgg, serviceCostAgg] = await Promise.all([
            prisma.employee.count({ where: { userId } }),
            prisma.actuarialResult.aggregate({
                _sum: { pvdbo: true },
                where: { userId }
            }),
            prisma.actuarialResult.aggregate({
                _sum: { serviceCost: true },
                where: { userId }
            })
        ]);

        employeeCount = empCount;
        totalLiability = liabilityAgg._sum.pvdbo ? Number(liabilityAgg._sum.pvdbo) : 0;
        serviceCost = serviceCostAgg._sum.serviceCost ? Number(serviceCostAgg._sum.serviceCost) : 0;
    }

    // Currency Formatter
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Compact Formatter for Cards (e.g. 4.2M)
    const formatCompact = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            notation: "compact",
            compactDisplay: "short",
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 1
        }).format(value);
    };


    return (
        <div className="space-y-6">
            <Header title="Dashboard Overview" />

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Karyawan
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{employeeCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Aktif
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Liabilitas (PVDBO)
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCompact(totalLiability)}</div>
                        <p className="text-xs text-muted-foreground">
                            Per {format(new Date(), 'dd MMM yyyy')}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Biaya Jasa Kini
                        </CardTitle>
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCompact(serviceCost)}</div>
                        <p className="text-xs text-muted-foreground">
                            Tahun Berjalan
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Laporan Terakhir
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalLiability > 0 ? "Tersedia" : "Belum Ada"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            PSAK 219
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Charts Placeholder */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview Proyeksi</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-slate-50 rounded-md">
                            {totalLiability > 0
                                ? "Grafik Proyeksi Kewajiban (Akan muncul setelah perhitungan)"
                                : "Belum ada data perhitungan untuk ditampilkan."}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Aktivitas Terakhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Static for now, can be connected to real logs later */}
                            {employeeCount > 0 ? (
                                <div className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Data Karyawan Diupdate</p>
                                        <p className="text-xs text-muted-foreground">Baru saja</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
