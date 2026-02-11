import { Header } from "@/components/layout/header";
import { EmployeeForm } from "@/components/karyawan/employee-form";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

async function getEmployees() {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: { createdAt: "desc" },
        });
        return employees;
    } catch (error) {
        return [];
    }
}

export default async function KaryawanPage() {
    const employees = await getEmployees();

    return (
        <div className="space-y-6">
            <Header title="Manajemen Karyawan" />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <EmployeeForm />
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-md border bg-white">
                        <div className="p-4 border-b">
                            <h3 className="font-semibold text-lg">Daftar Karyawan ({employees.length})</h3>
                        </div>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">NIK</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Nama</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Tgl Lahir / Masuk</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Gaji</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {employees.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">Belum ada data karyawan.</td>
                                        </tr>
                                    ) : (
                                        employees.map((emp) => (
                                            <tr key={emp.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle font-medium">{emp.nik}</td>
                                                <td className="p-4 align-middle">{emp.name}</td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex flex-col text-xs">
                                                        <span className="text-muted-foreground">Lahir: {format(new Date(emp.dob), 'dd/MM/yyyy')}</span>
                                                        <span className="text-primary font-medium">Masuk: {format(new Date(emp.doj), 'dd/MM/yyyy')}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle text-right font-medium">
                                                    Rp {Number(emp.salary).toLocaleString('id-ID')}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                                        {emp.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
