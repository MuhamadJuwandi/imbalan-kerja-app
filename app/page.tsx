import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Users, Calculator } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Header */}
            <header className="px-6 py-4 flex justify-between items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <img
                        src="/logo-app.png"
                        alt="Imbalan Kerja Logo"
                        className="h-10 w-auto object-contain"
                    />
                </div>
                <nav className="flex gap-4">
                    <Link href="/login">
                        <Button variant="ghost">Masuk</Button>
                    </Link>
                    <Link href="/register">
                        <Button>Daftar Sekarang</Button>
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto space-y-8">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                    Hitung Imbalan Kerja <br />
                    <span className="text-primary">Cepat, Tepat, & Sesuai Regulasi</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Aplikasi valuasi aktuaria berbasis web untuk perhitungan kewajiban imbalan kerja sesuai PSAK 219 dan PP 35/2021.
                    Kelola data karyawan dan peraturan perusahaan dalam satu platform aman.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link href="/register">
                        <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg">
                            Mulai Gratis <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-lg">
                            Demo Akun
                        </Button>
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
                    <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                        <Users className="h-10 w-10 text-primary mb-4" />
                        <h3 className="font-bold text-lg mb-2">Manajemen Pegawai</h3>
                        <p className="text-muted-foreground">Database karyawan terintegrasi dengan riwayat gaji dan masa kerja.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                        <Calculator className="h-10 w-10 text-primary mb-4" />
                        <h3 className="font-bold text-lg mb-2">Valuasi Otomatis</h3>
                        <p className="text-muted-foreground">Metode Projected Unit Credit (PUC) dengan parameter akturaria yang dapat disesuaikan.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                        <Lock className="h-10 w-10 text-primary mb-4" />
                        <h3 className="font-bold text-lg mb-2">Data Aman</h3>
                        <p className="text-muted-foreground">Setiap perusahaan memiliki akun terpisah. Privasi data terjamin.</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-sm text-muted-foreground border-t">
                &copy; {new Date().getFullYear()} ImbalanKerja.id. All rights reserved.
            </footer>
        </div>
    );
}
