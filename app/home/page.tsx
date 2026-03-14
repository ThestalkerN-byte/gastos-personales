import { GastoFormModal } from "@/components/GastoForm/GastoForm";
import { TarjetaFormModal } from "@/components/TarjetaForm/TarjetaForm";
export default function Home() {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap:'1rem' }}>
      <GastoFormModal />
      <TarjetaFormModal/>
    </div>
  );
}
