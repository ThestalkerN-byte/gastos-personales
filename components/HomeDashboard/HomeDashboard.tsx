"use client";

import { useState, useCallback } from "react";
import { TarjetaFormModal } from "@/components/TarjetaForm/TarjetaForm";
import { GastosModule } from "@/components/GastosModule/GastosModule";
import { IngresosModule } from "@/components/IngresosModule/IngresosModule";
import { ResumenCard } from "@/components/ResumenCard/ResumenCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, Wallet } from "lucide-react";

export function HomeDashboard() {
  const [resumenRefreshKey, setResumenRefreshKey] = useState(0);

  const handleDataChanged = useCallback(() => {
    setResumenRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-end gap-2">
        <TarjetaFormModal />
      </div>

      <ResumenCard refreshKey={resumenRefreshKey} />

      <Tabs defaultValue="gastos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="gastos" className="gap-2">
            <Receipt className="h-4 w-4" />
            Gastos
          </TabsTrigger>
          <TabsTrigger value="ingresos" className="gap-2">
            <Wallet className="h-4 w-4" />
            Ingresos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gastos" className="mt-6">
          <GastosModule onDataChanged={handleDataChanged} />
        </TabsContent>
        <TabsContent value="ingresos" className="mt-6">
          <IngresosModule onDataChanged={handleDataChanged} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
