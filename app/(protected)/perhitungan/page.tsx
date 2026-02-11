import { Header } from "@/components/layout/header";
import { CalculationView } from "@/components/perhitungan/calculation-view";

export default function PerhitunganPage() {
    return (
        <div className="space-y-6">
            <Header title="Perhitungan Aktuaria (PSAK 219)" />
            <div className="max-w-6xl mx-auto">
                <CalculationView />
            </div>
        </div>
    );
}
