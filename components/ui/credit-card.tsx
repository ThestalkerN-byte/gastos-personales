"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CreditCardContextValue {
  tilt: { x: number; y: number };
}

const CreditCardContext = React.createContext<CreditCardContextValue | null>(
  null
);

function useCreditCard() {
  const ctx = React.useContext(CreditCardContext);
  if (!ctx) throw new Error("CreditCard components must be used within CreditCardFlipper");
  return ctx;
}

const MAX_TILT = 12;

interface CreditCardFlipperProps extends Omit<React.ComponentProps<"div">, "onMouseMove" | "onMouseEnter" | "onMouseLeave"> {
  children: React.ReactNode;
  flipperClassName?: string;
}

function CreditCardFlipper({
  children,
  className,
  flipperClassName,
  ...props
}: CreditCardFlipperProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const xNorm = (e.clientX - centerX) / (rect.width / 2);
    const yNorm = (centerY - e.clientY) / (rect.height / 2);
    setTilt({
      x: Math.max(-1, Math.min(1, xNorm)) * MAX_TILT,
      y: Math.max(-1, Math.min(1, yNorm)) * MAX_TILT,
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  const transform = isHovering
    ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
    : "perspective(1000px) rotateX(0deg) rotateY(0deg)";

  return (
    <CreditCardContext.Provider value={{ tilt }}>
      <div
        ref={cardRef}
        className={cn(
          "group/card min-w-[280px] max-w-[320px]",
          className
        )}
        style={{ perspective: "1000px" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <div
          className={cn("relative w-full aspect-[1.586/1]", flipperClassName)}
          style={{
            transformStyle: "preserve-3d",
            transform,
            transition: isHovering
              ? "transform 0.05s ease-out"
              : "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {children}
        </div>
      </div>
    </CreditCardContext.Provider>
  );
}

interface CreditCardSideProps extends React.ComponentProps<"div"> {
  side: "front" | "back";
}

function CreditCardSide({ side, className, children, ...props }: CreditCardSideProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 rounded-xl overflow-hidden [backface-visibility:hidden]",
        side === "back" && "[transform:rotateY(180deg)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CreditCardChip({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "size-10 rounded-md bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-sm border border-amber-600/30",
        "[clip-path:polygon(0%_0%,100%_0%,100%_70%,0%_70%)]",
        className
      )}
      {...props}
    />
  );
}

function CreditCardMagStripe({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("h-12 w-full bg-black/80 mt-6", className)}
      {...props}
    />
  );
}

function CreditCardLogo({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-end", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  CreditCardFlipper,
  CreditCardSide,
  CreditCardChip,
  CreditCardMagStripe,
  CreditCardLogo,
  useCreditCard,
};
