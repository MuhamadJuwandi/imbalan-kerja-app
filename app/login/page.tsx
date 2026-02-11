import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <img
                            src="/logo-app.png"
                            alt="Imbalan Kerja Logo"
                            className="h-12 w-auto object-contain"
                        />
                    </div>
                    <p className="text-muted-foreground">Masuk untuk mengelola valuasi</p>
                </div>
                <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary" /></div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
