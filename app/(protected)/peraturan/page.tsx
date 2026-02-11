import { Header } from "@/components/layout/header";
import { RuleForm } from "@/components/peraturan/rule-form";

export default function PeraturanPage() {
    return (
        <div className="space-y-6">
            <Header title="Peraturan Perusahaan" />
            <div className="max-w-4xl mx-auto">
                <RuleForm />
            </div>
        </div>
    );
}
