"use client";

import * as React from "react";
import { Tarjeta } from "@/core/domain/entities/Tarjeta";
import { cn } from "@/lib/utils";
import {
  CreditCardFlipper,
  CreditCardSide,
  CreditCardChip,
  CreditCardMagStripe,
  CreditCardLogo,
} from "@/components/ui/credit-card";

interface TarjetaCardProps {
  tarjeta: Tarjeta;
  selected?: boolean;
  onClick?: () => void;
}

function TarjetaCardContent({ tarjeta, selected }: Omit<TarjetaCardProps, "onClick">) {
  const isCredito = tarjeta.tipo?.toLowerCase().includes("credito");
  const gradientClass = isCredito
    ? "bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800"
    : "bg-gradient-to-br from-slate-600 via-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600";

  return (
    <>
      <CreditCardSide side="front" className={gradientClass}>
        <div
          className="absolute inset-0 text-left rounded-xl cursor-default"
          aria-hidden
        >
          <div className="flex flex-col h-full p-6 text-white">
            <div className="flex items-start justify-between">
              <CreditCardChip />
              <CreditCardLogo>
                <span className="text-[10px] font-semibold uppercase tracking-widest opacity-90">
                  {tarjeta.tipo}
                </span>
              </CreditCardLogo>
            </div>

            <div className="mt-auto space-y-1">
              <p className="text-[10px] uppercase tracking-widest opacity-60">
                Titular
              </p>
              <p className="text-base font-semibold tracking-widest truncate">
                {tarjeta.nombre}
              </p>
            </div>
          </div>
        </div>

        {selected && (
          <div className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-primary ring-2 ring-white/50">
            <svg
              className="size-3.5 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </CreditCardSide>

      <CreditCardSide side="back" className={gradientClass}>
        <div
          className="absolute inset-0 text-left rounded-xl cursor-default"
          aria-hidden
        >
          <CreditCardMagStripe />
          <div className="px-6 pt-4">
            <div className="h-8 w-3/4 rounded bg-white/20" />
            <p className="mt-4 text-[10px] text-white/60 uppercase">
              {tarjeta.nombre}
            </p>
          </div>
        </div>
      </CreditCardSide>
    </>
  );
}

export function TarjetaCard({ tarjeta, selected, onClick }: TarjetaCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "block w-full text-left transition-all",
        "hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      <CreditCardFlipper
        flipperClassName={cn(
          "rounded-xl border-2 shadow-lg overflow-hidden transition-colors",
          selected ? "border-primary ring-2 ring-primary/50" : "border-transparent"
        )}
      >
        <TarjetaCardContent tarjeta={tarjeta} selected={selected} />
      </CreditCardFlipper>
    </button>
  );
}
