import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
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
                    <p className="text-muted-foreground">Aktuaria menjadi mudah</p>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}
